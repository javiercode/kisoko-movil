// import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import AuthReducer from "./login/reducer";
import MovReducer from "./movimiento/reducer";

// import AuthReducer from "./login/reducer";
// import { composeWithDevTools } from "redux-devtools-extension"

const rootReducer = combineReducers({ 
  AuthReducer: AuthReducer,
  MovReducer: MovReducer,
  // stateReconciler: hardSet
})


export const store = configureStore({
  reducer: rootReducer,
})

// const RootReducers = combineReducers({
//   AuthReducer,
// });

// export const store = createStore(
//   RootReducers,
//     applyMiddleware(thunk)
// );