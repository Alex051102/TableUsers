const API_URL = 'https://dummyjson.com/users'; // Убраны пробелы

export const fetchUsers = async ({
  filters = {},
  sortBy = '',
  order = 'none',
  page = 1,
  perPage = 10,
}) => {
  try {
    const params = new URLSearchParams();

    // Пагинация
    params.append('limit', perPage);
    params.append('skip', (page - 1) * perPage);

    // Сортировка
    if (sortBy && order !== 'none') {
      params.append('sortBy', sortBy);
      params.append('order', order);
    }

    let url = API_URL;

    // Фильтрация
    const [filterKey, filterValue] = Object.entries(filters).find(([, v]) => v) || [];
    if (filterKey && filterValue) {
      const field =
        filterKey === 'city' || filterKey === 'country' ? `address.${filterKey}` : filterKey;

      // Формируем URL с фильтром и добавляем параметры через &
      url = `${url}/filter?key=${field}&value=${encodeURIComponent(filterValue)}`;
    }

    // Объединяем URL и параметры
    const separator = url.includes('?') ? '&' : '?';
    const finalUrl = params.toString() ? `${url}${separator}${params.toString()}` : url;
    console.log(finalUrl);
    const response = await fetch(finalUrl);
    if (!response.ok) throw new Error('Ошибка загрузки данных');

    const data = await response.json();

    return {
      users: data.users || [],
      total: data.total || data.users?.length || 100,
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
