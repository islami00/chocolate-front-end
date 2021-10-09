import { Struct, U32 } from '@polkadot/types';
import { ReviewAl } from 'chocolate/interfaces';
import React, { useContext, useReducer } from 'react';
/**
 * @type {{userData:{
 * name: string;
 * accountAddress: string;
 * rankPoints: U32 | 0 |string;
 * userReviews:[ReviewAl?];
 * accountType:""|"unset" | "user" |"project";
 * }}}
 */
const INIT_STATE = {
  userData: {
    name: '',
    accountAddress: '',
    rankPoints: 0,
    userReviews: [],
    accountType: '',
  },
};

/**
 * @typedef {[undefined] | [Struct]}  ArrNothingOrStruct
 * @typedef {{
 *    userData:typeof INIT_STATE["userData"]
 * }} AppState
 * @typedef {{type:"USER_DATA";
 *    payload:  Partial<typeof INIT_STATE["userData"]>;
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
 * @type {React.Context<AppCTX>}
 *  */
// @ts-expect-error
const AppContext = React.createContext();

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
