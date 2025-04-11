import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import NewArticle from '../NewArticle/NewArticle'

const EditArticle = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { article } = location.state || {}

  useEffect(() => {
    if (!article) {
      console.error('Пустой массив')
      navigate('/')
    }
  }, [article, navigate])

  if (!article) {
    return <div>Loading...</div>
  }

  return (
    <NewArticle
      mode="edit"
      initialData={article}
      articleSlug={article.slug}
      description={article.description}
    />
  )
}

export default EditArticle
