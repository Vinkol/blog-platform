/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, useState } from 'react'
import { Pagination } from 'antd'
import { Link } from 'react-router-dom'
import { Spin, Alert } from 'antd'

import { useGetArticlesQuery, useToggleLikeMutation } from '../../api/apiSlice'
import AuthModal from '../AuthModal/AuthModal'

import cl from './ArticleList.module.sass'

const ArticleList = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('currentPage')
    return parseInt(savedPage || '1')
  })

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage.toString())
  }, [currentPage])

  const [showAuthModal, setShowAuthModal] = useState(false)
  const offset = (currentPage - 1) * 10
  const { data, error, isLoading } = useGetArticlesQuery({ limit: 10, offset })
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const [toggleLike] = useToggleLikeMutation()
  const handleLike = async (slug: string, isLiked: boolean) => {
    try {
      await toggleLike({ slug, isLiked }).unwrap()
    } catch {
      setShowAuthModal(true)
      return
    }
  }

  const handleCloseAuthModal = () => {
    setShowAuthModal(false)
  }

  if (isLoading || !data) {
    return (
      <div className="loading">
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    const errorMessage = (error as { message?: string }).message || 'Unknown error'
    return (
      <div className="error">
        <Alert message="Ошибка" description={errorMessage} type="error" showIcon />
      </div>
    )
  }

  return (
    <>
      {data.articles.map((article, index) => (
        <div key={index} className={cl.articles}>
          <div className={cl.articleWrap}>
            <div className={cl.articleTitleWrap}>
              <Link to={`/articles/${article.slug}`} className={cl.articleTitle}>
                {article.title}
              </Link>
              <button
                className={cl.articleFavorite}
                onClick={() => handleLike(article.slug, article.favorited)}
              >
                {article.favorited ? '❤️' : '🤍'} {article.favoritesCount}
              </button>
            </div>
            <div>
              {article.tagList.map((tag, index) => (
                <button key={index} className={cl.articleTags}>
                  {tag}
                </button>
              ))}
            </div>
            <p className={cl.articleText}>{article.description}</p>
          </div>
          <div className={cl.articleUser}>
            <div className={cl.articleUserWrap}>
              <h4 className={cl.articleUserName}>{article.author.username}</h4>
              <p className={cl.articlePostTime}>
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <img className={cl.articleUserImg} src={article.author.image} alt="IMAGE" />
          </div>
        </div>
      ))}
      <Pagination
        align="center"
        current={currentPage}
        total={data.articlesCount}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
      {showAuthModal && (
        <AuthModal message="Пройдите авторизацию!" onClose={handleCloseAuthModal} />
      )}
    </>
  )
}

export default ArticleList
