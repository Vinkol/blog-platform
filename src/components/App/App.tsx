import { Route, Routes, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ArticlesList from '../ArticleList/ArticleList';
import ArticlePage from '../ArticlePage/ArticlePage';
import Header from '../Header/Header';
import SignIn from '../SingIn/SingIn';
import SignUp from '../SingUp/SingUp';
import Profile from '../Profile/Profile';
import NewArticle from '../NewArticle/NewArticle';
import EditArticle from '../EditArticle/EditArticle';
import PrivateRoute from '../PrivateRoute/PrivateRoute';

const App: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  return (
    <div className="app-container">
      <Header />
      <AnimatePresence>
      <div className="main-content">
        <div className="content">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<motion.div initial={{ opacity: 0}} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}><ArticlesList /></motion.div>} />
            <Route path="/sign-in" element={<motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} transition={{ duration: 0.5 }}><SignIn /></motion.div>} />
            <Route path="/sign-up" element={<motion.div initial={{ opacity: 0, x: +100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100}} transition={{ duration: 0.5 }}><SignUp /></motion.div>} />
            
            <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/profile" element={<motion.div initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} transition={{ duration: 0.5 }}><Profile /></motion.div>} />
              <Route path="/new-article" element={<motion.div initial={{ opacity: 0, y: +100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} transition={{ duration: 0.5 }}><NewArticle description={''} /></motion.div>} />
              <Route path="/editArticle/:slug" element={<motion.div initial={{ opacity: 0, y: +100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} transition={{ duration: 0.5 }}><EditArticle /></motion.div>} />
            </Route>
            
            <Route path="/articles/:slug" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}><ArticlePage /></motion.div>} />
          </Routes>
        </div>
      </div>
      </AnimatePresence>
    </div>
  );
};

export default App;