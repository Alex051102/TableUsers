import { useState, useEffect } from 'react';
import { fetchUsers } from '../../services/api';

export const Table = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'none',
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUsers({
          sortBy: sortConfig.key,
          order: sortConfig.direction,
          filters,
        });
        setUsers(data.users || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadUsers, 300);
    return () => clearTimeout(timer);
  }, [filters, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key) {
      direction =
        sortConfig.direction === 'asc' ? 'desc' : sortConfig.direction === 'desc' ? 'none' : 'asc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters };
    if (value === '') {
      delete newFilters[field];
    } else if (field === 'country' || field === 'city') {
      newFilters[`address.${field}`] = value;
    } else {
      newFilters[field] = value;
    }
    setFilters(newFilters);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : '↕';
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>
            <div className="header-cell">
              <input
                type="text"
                placeholder="Фамилия"
                value={filters.lastName || ''}
                onChange={(e) => handleFilterChange('lastName', e.target.value)}
              />
              <button onClick={() => handleSort('lastName')}>{getSortIcon('lastName')}</button>
            </div>
          </th>

          <th>
            <div className="header-cell">
              <input
                type="text"
                placeholder="Имя"
                value={filters.firstName || ''}
                onChange={(e) => handleFilterChange('firstName', e.target.value)}
              />
              <button onClick={() => handleSort('firstName')}>{getSortIcon('firstName')}</button>
            </div>
          </th>

          <th>
            <div className="header-cell">
              <input
                type="text"
                placeholder="Отчество"
                value={filters.maidenName || ''}
                onChange={(e) => handleFilterChange('maidenName', e.target.value)}
              />
              <button onClick={() => handleSort('maidenName')}>{getSortIcon('maidenName')}</button>
            </div>
          </th>

          <th>
            <div className="header-cell">
              <input
                type="number"
                placeholder="Возраст"
                value={filters.age || ''}
                onChange={(e) => handleFilterChange('age', e.target.value)}
              />
              <button onClick={() => handleSort('age')}>{getSortIcon('age')}</button>
            </div>
          </th>

          <th>
            <div className="header-cell">
              <select
                value={filters.gender || ''}
                onChange={(e) => handleFilterChange('gender', e.target.value)}>
                <option value="">Все</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
              <button onClick={() => handleSort('gender')}>{getSortIcon('gender')}</button>
            </div>
          </th>

          <th>
            <div className="header-cell">
              <input
                type="text"
                placeholder="Телефон"
                value={filters.phone || ''}
                onChange={(e) => handleFilterChange('phone', e.target.value)}
              />
              <button onClick={() => handleSort('phone')}>{getSortIcon('phone')}</button>
            </div>
          </th>

          <th>
            <div className="header-cell">
              <input
                type="text"
                placeholder="Email"
                value={filters.email || ''}
                onChange={(e) => handleFilterChange('email', e.target.value)}
              />
            </div>
          </th>

          <th>
            <div className="header-cell">
              <input
                type="text"
                placeholder="Страна"
                value={filters['address.country'] || ''}
                onChange={(e) => handleFilterChange('country', e.target.value)}
              />
            </div>
          </th>

          <th>
            <div className="header-cell">
              <input
                type="text"
                placeholder="Город"
                value={filters['address.city'] || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.lastName}</td>
            <td>{user.firstName}</td>
            <td>{user.maidenName}</td>
            <td>{user.age}</td>
            <td>{user.gender}</td>
            <td>{user.phone}</td>
            <td>{user.email}</td>
            <td>{user.address?.country}</td>
            <td>{user.address?.city}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
