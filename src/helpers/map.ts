// Default fallback geofence duty base
export const DEFAULT_GEOFENCE_BASE = {
  lat: 22.7765,
  lng: 86.1475,
  radius: 500, // 500 meters
};

export const getDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371000; // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
};

export const checkGeofence = (
  userLocation: { lat: number; lng: number },
  baseLocation?: { lat: number; lng: number; radius?: number }
) => {
  const centerLat = baseLocation?.lat ?? DEFAULT_GEOFENCE_BASE.lat;
  const centerLng = baseLocation?.lng ?? DEFAULT_GEOFENCE_BASE.lng;
  const radius = baseLocation?.radius ?? DEFAULT_GEOFENCE_BASE.radius;

  const distance = getDistance(
    userLocation.lat,
    userLocation.lng,
    centerLat,
    centerLng
  );

  return {
    isInside: distance <= radius,
    distanceMeters: distance,
    radiusMeters: radius,
  };
};

export interface RealGPSFix {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

/**
 * Instantly fetches real GPS coordinates from device hardware
 * maximumAge: 0 forces the browser to query live hardware rather than cached location
 */
export const fetchInstantRealLocation = (): Promise<RealGPSFix> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported by this device."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy || 10),
          timestamp: pos.timestamp || Date.now(),
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Instant live hardware fix, no stale cache
      }
    );
  });
};

export const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
  return fetchInstantRealLocation().then((fix) => ({ lat: fix.lat, lng: fix.lng }));
};
