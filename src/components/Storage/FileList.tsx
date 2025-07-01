// src/components/Storage/FileList.tsx

import React from 'react';
import { useAppSelector } from '../../store/hooks';
import FileItem from './FileItem';

const FileList: React.FC = () => {
  const { files, loading, error } = useAppSelector(state => state.files);

  if (loading) return <div>Загрузка файлов...</div>;
  if (error) return <div className="text-red-500">Ошибка: {error}</div>;

  return (
     <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
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
              <FileItem key={file.id} file={file} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
