import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PostDetail from '@/components/post/PostDetail';
import { getAllPosts } from '@/lib/github';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const posts = await getAllPosts();

  const { slug } = await params;

  const post = posts.find(p => p.slug === decodeURIComponent(slug));

  if (!post) {
    return {
      title: '404',
      description: '페이지를 찾을 수 없습니다.',
    };
  }

  const contentPreview =
    post.content.replace(/#\S+\s|#\s\S+\s/g, '').replace(/!\[\[.*?\]\]/g, '').length > 300
      ? `${post.content
          .replace(/#\S+\s|#\s\S+\s/g, '')
          .replace(/!\[\[.*?\]\]/g, '')
          .slice(0, 300)}...`
      : post.content.replace(/#\S+\s|#\s\S+\s/g, '').replace(/!\[\[.*?\]\]/g, '');

  const getFirstImageUrl = (content: string) => {
    const imgMatch = content.match(/!\[\[(.*?)\]\]|!\[.*?\]\((.*?)\)/);
    if (!imgMatch) return '';

    const fileName = imgMatch[1] || imgMatch[2];
    return post.images[decodeURIComponent(fileName)] || fileName;
  };

  return {
    title: post.title,
    description: contentPreview,
    openGraph: {
      title: post.title,
      description: contentPreview,
      type: 'website',
      images: [getFirstImageUrl(post.content)],
    },
    twitter: {
      title: post.title,
      description: contentPreview,
      images: [getFirstImageUrl(post.content)],
    },
  };
}

const PostPage = async ({ params }: PostPageProps) => {
  const posts = await getAllPosts();

  const { slug } = await params;

  const post = posts.find(p => p.slug === decodeURIComponent(slug));

  if (!post) {
    notFound();
  }

  return <PostDetail post={post} />;
};

export default PostPage;
