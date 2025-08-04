export const utils = {
  getTimeAgo: (timestamp: Date | null): string => {
    if (!timestamp) return '';
    const diff = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (diff < 60) return `Updated just now`;
    if (diff < 3600) return `Updated ${Math.floor(diff / 60)} min ago`;
    return `Updated ${Math.floor(diff / 3600)} hour(s) ago`;
  }
};