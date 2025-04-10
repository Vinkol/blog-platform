export interface Article {
    article: {
      slug(slug: any, favorited: any): void; title: any; author: any; createdAt: any; tagList: any; description: any; body: any; favoritesCount: any; favorited: any; 
};
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: {
      username: string;
      image: string;
    };
  }

export interface ArticlesState {
    articles: Article[];
    loading: boolean;
    error: string | null;
    currentPage: number;
  }

export interface NewArticle {
    title: string;
    description: string;
    body: string;
    tagList: string[];
  }

export interface NewArticleProps {
    description: string;
    mode?: 'create' | 'edit';
    initialData?: {
      description: string;
      title: string;
      body: string;
      tagList: string[];
    };
    articleSlug?: string;
  }

export interface ArticlesResponse {
    articles: Article[];
    articlesCount: number;
  }

export interface ErrorResponse {
    data?: {
      errors: Record<string, string>;
    };
  }