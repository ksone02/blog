'use client';

import Image from 'next/image';

import { Post } from '@/types/github';

import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const contentPreview =
    post.content.replace(/#\S+\s|#\s\S+\s/g, '').replace(/!\[\[.*?\]\]/g, '').length > 300
      ? `${post.content
          .replace(/#\S+\s|#\s\S+\s/g, '')
          .replace(/!\[\[.*?\]\]/g, '')
          .slice(0, 300)}...`
      : post.content.replace(/#\S+\s|#\s\S+\s/g, '').replace(/!\[\[.*?\]\]/g, '');

  const getFirstImageUrl = (content: string) => {
    const imgMatch = content.match(/!\[\[(.*?)\]\]|!\[.*?\]\((.*?)\)/);
    if (!imgMatch) return null;

    const fileName = imgMatch[1] || imgMatch[2];
    return post.images[decodeURIComponent(fileName)] || fileName;
  };

  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <div className={styles.contentText}>
          <h2 className={styles.title}>{post.title}</h2>
          <p className={styles.contentPreview}>{contentPreview}</p>
        </div>
        <div className={styles.imageContainer}>
          {Object.keys(post.images).length > 0 ? (
            <Image
              className={styles.image}
              src={getFirstImageUrl(post.content) ?? ''}
              alt="포스트 이미지"
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className={styles.imagePlaceholder} />
          )}
        </div>
      </div>
      <div className={styles.infoSection}>
        <span className={styles.category}>{post.category}</span>
        <span className={styles.date}>{post.date}</span>
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className={styles.tags}>
          {post.tags.map(tag => (
            <span key={tag} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

export default PostCard;
