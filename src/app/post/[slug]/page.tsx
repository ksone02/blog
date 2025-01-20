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

  return {
    title: post?.title,
  };
}

const PostPage = async ({ params }: PostPageProps) => {
  const posts = await getAllPosts();

  const { slug } = await params;

  const post = posts.find(p => p.slug === decodeURIComponent(slug));

  if (!post) {
    notFound();
  }

  return (
    <>
      <PostDetail post={post} />
    </>
  );
};

export default PostPage;
