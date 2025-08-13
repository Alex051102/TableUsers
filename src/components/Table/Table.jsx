import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchUsers, fetchUserById } from '../../services/api';
import { Filter } from '../Filter/Filter';
import { Pagination } from '../Pagination/Pagination';
import './Table.css';
import Loading from '../Loading/Loading';
import ErrorMess from '../ErrorMess/ErrorMess';

export const Table = ({ setToModal }) => {
  const tableRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(0);
  const MIN_COLUMN_WIDTH = 50;

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

  useEffect(() => {
    const updateWidth = () => {
      if (tableRef.current) {
        setTableWidth(tableRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const calculateTotalWidth = useCallback((widths) => {
    return Object.values(widths).reduce((sum, width) => sum + width, 0);
  }, []);

  useEffect(() => {
    const totalWidth = calculateTotalWidth(columnWidths);
    if (totalWidth > tableWidth && tableWidth > 0) {
      const scaleFactor = tableWidth / totalWidth;
      const newWidths = Object.entries(columnWidths).reduce((acc, [key, width]) => {
        acc[key] = Math.max(MIN_COLUMN_WIDTH, Math.floor(width * scaleFactor));
        return acc;
      }, {});

      setColumnWidths(newWidths);
    }
  }, [tableWidth, columnWidths, calculateTotalWidth]);

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
    }, 0);

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

  const startResize = useCallback(
    (columnName, e) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = columnWidths[columnName];
      const totalWidth = calculateTotalWidth(columnWidths);

      const doResize = (e) => {
        const newWidth = startWidth + (e.clientX - startX);

        if (newWidth < MIN_COLUMN_WIDTH) return;

        const newTotalWidth = totalWidth - startWidth + newWidth;

        if (newTotalWidth <= tableWidth) {
          setColumnWidths((prev) => ({
            ...prev,
            [columnName]: newWidth,
          }));
        } else {
          const scaleFactor = tableWidth / newTotalWidth;
          const newWidths = Object.entries(columnWidths).reduce((acc, [key, width]) => {
            if (key === columnName) {
              acc[key] = newWidth;
            } else {
              acc[key] = Math.max(MIN_COLUMN_WIDTH, Math.floor(width * scaleFactor));
            }
            return acc;
          }, {});

          setColumnWidths(newWidths);
        }
      };

      const stopResize = () => {
        document.removeEventListener('mousemove', doResize);
        document.removeEventListener('mouseup', stopResize);
      };

      document.addEventListener('mousemove', doResize);
      document.addEventListener('mouseup', stopResize);
    },
    [columnWidths, tableWidth, calculateTotalWidth],
  );

  if (state.loading) return <Loading></Loading>;
  if (state.error) return <ErrorMess message={state.error}></ErrorMess>;

  return (
    <div className="table-main">
      <div className="table-container">
        <Filter
          filters={state.filters}
          onFilter={handleFilterChange}
          onSort={handleSort}
          sortConfig={state.sortConfig}
        />
        <table ref={tableRef} className="table" style={{ width: '100%' }}>
          <tbody className="table-info">
            <tr className="table-info-titles">
              <td style={{ width: `${columnWidths.lastName}px` }} data-column="lastName">
                Фамилия
                <span className="resize-handle" onMouseDown={(e) => startResize('lastName', e)} />
              </td>
              <td style={{ width: `${columnWidths.firstName}px` }} data-column="firstName">
                Имя
                <span className="resize-handle" onMouseDown={(e) => startResize('firstName', e)} />
              </td>
              <td style={{ width: `${columnWidths.age}px` }} data-column="age">
                Возраст
                <span className="resize-handle" onMouseDown={(e) => startResize('age', e)} />
              </td>
              <td style={{ width: `${columnWidths.gender}px` }} data-column="gender">
                Пол
                <span className="resize-handle" onMouseDown={(e) => startResize('gender', e)} />
              </td>
              <td style={{ width: `${columnWidths.phone}px` }} data-column="phone">
                Телефон
                <span className="resize-handle" onMouseDown={(e) => startResize('phone', e)} />
              </td>
              <td style={{ width: `${columnWidths.email}px` }} data-column="email">
                Email
                <span className="resize-handle" onMouseDown={(e) => startResize('email', e)} />
              </td>
              <td style={{ width: `${columnWidths.country}px` }} data-column="country">
                Страна
                <span className="resize-handle" onMouseDown={(e) => startResize('country', e)} />
              </td>
              <td style={{ width: `${columnWidths.city}px` }} data-column="city">
                Город
                <span className="resize-handle" onMouseDown={(e) => startResize('city', e)} />
              </td>
            </tr>
            {state.users.map((user) => (
              <tr onClick={() => showInfo(user.id)} className="table-info-column" key={user.id}>
                <td style={{ width: `${columnWidths.lastName}px` }}>{user.lastName}</td>
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
