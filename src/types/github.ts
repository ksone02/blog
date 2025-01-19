export interface GithubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  category: string;
  images: Record<string, string>;
}
