export const getToken = () => localStorage.getItem('branplate_token');
export async function apiFetch(input, init = {}) {
    const headers = new Headers(init.headers);
    const token = getToken();
    if (token)
        headers.set('Authorization', `Bearer ${token}`);
    if (init.body && !headers.has('Content-Type'))
        headers.set('Content-Type', 'application/json');
    const response = await fetch(input, { ...init, headers });
    if (response.status === 401 && token) {
        localStorage.removeItem('branplate_token');
        localStorage.removeItem('branplate_user');
    }
    return response;
}
export function saveSession(token, user) {
    localStorage.setItem('branplate_token', token);
    localStorage.setItem('branplate_user', JSON.stringify(user));
}
export function clearSession() {
    localStorage.removeItem('branplate_token');
    localStorage.removeItem('branplate_user');
}
