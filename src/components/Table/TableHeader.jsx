export const TableHeader = ({ onFilter, onSort, filters, sortConfig }) => {
  const handleFilterChange = (field, value) => {
    if (value === '') {
      onFilter({});
    } else if (field === 'country' || field === 'city') {
      onFilter({ [`address.${field}`]: value });
    } else {
      onFilter({ [field]: value });
    }
  };

  const handleSortChange = (field, value) => {
    if (value === 'none') {
      onSort(field, 'none');
    } else if (value === 'asc') {
      onSort(field, 'asc');
    } else if (value === 'desc') {
      onSort(field, 'desc');
    }
  };

  // Вспомогательная функция для определения активного значения
  const getSortValue = (field) => {
    return sortConfig.key === field ? sortConfig.direction : 'none';
  };

  return (
    <thead>
      <tr>
        {/* Фамилия */}
        <th>
          <div className="header-cell">
            <input
              type="text"
              placeholder="Фамилия"
              value={filters.lastName || ''}
              onChange={(e) => handleFilterChange('lastName', e.target.value)}
              className="filter-input"
            />
            <select
              value={getSortValue('lastName')}
              onChange={(e) => handleSortChange('lastName', e.target.value)}
              className="sort-select">
              <option value="none">Без сортировки</option>
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select>
          </div>
        </th>

        {/* Имя */}
        <th>
          <div className="header-cell">
            <input
              type="text"
              placeholder="Имя"
              value={filters.firstName || ''}
              onChange={(e) => handleFilterChange('firstName', e.target.value)}
              className="filter-input"
            />
            <select
              value={getSortValue('firstName')}
              onChange={(e) => handleSortChange('firstName', e.target.value)}
              className="sort-select">
              <option value="none">Без сортировки</option>
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select>
          </div>
        </th>

        {/* Возраст */}
        <th>
          <div className="header-cell">
            <input
              type="number"
              placeholder="Возраст"
              value={filters.age || ''}
              onChange={(e) => handleFilterChange('age', e.target.value)}
              className="filter-input"
            />
            <select
              value={getSortValue('age')}
              onChange={(e) => handleSortChange('age', e.target.value)}
              className="sort-select">
              <option value="none">Без сортировки</option>
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select>
          </div>
        </th>

        {/* Пол */}
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
            <select
              value={getSortValue('gender')}
              onChange={(e) => handleSortChange('gender', e.target.value)}
              className="sort-select">
              <option value="none">Без сортировки</option>
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select>
          </div>
        </th>

        {/* Телефон */}
        <th>
          <div className="header-cell">
            <input
              type="text"
              placeholder="Телефон"
              value={filters.phone || ''}
              onChange={(e) => handleFilterChange('phone', e.target.value)}
              className="filter-input"
            />
            <select
              value={getSortValue('phone')}
              onChange={(e) => handleSortChange('phone', e.target.value)}
              className="sort-select">
              <option value="none">Без сортировки</option>
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select>
          </div>
        </th>

        {/* Email */}
        <th>
          <input
            type="text"
            placeholder="Email"
            value={filters.email || ''}
            onChange={(e) => handleFilterChange('email', e.target.value)}
            className="filter-input"
          />
        </th>

        {/* Страна */}
        <th>
          <input
            type="text"
            placeholder="Страна"
            value={filters['address.country'] || ''}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="filter-input"
          />
        </th>

        {/* Город */}
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
