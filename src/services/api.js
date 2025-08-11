const API_URL = 'https://dummyjson.com/users';

export const fetchUsers = async ({
  filters = {},
  sortBy = '',
  order = 'none',
  page = 1,
  perPage = 10,
}) => {
  try {
    let url = API_URL;
    const params = new URLSearchParams();

    // 1. Фильтрация (только первый активный фильтр)
    const [filterKey, filterValue] = Object.entries(filters).find(([, v]) => v) || [];
    if (filterKey) {
      const apiKey =
        filterKey === 'city' || filterKey === 'country' ? `address.${filterKey}` : filterKey;
      url += `/filter?key=${apiKey}&value=${filterValue}`;
    }

    // 2. Пагинация
    params.append('limit', perPage);
    params.append('skip', (page - 1) * perPage);

    // 3. Сортировка
    if (sortBy && order !== 'none') {
      params.append('sortBy', sortBy);
      params.append('order', order);
    }

    // Формируем итоговый URL
    const finalUrl = url.includes('filter')
      ? `${url}&${params.toString()}`
      : `${url}?${params.toString()}`;

    const response = await fetch(finalUrl);
    if (!response.ok) throw new Error('Ошибка загрузки данных');

    const data = await response.json();
    return {
      users: data.users || data,
      total: data.total || 100, // dummyjson не возвращает total при фильтрации
      page,
      perPage,
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
