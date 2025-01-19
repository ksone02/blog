import PostList from '@/components/post/PostList';
import { getAllPosts } from '@/lib/github';

const Home = async () => {
  const posts = await getAllPosts();

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <PostList posts={posts} />
    </main>
  );
};

export default Home;
