const code = (state = { index: 0 }, action) => {
  switch (action.type.toUpperCase()) {
    case 'CODE_RESET':
      return state;
    case 'CODE_CHANGE':
      return {
        ...state,
        compiledCode: action.compiledCode || state.compiledCode,
        code: action.rawCode,
      };
    default:
      return state;
  }
};

export default code;
