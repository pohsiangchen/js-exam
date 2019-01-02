const code = (state = { index: 0 }, action) => {
  switch (action.type.toUpperCase()) {
    case 'REACT/CODE/RESET':
      return state;
    case 'REACT/CODE/CHANGE':
      return {
        ...state,
        compiledCode: action.compiledCode || state.compiledCode,
        [state.index]: {
          code: action.rawCode,
        },
      };
    case 'REACT/QUESTION/RESET':
      return {
        ...state,
        compiledCode: '',
        [state.index]: {
          code: '',
        },
      };
    case 'REACT/QUESTION/CHANGE':
      return {
        ...state,
        index: action.index,
        compiledCode: '',
      };
    case 'REACT/QUESTION/REMOTE/CHANGE':
      return {
        ...state,
        index: 0, // remote don't use index
        compiledCode: '',
        remoteQuestion: {
          name: action.name,
          code: action.code,
          test: action.test,
        },
      };
    default:
      return state;
  }
};

export default code;
