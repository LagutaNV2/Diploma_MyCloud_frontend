//src/pages/HomePage.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Добро пожаловать в облачное хранилище</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Новый пользователь?</h2>
          <p className="mb-4">Зарегистрируйтесь для доступа к вашему персональному хранилищу</p>
          <Link
            to="/register"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Регистрация
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Уже зарегистрированы?</h2>
          <p className="mb-4">Войдите в систему для доступа к вашим файлам</p>
          <Link
            to="/login"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
