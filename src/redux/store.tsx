import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/token';
import clientIdSlice from './features/addClientId';
import userSlice from './features/user';
import toastSlice from './features/toast';
import rolesSlice from './features/role';
import permissionSlice from './features/permission';

const store = configureStore({
  reducer: {
    token: authReducer,
    clientId: clientIdSlice,
    user: userSlice,
    toast: toastSlice,
    roles: rolesSlice,
    permission: permissionSlice,
  },
})
export default store;