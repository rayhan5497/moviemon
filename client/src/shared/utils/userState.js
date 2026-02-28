export const saveSidebarState = (isSidebarOpen) => {
  try {
    localStorage.setItem('sidebarState', JSON.stringify(isSidebarOpen));
  } catch (error) {
    console.error('Error saving sidebarState:', error);
  }
};

export const getSidebarState = () => {
  try {
    const stored = localStorage.getItem('sidebarState');
    if (stored === null) return null;

    return JSON.parse(stored); 
  } catch (error) {
    console.error('Error getting sidebarState:', error);
    return null;
  }
};

export const AGREEMENTS_VERSION = 1;
const AGREEMENTS_KEY = 'agreementsState';

export const saveAgreementsState = (state) => {
  try {
    const payload = {
      accepted: Boolean(state?.accepted),
      acceptedAt: state?.acceptedAt || null,
      version: state?.version ?? AGREEMENTS_VERSION,
    };
    localStorage.setItem(AGREEMENTS_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error('Error saving agreements state:', error);
  }
};

export const getAgreementsState = () => {
  try {
    const stored = localStorage.getItem(AGREEMENTS_KEY);
    if (stored === null) return null;

    return JSON.parse(stored);
  } catch (error) {
    console.error('Error getting agreements state:', error);
    return null;
  }
};

// export const clearWatchProgress = (showId) => {
//   try {
//     const watchHistory = JSON.parse(
//       localStorage.getItem('watchHistory') || '{}'
//     );
//     delete watchHistory[showId];
//     localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
//   } catch (error) {
//     console.error('Error clearing watch progress:', error);
//   }
// };
