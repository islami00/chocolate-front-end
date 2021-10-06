import { Struct } from '@polkadot/types';
import React, { useContext, useReducer } from 'react';

const INIT_STATE = {
  userData: {
    name: '',
    accountAddress: '',
    rankPoints: 0,
    userReviews: [],
    /** @type {""|"unset" | "user" |"project"} */
    accountType: '',
  },
};

/**
 * @typedef {[undefined] | [Struct]}  ArrNothingOrStruct
 * @typedef {{
 *    userData:INIT_STATE["userData"]
 * }} AppState
 * @typedef
 * @typedef {{type:"USER_DATA";
 *    payload: Record<string,string|number> | INIT_STATE["userData"];
 * }} action
 * @type {React.Reducer<AppState,action>}
 * @returns
 */
function reducer(state, action) {
  //  mutate the state with action, not directly
  const { payload, type } = action;
  switch (type) {
    case 'USER_DATA':
      // arbitrarily override top-level fields - Update data
      return { ...state, userData: { ...state.userData, ...payload } };
    default:
      throw new Error('no matching action type');
  }
}

/**
 * @typedef {{state: AppState;dispatch : React.Dispatch<action>}} AppCTX
 * @type {React.Context<null | AppCTX>}
 *  */
const AppContext = React.createContext(null);

/** @type {React.FC} */
const AppContextProvider = props => {
  // filtering props and merge with default param value
  const initState = { ...INIT_STATE };
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

const useApp = () => ({ ...useContext(AppContext) });

export { useApp, AppContextProvider };
