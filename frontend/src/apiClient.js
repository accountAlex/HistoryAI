import Cookies from 'js-cookie';

const apiClient = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (!url.includes('/api/login') && !url.includes('/api/registration')) {
    const token = Cookies.get('jwtToken');
    console.log('apiClient: Запрос:', { url, token: token ? 'присутствует' : 'отсутствует', headers });
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('apiClient: Токен отсутствует для защищённого запроса, возможен редирект на /auth');
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('apiClient: Ответ:', { status: response.status, url, contentType: response.headers.get('content-type') });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorText;
      if (contentType && contentType.includes('text/html')) {
        errorText = await response.text();
        console.error('apiClient: Получен HTML вместо JSON:', errorText.slice(0, 200));
        if (response.status === 401 || response.status === 403) {
          console.warn('apiClient: Неавторизован (401/403), удаление токена и редирект на /auth');
          Cookies.remove('jwtToken');
          window.location.href = '/auth';
        }
        throw new Error(`Сервер вернул HTML (статус ${response.status}), вероятно, редирект на страницу логина`);
      } else {
        errorText = await response.text();
        console.error('apiClient: Ошибка сервера:', errorText);
      }
      throw new Error(`Ошибка: ${response.status} - ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('apiClient: Ответ не JSON:', text.slice(0, 200));
      throw new Error('Ожидался JSON, получен другой формат');
    }

    if (url.includes('/api/login') || url.includes('/api/registration')) {
      const authHeader = response.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        console.log('apiClient: Сохранение нового токена:', token.slice(0, 20) + '...');
        Cookies.set('jwtToken', token, { expires: 1 });
      } else {
        console.warn('apiClient: Токен не получен в ответе от /api/login или /api/registration');
      }
    }

    return await response.json();
  } catch (err) {
    console.error('apiClient: Ошибка при выполнении запроса:', err);
    throw err;
  }
};

export const logout = () => {
  console.log('apiClient: Выход, удаление токена');
  Cookies.remove('jwtToken');
};

export default apiClient;