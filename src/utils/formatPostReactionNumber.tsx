// Utility function to format numbers (e.g., 1000 → 1k, 1100 → 1.1k, 41500 → 41.5k, 1000000 → 1m)
const formatPostReactionNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num >= 1000 && num < 1000000) {
    const value = (num / 1000).toFixed(1);
    return value.endsWith(".0") ? `${Math.floor(num / 1000)}k` : `${value}k`;
  }
  if (num >= 1000000) {
    const value = (num / 1000000).toFixed(1);
    return value.endsWith(".0") ? `${Math.floor(num / 1000000)}m` : `${value}m`;
  }
  return num.toString();
};

export default formatPostReactionNumber;