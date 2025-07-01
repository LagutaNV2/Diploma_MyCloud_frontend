// src/components/Admin/UserList.tsx

import React from 'react';
import { useAppSelector } from '../../store/hooks';
import UserItem from './UserItem';
import { formatBytes } from '../../utils/formatUtils';


const UserList: React.FC = () => {
  const { users, loading, error } = useAppSelector(state => state.users);
  console.log('Users:', users);

  const totalStorageBytes = users.reduce(
    (sum, user) => sum + (user.total_file_size || 0),
    0
  );
  const formattedTotalStorage = formatBytes(totalStorageBytes);

  if (loading) return <div>Загрузка пользователей...</div>;
  if (error) return <div className="text-red-500">Ошибка: {error}</div>;

  return (
    <div>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Статистика системы</h2>
        <p>Всего пользователей: <span className="font-bold">{users.length}</span></p>
        <p>Общий объем хранилища: <span className="font-bold">{formattedTotalStorage}</span></p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Логин</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th className="py-2 px-4 border-b">Администратор</th>
              <th className="py-2 px-4 border-b">Файлов</th>
              <th className="py-2 px-4 border-b">Объем</th>
              <th className="py-2 px-4 border-b">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <UserItem key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
