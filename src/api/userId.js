// Utilitaire centralisé pour récupérer l'ID de l'utilisateur connecté.
// On lit d'abord le token JWT, et si ça échoue, on tombe sur le localStorage.
export function getUserId() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      return JSON.parse(atob(token.split('.')[1])).sub;
    } catch (e) {}
  }
  const stored = localStorage.getItem('userId');
  if (stored && stored !== 'undefined' && stored !== 'null') return stored;
  return null;
}
