import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Pagination } from 'antd';
import { fetchArticlesStart, fetchArticlesSuccess, fetchArticlesFailure, setCurrentPage } from '../../Store/articlesSlice';

interface Article {
  slug: string;
  title: string;
  description: string;
}

interface ArticlesState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  currentPage: number;
}

const ArticlesList: React.FC = () => {
  const dispatch = useDispatch();
  
  const { articles, loading, error, currentPage } = useSelector(
    (state: { articles: ArticlesState }) => state.articles
  );

  useEffect(() => {
    const fetchArticles = async () => {
      dispatch(fetchArticlesStart());
      try {
        const response = await axios.get(`https://blog-platform.kata.academy/api/articles?page=${currentPage}`);
        dispatch(fetchArticlesSuccess(response.data.articles));
      } catch (err) {
        dispatch(fetchArticlesFailure('Ошибка при загрузке статей'));
      }
    };

    fetchArticles();
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page)); // Используем экшен setCurrentPage
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Список статей</h1>
      {articles.map((article) => (
        <div key={article.slug}>
          <Link to={`/articles/${article.slug}`}>{article.title}</Link>
        </div>
      ))}
      
      <Pagination
        current={currentPage}
        total={50} // Убедись, что здесь реальное количество статей
        pageSize={5}
        onChange={handlePageChange}
        showSizeChanger={false}
        showQuickJumper
      />
    </div>
  );
};

export default ArticlesList;
