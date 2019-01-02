const tab = (
  state = { key: window.location.pathname.split('/')[2] || 'join' },
  action,
) => {
  switch (action.type) {
    case 'TAB/CHANGE':
      return {
        ...state,
        key: action.key,
      };
    default:
      return state;
  }
};

export default tab;
