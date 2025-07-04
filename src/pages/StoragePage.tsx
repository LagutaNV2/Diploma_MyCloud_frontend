// src/pages/StoragePage.tsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { TypedUseSelectorHook } from 'react-redux';
import FileList from '../components/Storage/FileList';
import FileUploader from '../components/Storage/FileUploader';
import { useAppDispatch } from '../store/hooks';
import { fetchFiles } from '../store/slices/fileSlice';
import api from '../utils/apiUtils';
import type { User } from '../types/userTypes';
import type { RootState } from '../store/store';

const StoragePage: React.FC = () => {
  const { user: currentUser } = useAppSelector(state => state.auth);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('user');
  const dispatch = useAppDispatch();
  const { error } = useAppSelector(state => state.files);
  const isCurrentUser = !userId || (currentUser && currentUser.id === (userId));

  console.log('Current user:', currentUser, 'Selected user ID:', userId, 'Is current user:', isCurrentUser);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await api.get(`/auth/users/${userId}/`);
          setSelectedUser(response.data);
          console.log('Selected user:', response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
      dispatch(fetchFiles(userId ? parseInt(userId) : undefined));
    };
    fetchData();
  }, [dispatch, userId]);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        await dispatch(fetchFiles(userId ? parseInt(userId) : undefined));
      } catch (err) {
        console.error('Failed to load files:', err);
      }
    };
    loadFiles();
  }, [dispatch, userId]);


  return (
    <div className="max-w-6xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        {isCurrentUser ? 'Мое хранилище' : 'Хранилище пользователя'}
      </h1>

      {userId && selectedUser && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                <span className="text-gray-500 text-2xl">
                  {selectedUser.first_name?.[0] || selectedUser.username?.[0]}
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedUser.last_name} {selectedUser.first_name}
                <span className="ml-2 text-gray-600 text-base font-normal">
                  (@{selectedUser.username})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Email:</span>
                  <span className="text-gray-700">{selectedUser.email}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-2">Статус:</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedUser.is_admin
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {selectedUser.is_admin ? ' Администратор' : ' Пользователь'}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="font-medium mr-2">Использовано:</span>
                  <span className="text-gray-700 font-medium">
                    {selectedUser.formatted_total_file_size}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {error && (
          <div className="bg-red-50 border-b border-red-200 text-red-700 px-6 py-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>Ошибка загрузки файлов: {error}</span>
            </div>
          </div>
        )}

        {isCurrentUser && (
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Загрузка нового файла</h2>
            <FileUploader />
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isCurrentUser ? 'Мои файлы' : 'Файлы пользователя'}
            </h2>

          </div>
          <FileList />
        </div>
      </div>
    </div>
  );
};

export default StoragePage;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
