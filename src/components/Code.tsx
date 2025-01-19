'use client';

/* eslint-disable import/no-extraneous-dependencies */
import 'highlight.js/styles/base16/google-light.css';

import React, { useEffect, useRef, useState } from 'react';

import styles from './Code.module.css';

interface CodeProps {
  className?: string;
  children: React.ReactNode;
}

const Code = ({ className, children }: CodeProps) => {
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!codeRef.current) return;
    const rawText = codeRef.current.textContent ?? '';

    setLineCount(rawText.split('\n').length - 1);
  }, [children]);

  // 복사 기능
  const handleCopy = async () => {
    const text = codeRef.current?.textContent || '';
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button type="button" onClick={handleCopy} className={styles.copyButton}>
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>

      <div className={styles.codeOuter}>
        <div className={styles.codeScroll}>
          <div className={styles.lineNumbers}>
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>

          <pre className={styles.pre}>
            <code ref={codeRef} className={className}>
              {children}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Code;
