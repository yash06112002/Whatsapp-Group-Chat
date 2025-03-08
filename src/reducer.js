export const initialState = {
    user: null,
}
export const actionTypes = {
  SET_USER: "SET_USER",
  SET_GUEST_USER: "SET_GUEST_USER",
};

const reducer = (state, action) => {
    switch (action.type) {
      case actionTypes.SET_USER:
      case actionTypes.SET_GUEST_USER:
        return {
          ...state,
          user: action.user,
        };
      default:
        return state;
    }
};

export default reducer;