const initialState = {
  loading: false,
  id: '',
  syncCode: '',
  timeBegin: null,
  timeEnd: null,
  history: [],
  ques: null,
};

const record = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_RECORD_STARTED':
    case 'UPDATE_RECORD_STARTED':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_RECORD_SUCCESS':
    case 'UPDATE_RECORD_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        id: action.payload.result.id,
        syncCode: action.payload.result.syncCode,
        timeBegin: action.payload.result.timeBegin,
        ques: action.payload.result.ques,
      };
    case 'CREATE_RECORD_FAILURE':
    case 'UPDATE_RECORD_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case 'SET_CURRENT_RECORD': // set current record from room
      return {
        ...state,
        id: action.payload.id,
        syncCode: action.payload.syncCode,
        timeBegin: action.payload.timeBegin,
        ques: action.payload.ques,
      };
    case 'RESET_CURRENT_RECORD': // set current record from room
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};

export default record;
