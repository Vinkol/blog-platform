import { Route, Routes } from 'react-router-dom';
import ArticlesList from '../ArticleList/ArticlesList';
import ArticlePage from '../ArticlePage/ArticlePage';
import Header from '../Header/Header';
import SignIn from '../SingIn/SingIn';
import SignUp from '../SingUp/SingUp';
import Profile from '../Profile/Profile';
import NewArticle from '../NewArticle/NewArticle';
import EditArticle from '../EditArticle/EditArticle';
import PrivateRoute from '../PrivateRoute/PrivateRoute';

const App: React.FC = () => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<ArticlesList />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/new-article" element={<NewArticle />} />
          <Route path="/articles/:slug/edit" element={<EditArticle />} />
        </Route>
        
        <Route path="/articles/:slug" element={<ArticlePage />} />
      </Routes>
    </div>
  );
};

export default App;