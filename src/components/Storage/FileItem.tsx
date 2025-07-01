// src/components/Storage/FileItem.tsx

import React, { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import type { File } from '../../types/fileTypes';
import { useAppDispatch } from '../../store/hooks';
import { deleteFile, downloadFile } from '../../store/slices/fileSlice';

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
  const [comment, setComment] = useState(file.comment);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();

  const handleDownload = () => {
    dispatch(downloadFile({ fileId: file.id, fileName: file.original_name }));
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить файл?')) {
      dispatch(deleteFile(file.id));
    }
  };

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/api/storage/public/${file.public_link}/`;
    navigator.clipboard.writeText(publicUrl);
    // alert('Публичная ссылка скопирована в буфер обмена');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <tr className="hover:bg-blue-50 transition-colors duration-150">
      <td className="font-medium">{file.original_name}</td>
      <td className="py-2 px-4 border-b border-r border-gray-100">
        {isEditing ? (
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border rounded p-1"
          />
        ) : (
          comment || <span className="text-gray-400 italic">Нет комментария</span>
        )}
      </td>
      <td>{formatBytes(file.size)}</td>
      <td className="whitespace-nowrap">{formatDate(file.upload_date)}</td>
      <td className="whitespace-nowrap">
        {file.last_download ? formatDate(file.last_download) : 'еще не скачивался'}
      </td>
      <td>
        <div className="flex items-center">
          <span className="text-blue-600 break-all mr-2 truncate max-w-xs">
            {file.public_link.toString().slice(0, 20)}...
          </span>
          <button
            onClick={copyPublicLink}
            className="text-blue-500 hover:text-blue-700"
            title="Скопировать публичную ссылку"
          >
            {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
          </button>
        </div>
      </td>
      <td>
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Скачать
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
