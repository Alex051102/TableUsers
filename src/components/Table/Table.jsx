import { useState, useEffect } from 'react';
import { fetchUsers } from '../../services/api';
import { TableHeader } from './TableHeader';
import { Pagination } from './Pagination';
import './Table.css';
export const Table = () => {
  const [state, setState] = useState({
    users: [],
    loading: false,
    error: null,
    filters: {},
    sortConfig: { key: null, direction: 'none' },
    pagination: { page: 1, perPage: 10, total: 0 },
  });

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

  if (state.loading) return <div className="loading">Загрузка...</div>;
  if (state.error) return <div className="error">Ошибка: {state.error}</div>;

  return (
    <div className="table-container">
      <table className="table">
        <TableHeader
          filters={state.filters}
          onFilter={handleFilterChange}
          onSort={handleSort}
          sortConfig={state.sortConfig}
        />
        <tbody className="table-info">
          {state.users.map((user) => (
            <tr className="table-info-column" key={user.id}>
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
