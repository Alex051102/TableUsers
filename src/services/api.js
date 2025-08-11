const API_URL = 'https://dummyjson.com/users';

export const fetchUsers = async (params = {}) => {
  try {
    const { sortBy, order, filters = {} } = params;
    let url = API_URL;

    const [serverFilterKey, serverFilterValue] =
      Object.entries(filters).find(([value]) => value !== '') || [];

    if (serverFilterKey) {
      const apiFilterKey = serverFilterKey.includes('.')
        ? serverFilterKey
        : serverFilterKey === 'city' || serverFilterKey === 'country'
        ? `address.${serverFilterKey}`
        : serverFilterKey;

      url += `/filter?key=${apiFilterKey}&value=${serverFilterValue}`;
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

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
