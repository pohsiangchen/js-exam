export function resetConsole() {
  return {
    type: 'CONSOLE/RESET',
  };
}

export function addConsole(key, ...args) {
  return {
    type: 'CONSOLE/ADD',
    key,
    args: [...args],
  };
}
