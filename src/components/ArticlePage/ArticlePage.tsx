import { useState } from 'react'
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
import { Article } from '../../types/types'

import cl from './ArticlePage.module.sass'

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [clickDelete, setClickDelete] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [toggleLike] = useToggleLikeMutation()
  const [deleteArticle] = useDeleteArticleMutation()

  const currentUser = useSelector((state: RootState) => state.reg.user)

  const {
    data: articleData,
    isLoading,
    isError,
    refetch,
  } = useGetArticleBySlugQuery(slug!, { skip: !slug })

  const handleConfirmationDelete = async () => {
    if (!slug) return
    try {
      await deleteArticle(slug).unwrap()
      navigate('/')
    } catch (error) {
      console.error('Ошибка удаления статьи:', error)
    }
  }

  const handleLike = async (slug: string, isLiked: boolean) => {
    try {
      await toggleLike({ slug, isLiked }).unwrap()
      refetch()
    } catch {
      setShowAuthModal(true)
    }
  }

  const handleCloseAuthModal = () => setShowAuthModal(false)

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

  const {
    title,
    user,
    createdAt,
    tagList,
    description,
    body,
    favoritesCount,
    favorited,
    slug: articleSlug,
  } = articleData as Article

  return (
    <div className={cl.article}>
      <div className={cl.wrap}>
        <div className={cl.headerWrap}>
          <h1 className={cl.articleTitle}>{title}</h1>
          <button className={cl.articleFavorite} onClick={() => handleLike(articleSlug, favorited)}>
            {favorited ? '❤️' : '🤍'} {favoritesCount}
          </button>
        </div>
        <div className={cl.articleAuthor}>
          <div>
            <h4>{user?.username}</h4>
            <p>
              {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <img
            className={cl.articleUserImg}
            src={user?.image || '/default-avatar.png'}
            alt="Author"
          />
        </div>
      </div>

      <div className={cl.tags}>
        {tagList?.map((tag) => (
          <button key={tag} className={cl.articleTags}>
            {tag}
          </button>
        ))}
      </div>

      <div className={cl.articleChange}>
        <p className={cl.description}>{description}</p>

        {currentUser?.userName === user?.username && (
          <div className={cl.actions}>
            <button className={cl.btnDelete} onClick={() => setClickDelete(true)}>
              Delete
            </button>
            <button
              className={cl.btnEdit}
              onClick={() =>
                navigate(`/editArticle/${articleSlug}`, { state: { article: articleData } })
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
