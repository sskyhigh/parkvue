//The reducer is a function that receives the state & action needed to perform on the state
//Need payload when it isn't just a false and true response and many fields need to be filled

const reducer = (state, action) => {
  //Action taken by the current user states
  //2 situation switch toggle : test state type to determine action object
  switch (
  action.type //type = payload
  ) {
    case "START_LOADING":
      return { ...state, loading: true };

    case "END_LOADING":
      return { ...state, loading: false };

    case "UPDATE_ALERT":
      return { ...state, alert: action.payload };

    case "UPDATE_USER": //updates the user with login information
      //retain the same values inside the state => switch account user
      return { ...state, currentUser: action.payload };
    //returns the state by changing the current user to the action to payload sent
    case "UPDATE_IMAGES":
      return { ...state, images: [...state.images, action.payload] };

    case "DELETE_IMAGE":
      return {
        ...state,
        images: state.images.filter((image) => image !== action.payload),
      };

    case "UPDATE_DETAILS":
      return { ...state, details: { ...state.details, ...action.payload } };
    case "UPDATE_LOCATION":
      return { ...state, location: action.payload };

    case "UPDATE_CHAT":
      return { ...state, chat: action.payload };

    default:
      //In case someone misspelled the action or forgets to add it here; throws a new error indicating no action available
      throw new Error("No match action!");
  }
};
export default reducer;
