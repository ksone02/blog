/* eslint-disable no-console */
import { Octokit } from '@octokit/rest';
import { formatInTimeZone } from 'date-fns-tz';
import matter from 'gray-matter';

import type { Post } from '@/types/github';

const GH_TOKEN = process.env.GITHUB_TOKEN;
const GH_OWNER = process.env.GITHUB_OWNER;
const GH_REPO = process.env.GITHUB_REPO;

if (!GH_TOKEN || !GH_TOKEN.trim() || !GH_OWNER || !GH_OWNER.trim() || !GH_REPO || !GH_REPO.trim()) {
  throw new Error('Required GitHub Environments. (TOKEN | OWNER_NAME | REPO_NAME)');
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.GITHUB_OWNER || '';
const REPO = process.env.GITHUB_REPO || '';

export async function getAllPosts(): Promise<Post[]> {
  try {
    const allPosts = await recursivelyFetchPosts('');
    return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

async function recursivelyFetchPosts(path: string): Promise<Post[]> {
  if (path.includes('임시') || path.includes('.trash')) return [];

  const { data } = await octokit.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path,
  });

  if (!Array.isArray(data)) {
    throw new Error(`Invalid content format for path: ${path}`);
  }

  const processItem = async (item: (typeof data)[0]): Promise<Post[]> => {
    try {
      if (item.type === 'dir') {
        return await recursivelyFetchPosts(item.path);
      }

      if (!item.name.endsWith('.md')) {
        return [];
      }

      if (!item.path.includes('/')) {
        return [];
      }

      const content = await getFileContent(item.path);
      const { data: frontMatter, content: markdownContent } = matter(content);

      const imageMatches = markdownContent.match(/!\[\[(.*?)\]\]/g) ?? [];
      const images: Record<string, string> = {};

      if (imageMatches.length > 0) {
        await Promise.all(
          imageMatches.map(async match => {
            const imageName = match.match(/!\[\[(.*?)\]\]/)?.[1];
            if (!imageName) return;

            try {
              const imageContent = await getFileContent(imageName, true); // isImage = true
              const fileExt = imageName.split('.').pop()?.toLowerCase() || '';
              const mimeType = `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;

              images[imageName] = `data:${mimeType};base64,${imageContent}`;
            } catch (error) {
              console.error(`Failed to fetch image: ${imageName}`, error);
            }
          }),
        );
      }

      const tags = markdownContent.match(/#(?!#)\S+/g)?.map(tag => tag.slice(1)) ?? [];

      const commits = await octokit.repos.listCommits({
        owner: OWNER,
        repo: REPO,
        path: item.path,
        per_page: 1,
      });

      const utcDate =
        commits.data[0]?.commit.author?.date || frontMatter.date || new Date().toISOString();

      const fileDate = formatInTimeZone(
        new Date(utcDate),
        process.env.TIMEZONE || 'Asia/Seoul',
        'yyyy-MM-dd',
      );

      return [
        {
          slug: item.path.replace('.md', ''),
          title: frontMatter.title ?? item.name.replace('.md', ''),
          date: fileDate,
          content: markdownContent,
          tags: tags ?? [],
          category: item.path.split('/')[0],
          images,
        },
      ];
    } catch (error) {
      console.error(`Error processing ${item.path}:`, error);
      return [];
    }
  };

  const postsArrays = await Promise.all(data.map(processItem));
  return postsArrays.flat();
}

async function getFileContent(path: string, isImage: boolean = false): Promise<string> {
  const { data } = await octokit.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path,
  });

  if (Array.isArray(data) || !('content' in data)) {
    throw new Error('Invalid file content');
  }

  // 이미지면 base64 그대로 반환
  if (isImage) {
    return data.content.replace(/\n/g, ''); // GitHub API가 줄바꿈을 포함할 수 있어서 제거
  }

  // 텍스트 파일이면 기존처럼 디코딩
  return Buffer.from(data.content, 'base64').toString();
}
