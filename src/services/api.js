const API_URL = 'https://dummyjson.com/users';

export const fetchUsers = async (params = {}) => {
  try {
    const { sortBy, order, filters = {} } = params;
    let url = API_URL;

    const [serverFilterKey, serverFilterValue] =
      Object.entries(filters).find(([, value]) => value !== '' && value !== undefined) || [];

    if (serverFilterKey) {
      const apiFilterKey = serverFilterKey.includes('.')
        ? serverFilterKey
        : serverFilterKey === 'city' || serverFilterKey === 'country'
        ? `address.${serverFilterKey}`
        : serverFilterKey;

      const apiFilterValue =
        serverFilterKey === 'age' ? parseInt(serverFilterValue) : serverFilterValue;

      url += `/filter?key=${apiFilterKey}&value=${apiFilterValue}`;
    } else {
      url += '?';
    }

    if (sortBy && order && order !== 'none') {
      url += `${url.includes('?') ? '&' : '?'}sortBy=${sortBy}&order=${order}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Ошибка загрузки данных');
    let data = await response.json();
    data = data.users || data;

    const clientFilters = Object.entries(filters)
      .filter(([key]) => key !== serverFilterKey)
      .filter(([, value]) => value !== '' && value !== undefined);

    if (clientFilters.length > 0) {
      data = data.filter((user) => {
        return clientFilters.every(([key, value]) => {
          const userValue = key.split('.').reduce((obj, k) => obj?.[k], user);

          if (key === 'age') {
            const numValue = parseInt(value);
            return !isNaN(numValue) && userValue === numValue;
          }

          return String(userValue).toLowerCase().includes(String(value).toLowerCase());
        });
      });
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
