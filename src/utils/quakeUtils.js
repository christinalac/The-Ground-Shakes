export function normalizeQuakes(data) {
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.quakes)
      ? data.quakes
      : Array.isArray(data?.features)
        ? data.features
        : Array.isArray(data?.earthquakes)
          ? data.earthquakes
          : [];

  return items.filter(hasQuakeCoordinates);
}

export function hasQuakeCoordinates(quake) {
  const coords = quake?.geometry?.coordinates || quake?.coordinates;
  const hasCoordinateArray = Array.isArray(coords) && coords.length >= 2;
  const hasDirectCoordinates = typeof quake?.lng === 'number' && typeof quake?.lat === 'number';
  return hasCoordinateArray || hasDirectCoordinates;
}

export function getQuakeCoordinates(quake) {
  const coords = quake?.geometry?.coordinates || quake?.coordinates;

  if (Array.isArray(coords) && coords.length >= 2) {
    return { lon: coords[0], lat: coords[1] };
  }

  if (typeof quake?.lng === 'number' && typeof quake?.lat === 'number') {
    return { lon: quake.lng, lat: quake.lat };
  }

  return null;
}
