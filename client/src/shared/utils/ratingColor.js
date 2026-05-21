function getRatingColor(rating) {
  if (rating == null || rating === 'N/A' || isNaN(rating)) {
    return 'text-gray-500';
  }

  const r = Number(rating);

  if (r <= 0) return 'text-gray-400';
  if (r < 5) return 'text-gray-300';
  if (r < 6) return 'text-orange-500';
  if (r < 7) return 'text-orange-400';
  if (r < 8) return 'text-yellow-500';
  if (r < 9) return 'text-yellow-400';
  return 'text-yellow-300';
}
export default getRatingColor;
