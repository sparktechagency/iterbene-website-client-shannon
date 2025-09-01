export const performLogout = () => {
  // Clear cookies
  document.cookie = 'at=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'rt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'rvm=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'fpm=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'vet=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  // Clear localStorage
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Redirect to login page
  window.location.href = '/login';
};

export const isAuthenticated = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name] = cookie.trim().split('=');
    if (name === 'at') { // 'at' is the obfuscated name for ACCESS_TOKEN
      return true;
    }
  }
  return false;
};