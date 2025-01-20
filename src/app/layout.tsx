/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable camelcase */
import './globals.css';

import { Metadata } from 'next';
import { Fira_Mono, Inter } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  preload: true,
  display: 'swap',
});

const firaMono = Fira_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-fira-mono',
  preload: true,
  display: 'swap',
});

const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/Pretendard-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  preload: true,
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'ksone.blog',
    description: '강상원의 블로그',
    keywords: ['ksone', 'blog', 'frontend', 'developer', 'javascript', 'typescript', 'react'],
    openGraph: {
      title: 'ksone.blog',
      description: '강상원의 블로그',
      images: ['/og-image.png'],
    },
    icons: {
      icon: '/ms-icon-310x310.png',
    },
  };
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="ko" className={`${pretendard.className} ${firaMono.className} ${inter.className}`}>
    <Script
      strategy="afterInteractive"
      src="https://www.googletagmanager.com/gtag/js?id=G-RWB7RJ9M52"
    />
    <Script
      id="gtag-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RWB7RJ9M52');
          `,
      }}
    />

    <body>
      <header className="header">
        <nav className="nav">
          <div>
            <a href="/">
              <h1 className="logo">ksone.blog</h1>
            </a>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href="https://github.com/ksone02"
              target="_blank"
              rel="noopener noreferrer"
              type="button"
              style={{
                color: '#333',
                padding: '8px 8px',
                borderRadius: '6px',
                transition: 'background 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/%EC%83%81%EC%9B%90-%EA%B0%95-7b6007275/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#333',
                padding: '8px 8px',
                borderRadius: '6px',
                transition: 'background 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
            </a>
          </div>
        </nav>
      </header>
      <main className="main">{children}</main>
    </body>
  </html>
);

export default RootLayout;
