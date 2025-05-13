import Cookies from 'js-cookie';

const apiClient = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (!url.includes('/api/login') && !url.includes('/api/registration')) {
    const token = Cookies.get('jwtToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка: ${response.status} - ${errorText}`);
    }

    if (url.includes('/api/login') || url.includes('/api/registration')) {
      const authHeader = response.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        Cookies.set('jwtToken', token, { expires: 1 });
      }
    }
    return response.json();
  } catch (err) {
    console.error('Ошибка при выполнении запроса:', err);
    throw err;
  }
};

export const logout = () => {
  Cookies.remove('jwtToken');
};

export default apiClient;