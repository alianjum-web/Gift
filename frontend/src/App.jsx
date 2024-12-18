import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage.jsx';
import LoginPage from './components/LoginPage/LoginPage.jsx';
import RegisterPage from './components/RegisterPage/RegisterPage.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar/Navbar.jsx';
import DetailsPage from './components/DetailsPage/DetailsPage.jsx';
import SearchPage from './components/SearchPage/SearchPage.jsx';
import Profile from './components/Profile/Profile.jsx';

function App() {

  return (
        <>
        <Navbar/>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/app" element={<MainPage />} />
          <Route path="/app/login" element={<LoginPage/>} />
          <Route path="/app/register" element={<RegisterPage />} />
          <Route path="/app/product/:productId" element={<DetailsPage/>} />
          <Route path="/app/search" element={<SearchPage/>} />
          <Route path="/app/profile" element={<Profile/>} />

        </Routes>
        </>
  );
}
export default App;