//The reducer is a function that receives the state & action needed to perform on the state
//Need payload when it isn't just a false and true response and many fields need to be filled

const reducer =(state, action) =>{ //Action taken by the current user states
    //2 situation switch toggle : test state type to determine action object
    switch(action.type) { //type = payload
        case 'OPEN_LOGIN': //login True
            return{ ...state, openLogin:true };

        case 'CLOSE_LOGIN': //login False
            return{ ...state, loading:false };

        case 'START_LOADING':
            return{ ...state, loading:true };

        case 'END_LOADING':
            return{ ...state, loading:false };

        case 'UPDATE_ALERT':
            return {...state, alert: action.payload};

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