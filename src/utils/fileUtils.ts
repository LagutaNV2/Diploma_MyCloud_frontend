import type { Dispatch } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import type { AppDispatch } from '../store/store';
import type { File } from '../types/fileTypes';
import { deleteFile, downloadFile, updateFile, previewFile } from '../store/slices/fileSlice';

// Функции для Redux-операций
export const handleDownload = (dispatch: Dispatch, fileId: string, fileName: string) => {
  dispatch(downloadFile({ fileId, fileName }) as any);
};

export const handleDelete = (dispatch: Dispatch, fileId: string) => {
  if (window.confirm('Вы уверены?')) {
    dispatch(deleteFile(fileId) as any);
  }
};

export const handleRename = async (
  dispatch: AppDispatch,
  fileId: string,
  newName: string,
  setIsRenaming: React.Dispatch<React.SetStateAction<boolean>>,
  setNewName: React.Dispatch<React.SetStateAction<string>>,
) => {
  if (newName.trim() === '') {
    alert('Имя файла не может быть пустым');
    return;
  }
  try {
    const resultAction = await dispatch(updateFile({ fileId, updatedData: { original_name: newName } }) as unknown as AnyAction);
    if ('unwrap' in resultAction && typeof resultAction.unwrap === 'function') {
      await resultAction.unwrap();
    }
    setIsRenaming(false);
  } catch (err) {
    alert('Ошибка переименования');
  }
};

export const handleCommentUpdate = async (
  dispatch: Dispatch,
  fileId: string,
  newComment: string,
  setIsEditingComment: React.Dispatch<React.SetStateAction<boolean>>,
  setNewComment: React.Dispatch<React.SetStateAction<string>>,
) => {
  try {
    await dispatch(updateFile({ fileId, updatedData: { comment: newComment } })).unwrap();
    setIsEditingComment(false);
  } catch (err) {
    alert('Ошибка обновления комментария');
  }
};

export const handlePreview = async (
  dispatch: Dispatch,
  fileId: string,
): Promise<string> => {
  try {
    const url = await dispatch(previewFile({ fileId })).unwrap();
    return url; // Возвращаем URL
  } catch (err) {
    throw new Error('Ошибка предпросмотра');
  }
};

export const handleRenameMobile = async (
  dispatch: AppDispatch,
  file: File
) => {
  const newName = prompt('Введите новое имя файла:', file.original_name);
  if (newName && newName.trim() !== '') {
    await dispatch(updateFile({
      fileId: file.id,
      updatedData: { original_name: newName }
    }));
  }
};

export const handleCommentMobile = async (
  dispatch: AppDispatch,
  file: File
) => {
  const newComment = prompt('Введите комментарий:', file.comment || '');
  if (newComment !== null) {
    await dispatch(updateFile({
      fileId: file.id,
      updatedData: { comment: newComment }
    }));
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};
