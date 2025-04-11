import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { Spin } from 'antd'

import { RootState } from '../../Store/store'
import {
  useGetArticleBySlugQuery,
  useDeleteArticleMutation,
  useToggleLikeMutation,
} from '../../api/apiSlice'
import AuthModal from '../AuthModal/AuthModal'

import cl from './ArticlePage.module.sass'

const ArticlePage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [clickDelete, setClickDelete] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [toggleLike] = useToggleLikeMutation()

  const { data: articleData, isLoading, isError, refetch } = useGetArticleBySlugQuery(slug)
  const [deleteArticle] = useDeleteArticleMutation()
  const currentUser = useSelector((state: RootState) => state.reg.user)

  const handleConfirmationDelete = async () => {
    if (!slug) {
      console.error('Slug is required for deletion')
      return
    }
    try {
      await deleteArticle(slug).unwrap()
      navigate('/')
    } catch (error) {
      console.error('Ошибка удаления статьи:', error)
    }
  }

  const handleLike = async (slug: any, isLiked: any) => {
    try {
      await toggleLike({ slug, isLiked }).unwrap()
      refetch()
    } catch {
      setShowAuthModal(true)
      return
    }
  }

  const handleCloseAuthModal = () => {
    setShowAuthModal(false)
  }

  if (isLoading) {
    return (
      <div className="loading">
        <Spin size="large" />
      </div>
    )
  }

  if (isError || !articleData) {
    return <div>Error loading article</div>
  }

  const { title, author, createdAt, tagList, description, body, favoritesCount, favorited } =
    articleData.article
  return (
    <div className={cl.article}>
      <div className={cl.wrap}>
        <div className={cl.headerWrap}>
          <h1 className={cl.articleTitle}>{title}</h1>
          <button
            className={cl.articleFavorite}
            onClick={() => handleLike(articleData.article.slug, favorited)}
          >
            {favorited ? '❤️' : '🤍'} {favoritesCount}
          </button>
        </div>
        <div className={cl.articleAuthor}>
          <div>
            <h4>{author.username}</h4>
            <p>
              {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <img className={cl.articleUserImg} src={author.image} alt="Author" />
        </div>
      </div>
      <div className={cl.tags}>
        {tagList.map(
          (
            tag:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<unknown, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactPortal
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | null
                  | undefined
                >
              | null
              | undefined,
            index: Key | null | undefined,
          ) => (
            <button key={index} className={cl.articleTags}>
              {tag}
            </button>
          ),
        )}
      </div>
      <div className={cl.articleChange}>
        <p className={cl.description}>{description}</p>
        {currentUser?.userName === author.username && (
          <div className={cl.actions}>
            <button className={cl.btnDelete} onClick={() => setClickDelete(true)}>
              Delete
            </button>
            <button
              className={cl.btnEdit}
              onClick={() =>
                navigate(`/editArticle/${slug}`, { state: { article: articleData?.article } })
              }
            >
              Edit
            </button>
          </div>
        )}
      </div>
      {clickDelete && (
        <div className={cl.confirmation}>
          <h4 className={cl.confirmationTitle}>Delete the article</h4>
          <p className={cl.confirmationText}>Are you sure to delete this article?</p>
          <div className={cl.confirmationButtons}>
            <button onClick={() => setClickDelete(false)} className={cl.btnNo}>
              No
            </button>
            <button onClick={handleConfirmationDelete} className={cl.btnYes}>
              Yes
            </button>
          </div>
        </div>
      )}
      <ReactMarkdown>{body}</ReactMarkdown>
      {showAuthModal && (
        <AuthModal message="Пройдите авторизацию!" onClose={handleCloseAuthModal} />
      )}
    </div>
  )
}

export default ArticlePage
