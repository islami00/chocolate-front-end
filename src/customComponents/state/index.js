import React, { useContext, useReducer } from 'react';

const AppContext = React.createContext();
const Motion = { for: '', ayes: '', nays: '' };
const INIT_STATE = {
  projects: [],
  reviews: [],
  council: [],
  proposals: [],
  motions: [Motion],
  userData: { name: '', accountAddress: '', rankPoints: 0, userReviews: [] },
};

function reducer(state, action) {
  //  mutate the state with action, not directly
  const { payload, type } = action;
  switch (type) {
    case 'NEW_PROJECT':
      return { ...state, projects: state.projects.concat(payload) };
    case 'NEW_REVIEW':
      return { ...state, reviews: state.reviews.concat(payload) };
    case 'NEW_COUNCIL':
      return { ...state, council: state.council.concat(payload) };
    case 'USER_DATA':
      // arbitrarily override top-level fields - Update data
      return { ...state, userData: { ...state.userData, ...payload } };
    case 'NEW_MOTION':
      return { ...state, motions: state.motions.concat(payload) };
    case 'UPDATE_MOTION':
      // payload with new modified array
      return { ...state, motions: [...payload] };
    case 'UPDATE_REVIEW':
      // payload with new modified array
      return { ...state, reviews: [...payload] };
    case 'UPDATE_COUNCIL':
      // payload with new modified array
      return { ...state, council: [...payload] };
    case 'UPDATE_PROJECT':
      // payload with new modified array
      return { ...state, projects: [...payload] };
    default:
      throw new Error('no matching action type');
  }
}

const AppContextProvider = props => {
  // filtering props and merge with default param value
  const initState = { ...INIT_STATE };
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

const useApp = () => ({ ...useContext(AppContext) });

export { useApp, AppContextProvider };
