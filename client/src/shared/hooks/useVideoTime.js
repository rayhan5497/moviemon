// import { useState, useEffect } from 'react';

// export function useVideoTime(videoRef) {
//   const [currentTime, setCurrentTime] = useState(0);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const handleTimeUpdate = () => {
//       setCurrentTime(Math.floor(video.currentTime)); // seconds
//     };

//     video.addEventListener('timeupdate', handleTimeUpdate);

//     return () => {
//       video.removeEventListener('timeupdate', handleTimeUpdate);
//     };
//   }, [videoRef.current]);

//   return currentTime;
//   return currentTime;
// }
