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

  const getSortValue = (field) => {
    return sortConfig.key === field ? sortConfig.direction : 'none';
  };

  return (
    <div className="header">
      <div className="header__main">
        <div className="header-cell">
          <p>Фамилия</p>
          <div className="header-choice">
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
              <option className="sort-select__option" value="none">
                ↕
              </option>
              <option className="sort-select__option" value="asc">
                ↑
              </option>
              <option className="sort-select__option" value="desc">
                ↓
              </option>
            </select>
          </div>
        </div>
        <div className="header-cell">
          <p>Имя</p>
          <div className="header-choice">
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
              <option className="sort-select__option" value="none">
                ↕
              </option>
              <option className="sort-select__option" value="asc">
                ↑
              </option>
              <option className="sort-select__option" value="desc">
                ↓
              </option>
            </select>
          </div>
        </div>
        <div className="header-cell">
          <p>Возраст</p>
          <div className="header-choice">
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
              <option className="sort-select__option" value="none">
                ↕
              </option>
              <option className="sort-select__option" value="asc">
                ↑
              </option>
              <option className="sort-select__option" value="desc">
                ↓
              </option>
            </select>
          </div>
        </div>
        <div className="header-cell">
          <p>Пол</p>
          <div className="header-choice">
            <select
              value={filters.gender || ''}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="filter-select filter-select--gender">
              <option value="">Все</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
            <select
              value={getSortValue('gender')}
              onChange={(e) => handleSortChange('gender', e.target.value)}
              className="sort-select">
              <option className="sort-select__option" value="none">
                ↕
              </option>
              <option className="sort-select__option" value="asc">
                ↑
              </option>
              <option className="sort-select__option" value="desc">
                ↓
              </option>
            </select>
          </div>
        </div>
        <div className="header-cell">
          <p>Телефон</p>
          <div className="header-choice">
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
              <option className="sort-select__option" value="none">
                ↕
              </option>
              <option className="sort-select__option" value="asc">
                ↑
              </option>
              <option className="sort-select__option" value="desc">
                ↓
              </option>
            </select>
          </div>
        </div>
        <div className="header-cell">
          <p>Email</p>
          <input
            type="text"
            placeholder="Email"
            value={filters.email || ''}
            onChange={(e) => handleFilterChange('email', e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="header-cell">
          <p>Страна</p>
          <input
            type="text"
            placeholder="Страна"
            value={filters['address.country'] || ''}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="header-cell">
          <p>Город</p>
          <input
            type="text"
            placeholder="Город"
            value={filters['address.city'] || ''}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="filter-input"
          />
        </div>
      </div>
    </div>
  );
};
