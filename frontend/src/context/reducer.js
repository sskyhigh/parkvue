//The reducer is a function that receives the state & action needed to perform on the state


const reducer =(state, action) =>{
    //switch instruction : test the type inside the action object
    switch(action.type) {
        case 'UPDATE_USER': //updates the user
            //retain the same values inside the state => switch account user
            return{ ...state, currentUser: action.payload };
        //returns the state by changing the current user to the action to payload sent

            default:
                //In case someone misspelled the action or forgets to add it here; throws a new error indicating no action available
                throw new Error('No match action!');
    }
};
export default reducer;