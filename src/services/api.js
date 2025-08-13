const API_URL = 'https://dmyjson.com/users';

export const fetchUsers = async ({
  filters = {},
  sortBy = '',
  order = 'none',
  page = 1,
  perPage = 10,
}) => {
  try {
    const params = new URLSearchParams();

    params.append('limit', perPage);
    params.append('skip', (page - 1) * perPage);

    if (sortBy && order !== 'none') {
      params.append('sortBy', sortBy);
      params.append('order', order);
    }

    let url = API_URL;

    const [filterKey, filterValue] = Object.entries(filters).find(([, v]) => v) || [];
    if (filterKey && filterValue) {
      const field =
        filterKey === 'city' || filterKey === 'country' ? `address.${filterKey}` : filterKey;

      url = `${url}/filter?key=${field}&value=${encodeURIComponent(filterValue)}`;
    }

    const separator = url.includes('?') ? '&' : '?';
    const finalUrl = params.toString() ? `${url}${separator}${params.toString()}` : url;

    const response = await fetch(finalUrl);
    if (!response.ok) throw new Error('Ошибка загрузки данных');

    const data = await response.json();

    return {
      users: data.users || [],
      total: data.total || data.users?.length,
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchUserById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    console.log(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    const userData = await response.json();

    if (!userData || userData.message) {
      throw new Error('Пользователь не найден');
    }

    return userData;
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    throw error;
  }
};
