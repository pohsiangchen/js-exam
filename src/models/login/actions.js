export function submitPassword(password) {
  return {
    type: 'LOGIN/LOGIN',
    password,
  };
}
