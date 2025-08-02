export function getToken(): string | null {
  return localStorage.getItem('jwtToken');
}

export function getUserRole(): string {
  return localStorage.getItem('authorized_role') || '';
}

export function saveAuthInfo(token: string, role: string) {
  localStorage.setItem('jwtToken', token);
  localStorage.setItem('authorized_role', role);
}

export function clearAuthInfo() {
  localStorage.clear();
}
