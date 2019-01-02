const initialState = {
  loading: false,
  list: [],
  type: '',
  name: '',
  content: '',
  test: '',
  tags: [],
};

const question = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_QUESTION_STARTED':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_QUESTION_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        list: action.payload.result,
        type: action.payload.type,
      };
    case 'FETCH_QUESTION_SUCCESS':
      return {
        ...state,
        loading: false,
        name: action.payload.result.name,
        content: action.payload.result.content,
        test: action.payload.result.test,
        tags: action.payload.result.tags,
      };
    case 'FETCH_QUESTION_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

export default question;
