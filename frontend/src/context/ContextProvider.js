//Context provider switches between the looked user and the looked out user (User exist versus not)
import {createContext, useContext, useEffect, useReducer, useRef,} from 'react';
import reducer from './reducer';

//Engine state: Initial state contains all our public values
const initialState = {
    currentUser: null,
    openLogin: false,
    loading: false,
    alert: { open: false, severity: 'info', message: '' },
    profile: { open: false, file: null, photoURL: '' },
    images: [],
    details: { title: '', description: '', price: 0 },
    location: { lng: 0, lat: 0 },
    rooms: [],
    priceFilter: 50,
    addressFilter: null,
    filteredRooms: [],
    room: null,
};

//when initial state is passed
const Context = createContext(initialState);
//Hook to extract the values of the context easily
export const useValue = () => {
    return useContext(Context);
};
//context provider
const ContextProvider = ({ children }) => {
    //extract state and then dispatch from use reducer
    const [state, dispatch] = useReducer(reducer, initialState); //dispatch reducer created and set it to the initial state
    const mapRef = useRef();
    const containerRef = useRef();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            dispatch({ type: 'UPDATE_USER', payload: currentUser });
        }
    }, []);
    return (
        // Current state and the dispatcher of that state inside the values => Reducer
        <Context.Provider value={{ state, dispatch, mapRef, containerRef }}>
            {/*Now all variables inside the state will be available to all components wrapped by this provider*/}
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;