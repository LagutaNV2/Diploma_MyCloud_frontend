import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Облачное хранилище "My Cloud"</Link>
        {/* Информация о пользователе */}
        {isAuthenticated && user && (
          <div className="flex items-center space-x-4">
            <span className="font-medium">
              {user.last_name} {user.first_name} ({user.username})
            </span>
            {user.is_admin && <span className="bg-yellow-500 text-xs px-2 py-1 rounded">Admin</span>}
          </div>
        )}
        {/* Навигационное меню */}
        <div className="nav-menu">
          {isAuthenticated ? (
            <>
              {user?.is_admin && (
                <Link to="/admin" className="hover:underline">Админ-панель</Link>
              )}
              <Link to="/storage" className="hover:underline">Мое хранилище</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Выход
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline mr-4">Вход</Link>
              <Link to="/register" className="hover:underline">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
