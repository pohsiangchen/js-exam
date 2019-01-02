const code = (state = { index: 0 }, action) => {
  switch (action.type.toUpperCase()) {
    case 'JAVASCRIPT/CODE/RESET':
      return state;
    case 'JAVASCRIPT/CODE/CHANGE':
      return {
        ...state,
        compiledCode: action.compiledCode || state.compiledCode,
        [state.index]: {
          code: action.rawCode,
        },
      };
    case 'JAVASCRIPT/QUESTION/RESET':
      return {
        ...state,
        [state.index]: {
          code: '',
        },
      };
    case 'JAVASCRIPT/QUESTION/CHANGE':
      return {
        ...state,
        index: action.index,
        compiledCode: '',
      };
    case 'JAVASCRIPT/QUESTION/REMOTE/CHANGE':
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
