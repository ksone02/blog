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

import { getViewCount, incrementViewCount } from '@/app/action';
import { Post } from '@/types/github';

import Code from '../Code';
import styles from './PostDetail.module.css';
import TableOfContents from './TabOfContents';

interface PostDetailProps {
  post: Post;
}

const PostDetail = ({ post }: PostDetailProps) => {
  const [views, setViews] = useState(0);
  const [isViewLoading, setIsViewLoading] = useState(true);

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
    const incrementAndGetViewCount = async () => {
      await incrementViewCount(post.slug).then(async () => {
        const { views } = await getViewCount(post.slug);
        setViews(views);
      });
    };
    const fetchViews = async () => {
      setIsViewLoading(true);
      await incrementAndGetViewCount();
      setIsViewLoading(false);
    };

    const handleFocus = () => {
      incrementAndGetViewCount();
    };

    fetchViews();

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', fetchViews);
    };
  }, [post.slug]);

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
          <span className={styles.author}>from. {process.env.NEXT_PUBLIC_AUTHOR}</span>
          <div className={styles.meta}>
            <span className={styles.category}>{post.category}</span>
            <span className={styles.date}>{format(new Date(post.date), 'yyyy년 MM월 dd일')}</span>
            <section className={styles.readCount}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.2047 11.745C22.3226 9.46324 20.7912 7.48996 18.7998 6.06906C16.8084 4.64817 14.4443 3.84193 11.9997 3.75C9.55507 3.84193 7.19097 4.64817 5.19958 6.06906C3.20819 7.48996 1.6768 9.46324 0.794681 11.745C0.735106 11.9098 0.735106 12.0902 0.794681 12.255C1.6768 14.5368 3.20819 16.51 5.19958 17.9309C7.19097 19.3518 9.55507 20.1581 11.9997 20.25C14.4443 20.1581 16.8084 19.3518 18.7998 17.9309C20.7912 16.51 22.3226 14.5368 23.2047 12.255C23.2643 12.0902 23.2643 11.9098 23.2047 11.745ZM11.9997 18.75C8.02468 18.75 3.82468 15.8025 2.30218 12C3.82468 8.1975 8.02468 5.25 11.9997 5.25C15.9747 5.25 20.1747 8.1975 21.6972 12C20.1747 15.8025 15.9747 18.75 11.9997 18.75Z"
                  fill="#555"
                />
                <path
                  d="M12 7.5C11.11 7.5 10.24 7.76392 9.49994 8.25839C8.75991 8.75285 8.18314 9.45566 7.84254 10.2779C7.50195 11.1002 7.41283 12.005 7.58647 12.8779C7.7601 13.7508 8.18869 14.5526 8.81802 15.182C9.44736 15.8113 10.2492 16.2399 11.1221 16.4135C11.995 16.5872 12.8998 16.4981 13.7221 16.1575C14.5443 15.8169 15.2471 15.2401 15.7416 14.5001C16.2361 13.76 16.5 12.89 16.5 12C16.5 10.8065 16.0259 9.66193 15.182 8.81802C14.3381 7.97411 13.1935 7.5 12 7.5ZM12 15C11.4067 15 10.8266 14.8241 10.3333 14.4944C9.83994 14.1648 9.45543 13.6962 9.22836 13.148C9.0013 12.5999 8.94189 11.9967 9.05765 11.4147C9.1734 10.8328 9.45912 10.2982 9.87868 9.87868C10.2982 9.45912 10.8328 9.1734 11.4147 9.05764C11.9967 8.94189 12.5999 9.0013 13.1481 9.22836C13.6962 9.45542 14.1648 9.83994 14.4944 10.3333C14.8241 10.8266 15 11.4067 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7957 15 12 15Z"
                  fill="#555"
                />
              </svg>

              <span>{isViewLoading ? '-' : views}</span>
            </section>
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
          repo={`${process.env.NEXT_PUBLIC_GISCUS_OWNER}/${process.env.NEXT_PUBLIC_GISCUS_REPO}`}
          repoId={`${process.env.NEXT_PUBLIC_GISCUS_REPO_ID}`}
          category={`${process.env.NEXT_PUBLIC_GISCUS_CATEGORY}`}
          categoryId={`${process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID}`}
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
