// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { registerUser } from '../store/slices/authSlice';
import { getCSRFToken } from '../utils/apiUtils';


const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Валидация логина
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;
    if (!usernameRegex.test(username)) {
      newErrors.username = 'Логин должен начинаться с буквы, содержать 4-20 символов (латиница и цифры)';
    }

    // Валидация email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Некорректный формат email';
    }


    // Валидация пароля
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов: 1 заглавную, 1 цифру, 1 спецсимвол';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await getCSRFToken();
    if (!validate()) return;

    try {
      console.log('Registration starts...');
      const response = await dispatch(registerUser({
        username,
        first_name: firstName,
        last_name: lastName,
        email,
        password
      })).unwrap();

      console.log('Registration successful:', response);

      const user = (response as { user: { is_admin: boolean } }).user;
      if (user.is_admin) {
        navigate('/admin');
      } else {
        navigate('/storage');
      }

    } catch (err: any) {

      if (err) {
        const backendErrors = err || {};
        const newErrors: Record<string, string> = {};

        // Обработка ошибки username
        if (backendErrors.username[0]) {
          newErrors.username = backendErrors.username[0];
        }

        // Обработка ошибки email
        // if (backendErrors.email) {
        //   newErrors.email = Array.isArray(backendErrors.email)
        //     ? backendErrors.email.join(' ')
        //     : backendErrors.email;
        // }

        // Обработка других ошибок
        if (backendErrors.non_field_errors) {
          newErrors.general = Array.isArray(backendErrors.non_field_errors)
            ? backendErrors.non_field_errors[0]
            : backendErrors.non_field_errors;
        }

        ['password', 'email'].forEach(field => {
          if (backendErrors[field] && !newErrors[field]) {
            newErrors[field] = Array.isArray(backendErrors[field])
              ? backendErrors[field][0]
              : backendErrors[field];
          }
        });

        setErrors(newErrors);
      } else {
        setErrors({
          general: err.message || 'Произошла неизвестная ошибка при регистрации'
        });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>

      {errors.general && (
        <div className="bg-red-600 text-white font-bold px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          {/* Необязательные поля */}
          <div>
          <label className="block mb-1 font-medium">Имя</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Фамилия</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

          {/* Обязательные поля */}
          <label className="block mb-1 font-medium">Логин*</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-2 border rounded ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.username && (
            <p className="error-text">{errors.username}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email*</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border rounded ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.email && (
            <p className="error-text">{errors.email}</p>
          )}
        </div>

        <div className="relative">
          <label className="block mb-1 font-medium">Пароль*</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : <span className="strikethrough">👁️</span>}
          </button>
          {errors.password && (
            <p className="error-text">{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Зарегистрироваться
        </button>
        <div> * поле обязательно для заполнения</div>
      </form>

      <div className="mt-4 text-center">
        <p>
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
