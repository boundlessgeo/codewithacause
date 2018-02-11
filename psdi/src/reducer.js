const defaultState = {
  id: 1,
};

export default function bookmarkReducer(state = defaultState, action) {
  switch (action.type) {
    case 'MOVE':
      return Object.assign({}, state, {id: action.id});
    case 'CHANGESOURCE':
      return {source: action.source, id: 0};
    case 'ADDBOOKMARK':
      return Object.assign({}, state, {isAdding: action.isAdding});
    default:
      return state;
  }
}
