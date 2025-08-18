export const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL;
  // Remove leading slash from path if it exists
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};
