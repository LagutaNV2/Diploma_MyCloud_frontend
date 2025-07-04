// src/components/Storage/FileItem.tsx

import React, { useState } from 'react';
import { FaCopy, FaCheck, FaEdit, FaTimes  } from 'react-icons/fa';
import type { File } from '../../types/fileTypes';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteFile, downloadFile, updateFile, previewFile } from '../../store/slices/fileSlice';

interface FileItemProps {
  file: File;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const FileItem: React.FC<FileItemProps> = ({ file }) => {
  const [copied, setCopied] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.original_name);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [newComment, setNewComment] = useState(file.comment);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleDownload = () => {
    dispatch(downloadFile({ fileId: file.id, fileName: file.original_name }));
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить файл?')) {
      dispatch(deleteFile(file.id));
    }
  };

  const handleRename = async () => {
    if (newName.trim() === '') {
      alert('Имя файла не может быть пустым');
      return;
    }
    try {
      await dispatch(updateFile({ fileId: file.id, updatedData: { original_name: newName } })).unwrap();
      setIsRenaming(false);
    } catch (err) {
      alert('Ошибка при переименовании файла');
    }
  };

  const handleCommentUpdate = async () => {
    try {
      await dispatch(updateFile({ fileId: file.id, updatedData: { comment: newComment } })).unwrap();
      setIsEditingComment(false);
    } catch (err) {
      alert('Ошибка при обновлении комментария');
    }
  };

  const handlePreview = async () => {
    try {
      const url = await dispatch(previewFile({ fileId: file.id })).unwrap();
      setPreviewUrl(url);
      window.open(url, '_blank'); // Открывает файл в новой вкладке
    } catch (err) {
      alert('Ошибка при попытке просмотреть файл');
    }
  };

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/api/storage/public/${file.public_link}/`;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <tr className="hover:bg-blue-50 transition-colors duration-150">
      {/* Имя файла */}
      <td>
        {isRenaming ? (
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border rounded p-1 mr-2 flex-grow"
            />
             <div className="flex items-center space-x-2">
              <button
                onClick={handleRename}
                className="bg-green-500 text-white px-2 py-1 rounded flex items-center"
              >
                <FaCheck className="mr-1" />
              </button>
              <button
                onClick={() => setIsRenaming(false)}
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded flex items-center"
              >
                <FaTimes className="mr-1" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>{file.original_name}</div>
            <button
              onClick={() => setIsRenaming(true)}
              className="ml-auto text-blue-500 hover:text-blue-700"
            >
              <FaEdit />
            </button>
          </div>
        )}
      </td>

      {/* Комментарий */}
      <td>
        {isEditingComment ? (
          <div className="flex items-center justify-between">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="border rounded p-1 mr-2 flex-grow"
            />
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCommentUpdate}
                className="bg-green-500 text-white px-2 py-1 rounded flex items-center"
              >
                <FaCheck className="mr-1" />
              </button>
              <button
                onClick={() => setIsEditingComment(false)}
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded flex items-center"
              >
                <FaTimes className="mr-1" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>{file.comment || 'Нет комментария'}</div>
            <button
              onClick={() => setIsEditingComment(true)}
              className="ml-auto text-blue-500 hover:text-blue-700"
            >
              <FaEdit />
            </button>
          </div>
        )}
      </td>

      {/* Размер файла, дата загрузки и последнего скачивания */}
      <td>{formatBytes(file.size)}</td>
      <td className="whitespace-nowrap">{formatDate(file.upload_date)}</td>
      <td className="whitespace-nowrap">
        {file.last_download ? formatDate(file.last_download) : 'еще не скачивался'}
      </td>

      {/* Публичная ссылка */}
      <td>
        <div className="flex items-center justify-between">
          <div className="text-blue-600 break-all mr-2 truncate max-w-xs">
            {file.public_link.toString().slice(0, 20)}...
          </div>
          <button
            onClick={copyPublicLink}
            className="text-blue-500 hover:text-blue-700 ml-auto"
            title="Скопировать публичную ссылку"
          >
            {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
          </button>
        </div>
      </td>

      {/* Действия */}
      <td className="actions-column">
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleDownload}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Скачать
          </button>
          <button
            onClick={handlePreview}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Просмотреть
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Удалить
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FileItem;
