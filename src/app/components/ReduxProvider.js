// This is a Client Component that wraps the children components with the Provider 
// to give them access to the Redux store.

"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";

const ReduxProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;