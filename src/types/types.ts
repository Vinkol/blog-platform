// Автор статьи
export interface Author {
  username: string
  image: string
}

// Статья (как приходит с API)
export interface Article {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: Author
  user: User
}

// Ответ со списком статей
export interface ArticlesResponse {
  articles: Article[]
  articlesCount: number
}

// Новый/обновляемый article
export interface NewArticle {
  title: string
  description: string
  body: string
  tagList: string[]
}

export interface NewArticleProps {
  mode?: 'create' | 'edit'
  initialData?: NewArticle
  articleSlug?: string
}

// Пользователь (логин/регистрация)
export interface User {
  email: string
  username: string
  token: string
  image: string
}

// Ответ логина/регистрации
export interface LoginResponse {
  user: User
}

// Ошибка API
export interface ErrorResponse {
  data?: {
    errors: Record<string, string>
  }
}

// Форма SignIn / SignUp
export interface SignInFormData {
  userName: string
  email: string
  password: string
  passwordAgain: string
  consent: boolean
}

export interface ArticlesState {
  articles: Article[]
  loading: boolean
  error: string | null
  currentPage: number
}

export interface FormData {
  title: string
  shortDescription: string
  text: string
}
