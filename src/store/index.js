import { createStore } from 'redux';

import { updateProfile } from './actions';
import UserProfile from './reducers';

const store = createStore(UserProfile);

export default store;
export {
  updateProfile
}
export { default as AmplifyBridge } from './AmplifyBridge';
