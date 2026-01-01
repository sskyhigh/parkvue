export const getRoomCapacity = (room) => {
  if (!room) return 0;

  const cap = room.capacity;
  if (Number.isFinite(cap)) return cap;

  // Backwards compatibility for older documents that used boolean `available`
  if (room.available === false) return 0;
  if (room.available === true) return 1;

  // Default assumption if neither exists
  return 1;
};

// Business rule: listings should not exceed this many total spaces.
export const MAX_LISTING_CAPACITY = 100;

export const getRoomMaxCapacity = (room) => {
  if (!room) return 0;

  const max = room.maxCapacity ?? room.totalCapacity;
  if (Number.isFinite(max)) return max;

  const cap = getRoomCapacity(room);
  return cap;
};

export const isRoomAvailable = (room) => getRoomCapacity(room) > 0;
