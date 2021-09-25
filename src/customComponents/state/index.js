import React, { useContext, useReducer, useEffect } from 'react';
import { useSubstrate } from '../../substrate-lib';
const AppContext = React.createContext();
const INIT_STATE = {
  projects: [],
  reviews: [],
  council: [],
  userData: { name: '', accountAddress: '', rankPoints: 0, userReviews: [] },
};

function reducer(state, action) {
  //  mutate the state with action, not directly
  const { payload, type } = action;
  switch (type) {
    case 'PROJECTS':
      return { ...state, projects: state.projects.concat(payload) };
    case 'REVIEWS':
      return { ...state, reviews: state.reviews.concat(payload) };
    case 'COUNCIL':
      return { ...state, council: state.council.concat(payload) };
    case 'USER_DATA':
      //arbitrarily override top-level fields
      return { ...state, userData: { ...state.userData, ...payload } };
    default:
      throw new Error('no matching action type');
  }
}

const AppContextProvider = (props) => {
  // filtering props and merge with default param value
  const initState = { ...INIT_STATE };

  const [state, dispatch] = useReducer(reducer, initState);

  return <AppContext.Provider value={{ state, dispatch }}>{props.children}</AppContext.Provider>;
};

const useApp = () => ({ ...useContext(AppContext) });
export { useApp, AppContextProvider };
