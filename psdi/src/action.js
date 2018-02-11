// Action for moving
export function moveSlide(id) {
  return {
    type: 'MOVE',
    id
  };
}
export function changeSource(source) {
  return {
    type: 'CHANGESOURCE',
    source
  };
}
export function addBookmark(isAdding) {
  return {
    type: 'ADDBOOKMARK',
    isAdding
  };
}
