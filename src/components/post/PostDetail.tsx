/* eslint-disable import/no-extraneous-dependencies */

'use client';

import 'highlight.js/styles/tokyo-night-dark.css';

import Giscus from '@giscus/react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import { Post } from '@/types/github';

import Code from '../Code';
import styles from './PostDetail.module.css';
import TableOfContents from './TabOfContents';

interface PostDetailProps {
  post: Post;
}

const PostDetail = ({ post }: PostDetailProps) => {
  const getFirstImageUrl = (content: string) => {
    const firstFiveLines = content.split('\n').slice(0, 5).join('\n');
    const imgMatch = firstFiveLines.match(/!\[\[(.*?)\]\]|!\[.*?\]\((.*?)\)/);
    if (!imgMatch) return null;

    const fileName = imgMatch[1] || imgMatch[2];
    return post.images[decodeURIComponent(fileName)] || fileName;
  };

  const contentWithoutFirstImage = (() => {
    const lines = post.content.split('\n');
    const firstFiveLines = lines.slice(0, 5);
    const restLines = lines.slice(5);

    // 첫 5줄에서만 첫 번째 이미지 찾아서 제거하고, 줄바꿈 유지
    const processedFirstLines = firstFiveLines
      .join('\n')
      .replace(/!\[\[(.*?)\]\]|!\[.*?\]\((.*?)\)/, '')
      .split('\n');

    // 다시 모든 라인 합치기
    return [...processedFirstLines, ...restLines].join('\n');
  })();
  const firstImageUrl = getFirstImageUrl(post.content);

  const [tocItems, setTocItems] = useState<Array<{ id: string; text: string; level: number }>>([]);

  useEffect(() => {
    // DOM에서 직접 heading 태그들을 찾아서 목차 아이템 생성
    const article = document.querySelector('article > div');
    if (!article) return;

    const headings = article.querySelectorAll('h1, h2, h3');
    const items = Array.from(headings).map(heading => {
      const level = Number(heading.tagName[1]);
      const text = heading.textContent || '';
      // 이미 있는 id 사용하거나 새로 생성
      const id = heading.id || text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!heading.id) heading.id = id;
      return { id, text, level };
    });

    setTocItems(items);
  }, [post.content]);

  return (
    <div className={styles.wrapper}>
      <article className={styles.container}>
        <header className={styles.header}>
          {firstImageUrl && (
            <div className={styles.headerImageContainer}>
              <Image src={firstImageUrl} alt="" className={styles.headerImage} fill />
            </div>
          )}
          <h1 className={styles.title}>{post.title}</h1>
          <span className={styles.author}>from. 강상원</span>
          <div className={styles.meta}>
            <span className={styles.category}>{post.category}</span>
            <span className={styles.date}>{format(new Date(post.date), 'yyyy년 MM월 dd일')}</span>
          </div>
          <section className={styles.readCount}>
            <span id="busuanzi_value_page_pv" />
            <span>명의 사람들이 읽음</span>
          </section>
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>
        <div className={styles.content}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
            components={{
              code({ className, children }) {
                if (typeof children === 'string') {
                  return <code className={styles.inlineCode}>{children}</code>;
                }
                return <Code className={className}>{children}</Code>;
              },
              img({ src, alt }) {
                const imgPath = src?.match(/!\[\[(.*?)\]\]/)?.[1] || src;

                return (
                  <img
                    src={post.images[decodeURIComponent(imgPath ?? '')] || src}
                    alt={alt || ''}
                    className={styles.image}
                  />
                );
              },
              li: ({ children }) => (
                <li className={styles.li}>
                  <span>{children}</span>
                </li>
              ),
              h1: ({ children }) => (
                <h1 className={styles.h1} id={children?.toString()}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className={styles.h2} id={children?.toString()}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className={styles.h3} id={children?.toString()}>
                  {children}
                </h3>
              ),
            }}
          >
            {contentWithoutFirstImage
              .replace(/#[^\s#]+(?=\s|$)/g, '')
              .replace(/!\[\[(.*?)\]\]/g, (_, fileName) => {
                const encodedFileName = encodeURIComponent(fileName.trim());
                return `![](${encodedFileName})`;
              })}
          </ReactMarkdown>
        </div>
        <Giscus
          id="comments"
          repo="ksone02/blog-reaction"
          repoId="R_kgDONsTkyw"
          category="Announcements"
          categoryId="DIC_kwDONsTky84CmJb6"
          mapping="pathname"
          term="Welcome to @giscus/react component!"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme="https://ksone02.github.io/giscus/styles/themes/custom_blog_theme.css"
          lang="ko"
        />
      </article>
      <TableOfContents items={tocItems} />
    </div>
  );
};

export default PostDetail;

// const blockquoteStyle = css`
//   border-left: 4px solid #ea5f20;
//   margin: 1.5em 0;
//   padding: 0.5em 1em;
//   background: #f8f8f8;
//   font-style: italic;
// `;
