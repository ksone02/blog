import Link from 'next/link';

import { Post } from '@/types/github';

import PostCard from './PostCard';
import styles from './PostList.module.css';

interface PostListProps {
  posts: Post[];
}

const PostList = ({ posts }: PostListProps) => (
  <div className={styles.container}>
    {posts.map(post => (
      <Link
        key={post.slug}
        href={`/post/${encodeURIComponent(post.slug)}`}
        className={styles.link}
        prefetch
      >
        <PostCard post={post} />
      </Link>
    ))}
  </div>
);

export default PostList;
