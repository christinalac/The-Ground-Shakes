import { useState, useEffect } from "react";

const STORAGE_KEY = "quake_favorites";

// Reads the current favorites array from localStorage
function loadFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Saves the favorites array to localStorage
function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(loadFavorites);

  // Keep localStorage in sync whenever favorites changes
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  // Check if a quake is already favorited by its ID
  function isFavorite(quakeId) {
    return favorites.some((q) => q._id === quakeId || q.usgsId === quakeId);
  }

  // Add a quake to favorites
  function addFavorite(quake) {
    if (!isFavorite(quake._id || quake.usgsId)) {
      setFavorites((prev) => [...prev, quake]);
    }
  }

  // Remove a quake from favorites
  function removeFavorite(quakeId) {
    setFavorites((prev) =>
      prev.filter((q) => q._id !== quakeId && q.usgsId !== quakeId)
    );
  }

  // Toggle — adds if not favorited, removes if already favorited
  function toggleFavorite(quake) {
    const id = quake._id || quake.usgsId;
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(quake);
    }
  }

  return { favorites, isFavorite, toggleFavorite };
}
