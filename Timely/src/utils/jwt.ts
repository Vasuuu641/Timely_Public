export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;

    if (!exp) return true;

    const currentTime = Date.now() / 1000;
    return exp < currentTime;
  } catch {
    return true; // invalid token
  }
}
