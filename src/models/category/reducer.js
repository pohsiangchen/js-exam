import { CHANGE_CATEGORY, RESET_CATEGORY } from './constants';

const initialState = {
  index: 0,
};

function category(state = initialState, action) {
  switch (action.type) {
    case RESET_CATEGORY:
      return { index: 0 };
    case CHANGE_CATEGORY:
      return {
        ...state,
        index: action.index,
      };
    default:
      return state;
  }
}

export default category;
