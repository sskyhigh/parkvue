//The reducer is a function that receives the state & action needed to perform on the state
const reducer =(state, action) =>{
    //2 situation switch toggle : test state type to determine action object
    switch(action.type) { //type = payload
        case 'OPEN_LOGIN': //login True
            return{ ...state, openLogin:true };

        case 'CLOSE_LOGIN': //login False
            return{ ...state, openLogin:false };


        case 'UPDATE_USER': //updates the user with login information
            //retain the same values inside the state => switch account user
            return{ ...state, currentUser: action.payload };
            //returns the state by changing the current user to the action to payload sent

            default:
                //In case someone misspelled the action or forgets to add it here; throws a new error indicating no action available
                throw new Error('No match action!');
    }
};
export default reducer;