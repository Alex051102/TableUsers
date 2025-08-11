import { useState } from 'react';

export const TableHeader = ({ onFilter, onSort, filters }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'none',
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'none';
    }

    const newSortConfig = { key, direction };
    setSortConfig(newSortConfig);
    onSort(newSortConfig);
  };

  const handleFilterChange = (field, value) => {
    if (value === '') {
      onFilter({});
    } else if (field === 'country' || field === 'city') {
      onFilter({ [`address.${field}`]: value });
    } else {
      onFilter({ [field]: value });
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <thead>
      <tr>
        <th>
          <div className="header-cell">
            <input
              type="text"
              placeholder="Фамилия"
              value={filters.lastName || ''}
              onChange={(e) => handleFilterChange('lastName', e.target.value)}
              className="filter-input"
            />
            <button onClick={() => handleSort('lastName')} className="sort-button">
              {getSortIcon('lastName')}
            </button>
          </div>
        </th>

        <th>
          <div className="header-cell">
            <input
              type="text"
              placeholder="Имя"
              value={filters.firstName || ''}
              onChange={(e) => handleFilterChange('firstName', e.target.value)}
              className="filter-input"
            />
            <button onClick={() => handleSort('firstName')} className="sort-button">
              {getSortIcon('firstName')}
            </button>
          </div>
        </th>

        <th>
          <div className="header-cell">
            <input
              type="number"
              placeholder="Возраст"
              value={filters.age || ''}
              onChange={(e) => handleFilterChange('age', e.target.value)}
              className="filter-input"
            />
            <button onClick={() => handleSort('age')} className="sort-button">
              {getSortIcon('age')}
            </button>
          </div>
        </th>

        <th>
          <div className="header-cell">
            <select
              value={filters.gender || ''}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="filter-select">
              <option value="">Все</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
            <button onClick={() => handleSort('gender')} className="sort-button">
              {getSortIcon('gender')}
            </button>
          </div>
        </th>

        <th>
          <div className="header-cell">
            <input
              type="text"
              placeholder="Телефон"
              value={filters.phone || ''}
              onChange={(e) => handleFilterChange('phone', e.target.value)}
              className="filter-input"
            />
            <button onClick={() => handleSort('phone')} className="sort-button">
              {getSortIcon('phone')}
            </button>
          </div>
        </th>

        <th>
          <input
            type="text"
            placeholder="Email"
            value={filters.email || ''}
            onChange={(e) => handleFilterChange('email', e.target.value)}
            className="filter-input"
          />
        </th>

        <th>
          <input
            type="text"
            placeholder="Страна"
            value={filters['address.country'] || ''}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="filter-input"
          />
        </th>

        <th>
          <input
            type="text"
            placeholder="Город"
            value={filters['address.city'] || ''}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="filter-input"
          />
        </th>
      </tr>
    </thead>
  );
};
