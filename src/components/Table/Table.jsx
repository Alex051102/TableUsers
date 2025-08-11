import { useState, useEffect } from 'react';
import { fetchUsers } from '../../services/api';
import { TableHeader } from './TableHeader';
import { Pagination } from './Pagination';

export const Table = () => {
  const [state, setState] = useState({
    users: [],
    loading: false,
    error: null,
    filters: {},
    sortConfig: { key: null, direction: 'none' },
    pagination: { page: 1, perPage: 10, total: 0 },
  });

  const loadUsers = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { users, total } = await fetchUsers({
        filters: state.filters,
        sortBy: state.sortConfig.key,
        order: state.sortConfig.direction,
        page: state.pagination.page,
        perPage: state.pagination.perPage,
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

  useEffect(() => {
    const timer = setTimeout(loadUsers, 300);
    return () => clearTimeout(timer);
  }, [state.filters, state.sortConfig, state.pagination.page]);

  const handleFilterChange = (newFilters) => {
    // Сбрасываем предыдущий фильтр и устанавливаем новый
    const activeFilter = Object.entries(newFilters).find(([, v]) => v) || [];
    const updatedFilters = activeFilter[0] ? { [activeFilter[0]]: activeFilter[1] } : {};

    setState((prev) => ({
      ...prev,
      filters: updatedFilters,
      pagination: { ...prev.pagination, page: 1 }, // Сброс страницы при фильтрации
    }));
  };

  const handleSort = (key) => {
    setState((prev) => {
      const direction =
        prev.sortConfig.key !== key ? 'asc' : prev.sortConfig.direction === 'asc' ? 'desc' : 'none';

      return {
        ...prev,
        sortConfig: { key, direction },
        pagination: { ...prev.pagination, page: 1 }, // Сброс страницы при сортировке
      };
    });
  };

  const handlePageChange = (page) => {
    setState((prev) => ({ ...prev, pagination: { ...prev.pagination, page } }));
  };

  if (state.loading) return <div className="loading">Загрузка...</div>;
  if (state.error) return <div className="error">Ошибка: {state.error}</div>;

  return (
    <div className="table-container">
      <table className="user-table">
        <TableHeader
          filters={state.filters}
          onFilter={handleFilterChange}
          onSort={handleSort}
          sortConfig={state.sortConfig}
        />
        <tbody>
          {state.users.map((user) => (
            <tr key={user.id}>
              <td>{user.lastName}</td>
              <td>{user.firstName}</td>
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

      <Pagination
        currentPage={state.pagination.page}
        totalItems={state.pagination.total}
        itemsPerPage={state.pagination.perPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
