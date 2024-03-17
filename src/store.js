// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/reducers/authSlice";
import clientDataReducer from "./features/reducers/clientDataSlice"

const store = configureStore({
   reducer: {
      auth: authReducer,
      clientData: clientDataReducer
   }
});

export default store;
