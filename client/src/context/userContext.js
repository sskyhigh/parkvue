import {createContext, useState, useEffect} from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    })

    /* setting null, assuming nobody is logged in */
    const [user, setUser] = useState(null)
    useEffect(() => {
        if (!user) {
            axios.get('/profile')
                .then(({data}) => {
                    setUser(data)
                })
        }
    }, [])

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}