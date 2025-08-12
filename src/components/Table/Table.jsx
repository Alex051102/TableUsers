import { useState, useEffect, useRef } from 'react';
import { fetchUsers, fetchUserById } from '../../services/api';
import { TableHeader } from './TableHeader';
import { Pagination } from './Pagination';
import './Table.css';

export const Table = ({ setToModal }) => {
  const [state, setState] = useState({
    users: [],
    loading: false,
    error: null,
    filters: {},
    sortConfig: { key: null, direction: 'none' },
    pagination: { page: 1, perPage: 10, total: 0 },
  });

  const [columnWidths, setColumnWidths] = useState({
    lastName: 120,
    firstName: 120,
    age: 80,
    gender: 80,
    phone: 150,
    email: 200,
    country: 120,
    city: 120,
  });

  const headerRefs = useRef({});

  const loadUsers = async ({ filters, sortBy, order, page, perPage }) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { users, total } = await fetchUsers({
        filters,
        sortBy,
        order,
        page,
        perPage,
      });

      setState((prev) => ({
        ...prev,
        users,
        pagination: { ...prev.pagination, total },
      }));
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const showInfo = async (id) => {
    try {
      const user = await fetchUserById(id);
      console.log('Данные пользователя:', user);
      setToModal(user);
    } catch (error) {
      console.error('Не удалось получить пользователя:', error.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers({
        filters: state.filters,
        sortBy: state.sortConfig.key,
        order: state.sortConfig.direction,
        page: state.pagination.page,
        perPage: state.pagination.perPage,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [
    state.filters,
    state.sortConfig.key,
    state.sortConfig.direction,
    state.pagination.page,
    state.pagination.perPage,
  ]);

  const handleFilterChange = (newFilters) => {
    const activeFilter = Object.entries(newFilters).find(([, v]) => v) || [];
    const updatedFilters = activeFilter[0] ? { [activeFilter[0]]: activeFilter[1] } : {};

    setState((prev) => ({
      ...prev,
      filters: updatedFilters,
      pagination: { ...prev.pagination, page: 1 },
    }));
  };

  const handleSort = (key, direction) => {
    setState((prev) => ({
      ...prev,
      sortConfig: { key, direction },
      pagination: { ...prev.pagination, page: 1 },
    }));
  };

  const handlePageChange = (page) => {
    setState((prev) => ({ ...prev, pagination: { ...prev.pagination, page } }));
  };

  // Обработчик изменения ширины колонки
  const handleResize = (columnName, width) => {
    setColumnWidths((prev) => ({
      ...prev,
      [columnName]: Math.max(50, width), // Минимальная ширина 50px
    }));
  };

  // Функция для начала перетаскивания
  const startResize = (columnName, e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[columnName];

    const doResize = (e) => {
      const newWidth = startWidth + e.clientX - startX;
      handleResize(columnName, newWidth);
    };

    const stopResize = () => {
      document.removeEventListener('mousemove', doResize);
      document.removeEventListener('mouseup', stopResize);
    };

    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
  };

  if (state.loading) return <div className="loading">Загрузка...</div>;
  if (state.error) return <div className="error">Ошибка: {state.error}</div>;

  return (
    <div className="table-main">
      <div className="table-container">
        <TableHeader
          filters={state.filters}
          onFilter={handleFilterChange}
          onSort={handleSort}
          sortConfig={state.sortConfig}
        />
        <table className="table">
          <tbody className="table-info">
            <tr className="table-info-titles">
              <td
                style={{ width: `${columnWidths.lastName}px` }}
                ref={(el) => (headerRefs.current.lastName = el)}>
                Фамилия
                <span className="resize-handle" onMouseDown={(e) => startResize('lastName', e)} />
              </td>
              <td
                style={{ width: `${columnWidths.firstName}px` }}
                ref={(el) => (headerRefs.current.firstName = el)}>
                Имя
                <span className="resize-handle" onMouseDown={(e) => startResize('firstName', e)} />
              </td>
              <td
                style={{ width: `${columnWidths.age}px` }}
                ref={(el) => (headerRefs.current.age = el)}>
                Возраст
                <span className="resize-handle" onMouseDown={(e) => startResize('age', e)} />
              </td>
              <td
                style={{ width: `${columnWidths.gender}px` }}
                ref={(el) => (headerRefs.current.gender = el)}>
                Пол
                <span className="resize-handle" onMouseDown={(e) => startResize('gender', e)} />
              </td>
              <td
                style={{ width: `${columnWidths.phone}px` }}
                ref={(el) => (headerRefs.current.phone = el)}>
                Телефон
                <span className="resize-handle" onMouseDown={(e) => startResize('phone', e)} />
              </td>
              <td
                style={{ width: `${columnWidths.email}px` }}
                ref={(el) => (headerRefs.current.email = el)}>
                Email
                <span className="resize-handle" onMouseDown={(e) => startResize('email', e)} />
              </td>
              <td
                style={{ width: `${columnWidths.country}px` }}
                ref={(el) => (headerRefs.current.country = el)}>
                Страна
                <span className="resize-handle" onMouseDown={(e) => startResize('country', e)} />
              </td>
              <td
                style={{ width: `${columnWidths.city}px` }}
                ref={(el) => (headerRefs.current.city = el)}>
                Город
                <span className="resize-handle" onMouseDown={(e) => startResize('city', e)} />
              </td>
            </tr>
            {state.users.map((user) => (
              <tr onClick={() => showInfo(user.id)} className="table-info-column" key={user.id}>
                <td
                  className="table-info-column-text"
                  style={{ width: `${columnWidths.lastName}px` }}>
                  {user.lastName}
                </td>
                <td style={{ width: `${columnWidths.firstName}px` }}>{user.firstName}</td>
                <td style={{ width: `${columnWidths.age}px` }}>{user.age}</td>
                <td style={{ width: `${columnWidths.gender}px` }}>{user.gender}</td>
                <td style={{ width: `${columnWidths.phone}px` }}>{user.phone}</td>
                <td style={{ width: `${columnWidths.email}px` }}>{user.email}</td>
                <td style={{ width: `${columnWidths.country}px` }}>{user.address?.country}</td>
                <td style={{ width: `${columnWidths.city}px` }}>{user.address?.city}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={state.pagination.page}
          totalItems={state.pagination.total}
          itemsPerPage={state.pagination.perPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
