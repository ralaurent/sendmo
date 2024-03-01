import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import txsReducer from "./transaction";
import rxsReducer from "./request";
import usersReducer from "./users";
import paymentMethodsReducer from "./payment";

const rootReducer = combineReducers({
  session: sessionReducer,
  txs: txsReducer,
  rxs: rxsReducer,
  users: usersReducer,
  paymentMethods: paymentMethodsReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
