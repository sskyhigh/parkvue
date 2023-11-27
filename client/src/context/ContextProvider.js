//Context provider switches between the looked user and the looked out user (User exist versus not)
import {createContext, useContext, useReducer } from 'react';
import reducer from './reducer';

//Engine state: Initial state contains all our public values
const initialState = {
    currentUser: null,
    openLogin: false,
    alert: {open:false, severity:'info', message:' '},
};

//when initial state is passed
const Context = createContext(initialState); //Hook to extract the values of the context easily

export const useValue = () => {
    return useContext(Context);
};

//context provider
const ContextProvider = ({ children }) => { //extract state and then dispatch from use reducer
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        // Current state and the dispatcher of that state inside the values => Reducer
         <Context.Provider value = {{state, dispatch}}
         >
            {/*Now all variables inside the state will be available to all components wrapped by this provider*/}
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;