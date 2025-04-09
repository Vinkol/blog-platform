import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import cl from './ArticlePage.module.sass';
import { useSelector } from 'react-redux';
import {
  useGetArticleBySlugQuery,
  useDeleteArticleMutation,
  useToggleLikeMutation,
} from '../../store/apiSlice';

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [clickDelete, setClickDelete] = useState(false);
  const [toggleLike] = useToggleLikeMutation();

  const { data: articleData, isLoading, isError, refetch } = useGetArticleBySlugQuery(slug);
  const [deleteArticle] = useDeleteArticleMutation();
  const currentUser = useSelector((state) => state.registration.user);

  const handleConfirmationDelete = async () => {
    try {
      await deleteArticle(slug).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Ошибка удаления статьи:', error);
    }
  };

  const handleLike = async (slug, isLiked) => {
    try {
      await toggleLike({ slug, isLiked }).unwrap();
      refetch();
    } catch (error) {
      console.error('Ошибка при изменении лайка:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !articleData) {
    return <div>Error loading article</div>;
  }

  const { title, author, createdAt, tagList, description, body, favoritesCount, favorited } =
    articleData.article;
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
        {tagList.map((tag, index) => (
          <button key={index} className={cl.articleTags}>
            {tag}
          </button>
        ))}
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
      <ReactMarkdown className={cl.body}>{body}</ReactMarkdown>
    </div>
  );
};

export default ArticlePage;

