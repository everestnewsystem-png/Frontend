export const startKeepAlive = () => {
  const url = import.meta.env.VITE_KEEP_ALIVE_URL;

  setInterval(() => {
    fetch(url).catch(() => {});
  }, 120000); // 2 minutes
};
