export const BASE_URL = 'https://ganesh-mandapam-backend.onrender.com/api';
export const BACKEND_SERVER_URL = 'https://ganesh-mandapam-backend.onrender.com';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${formattedEndpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const parseErrorMessage = (text: string, status: number): string => {
    try {
      const json = JSON.parse(text);
      if (json.error) return json.error;
      if (json.details) return json.details;
      if (json.message) return json.message;
      if (json.devotionalMessage) return json.devotionalMessage;
    } catch {
      // Not JSON
    }
    return text || `HTTP Error ${status}`;
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(parseErrorMessage(errorText, response.status));
  }

  return response.json();
}
