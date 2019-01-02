import { action } from 'utils/actionsHelper';
import { CHANGE_CATEGORY, RESET_CATEGORY } from './constants';

export function changeCategory(index) {
  return action(CHANGE_CATEGORY, { index });
}

export function resetCategory() {
  return action(RESET_CATEGORY);
}
