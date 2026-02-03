// Centralized utility for room type labels
export function getRoomTypeLabel(type) {
  switch (type) {
    case 'Entire home/apt':
      return 'location.room_types.entire_home';
    case 'Private room':
      return 'location.room_types.private_room';
    case 'Shared room':
      return 'location.room_types.shared_room';
    case 'Hotel room':
      return 'location.room_types.hotel_room';
    default:
      return type || '';
  }
}
