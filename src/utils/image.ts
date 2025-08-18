const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

// Common image sizes
export const IMAGE_SIZES = {
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    original: "original",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
};

export const getImageUrl = (
  imagePath: string,
  type: "poster" | "backdrop" = "poster",
  size: "small" | "medium" | "large" | "original" = "medium",
) => {
  if (!imagePath) return null;

  const imageSize = IMAGE_SIZES[type][size];
  return `${TMDB_IMAGE_BASE_URL}${imageSize}${imagePath}`;
};
