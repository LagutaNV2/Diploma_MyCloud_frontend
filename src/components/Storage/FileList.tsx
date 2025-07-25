import React, { useEffect, useState } from 'react';
import { FaCopy, FaCheck, FaEdit, FaTimes  } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFiles } from '../../store/slices/fileSlice';
import {
  formatBytes,
  formatDate,
  handleDelete,
  handleDownload,
  handleRenameMobile,
  handleCommentMobile,
  handlePreview
} from '../../utils/fileUtils';
import FileItem from './FileItem';

const FileList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { files, loading, error } = useAppSelector(state => state.files);
  const currentUser = useAppSelector(state => state.auth.user);


  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFiles());
    }
  }, [dispatch, currentUser]);

  if (loading) return <div>Загрузка файлов...</div>;
  // if (error) return <div className="text-red-500">Ошибка загрузки файла</div>;

  return (
    <div>

      {/* Десктопная версия */}
      <div className="desktop-only overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="font-medium">Имя файла</th>
              <th className="font-medium">Комментарий</th>
              <th className="font-medium">Размер</th>
              <th className="font-medium">Дата загрузки</th>
              <th className="font-medium">Последнее скачивание</th>
              <th className="font-medium">Публичная ссылка</th>
              <th className="font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  Нет загруженных файлов
                </td>
              </tr>
            ) : (
              files.map(file => (
                <FileItem
                  key={file.id}
                  file={file}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Мобильная версия */}
      <div className="mobile-only">
        {files.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            Нет загруженных файлов
          </div>
        ) : (
          files.map(file => (
            <div key={file.id} className="responsive-card bg-white mb-4 rounded-lg shadow">

              {/* Имя файла с кнопкой редактирования */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-black-800">Имя файла:</span>
                <div className="flex items-center">
                  <span className="truncate max-w-[120px]">{file.original_name}</span>
                  <button
                    onClick={() => handleRenameMobile(dispatch, file)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit size={14} />
                  </button>
                </div>
              </div>

              {/* Комментарий с кнопкой редактирования */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700">Комментарий:</span>
                <div className="flex items-center">
                  <span className="truncate max-w-[120px]">
                    {file.comment || 'Нет комментария'}
                  </span>
                  <button
                    onClick={() => handleCommentMobile(dispatch, file)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit size={14} />
                  </button>
                </div>
              </div>

              {/* Остальные поля */}
              <div className="grid grid-cols-2 gap-2">
                <div className="card-row">
                  <span className="font-semibold text-gray-700">Размер:</span>
                  <span>{formatBytes(file.size)}</span>
                </div>

                <div className="card-row">
                  <span className="font-semibold text-gray-700">Загружен:</span>
                  <span>{formatDate(file.upload_date)}</span>
                </div>

                <div className="card-row">
                  <span className="font-semibold text-gray-700">Скачивание:</span>
                  <span>{file.last_download ? formatDate(file.last_download) : 'еще не скачивался'}</span>
                </div>

                <div className="card-row">
                  <span className="font-semibold text-gray-700">Ссылка:</span>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-700 truncate max-w-[100px]">
                          {file.public_link.toString().slice(0, 20)}...
                        </span>
                        <button
                          onClick={() => {
                            const publicUrl = `${window.location.origin}/api/storage/public/${file.public_link}/`;
                            navigator.clipboard.writeText(publicUrl)
                              .then(() => alert('Ссылка скопирована!'))
                              .catch(() => alert('Ошибка копирования'));
                          }}
                          className="ml-2 text-blue-500"
                          title="Скопировать ссылку"
                        >
                          <FaCopy size={14} />
                        </button>
                      </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="mt-3 flex justify-between">
                <button onClick={() => handleDownload(dispatch, file.id, file.original_name)} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Скачать
                </button>
                <button
                  onClick={async () => {
                    try {
                      const url = await handlePreview(dispatch, file.id);
                      window.open(url, '_blank');
                    } catch (err) {
                      alert('Ошибка предпросмотра');
                    }
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Просмотреть
                </button>
                <button onClick={() => handleDelete(dispatch, file.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Удалить
                </button>
              </div>
            </div>
          ))



        )}
      </div>
    </div>
  );
};

export default FileList;
