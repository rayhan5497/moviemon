export default function formatRating(num) {
  const rounded = Math.round(num * 10) / 10;
  return rounded < 0.1 ? '0' : rounded.toFixed(1);
}