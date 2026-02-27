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
