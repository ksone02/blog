/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */

import { useEffect, useState } from 'react';

import styles from './TabOfContents.module.css';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

const TableOfContents = ({ items }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('');

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - 105; // 상단에서 105px 떨어진 위치

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const headings = items.map(item => document.getElementById(item.id)).filter(Boolean);

      // 현재 스크롤 위치
      const scrollPosition = window.scrollY + 110; // 헤더 높이만큼 오프셋

      // 각 헤딩의 위치를 체크해서 가장 가까운 것을 찾음
      let currentHeading = headings[0];

      for (const heading of headings) {
        if (!heading) continue;

        const headingPosition = heading.offsetTop;

        // 스크롤 위치가 헤딩보다 아래에 있으면 해당 헤딩을 현재 헤딩으로 설정
        if (scrollPosition >= headingPosition) {
          currentHeading = heading;
        } else {
          // 이미 스크롤 위치보다 위에 있는 헤딩을 찾았으므로 중단
          break;
        }
      }

      if (currentHeading) {
        setActiveId(currentHeading.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 로드시 실행

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items]);

  return (
    <nav className={styles.container}>
      <ul className={styles.list}>
        {items.map(item => (
          <li
            key={item.id}
            className={styles.item}
            style={{
              paddingLeft: `${(item.level - 1) * 1}rem`,
            }}
          >
            <button
              type="button"
              onClick={() => handleClick(item.id)}
              className={`${styles.button} ${activeId === item.id ? styles.active : ''}`}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
