import {useContext} from 'react';
import {UserContext} from "../context/userContext";
import axios from "axios";

export default function Home(){
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    })

    const { user } = useContext(UserContext);
    return(
        <div className="test">
            <h1>Information:</h1>
            {/*Not sure why user does not show*/}
            {!!user && <h2>Hello {user.name}</h2>}
        </div>
    )
}