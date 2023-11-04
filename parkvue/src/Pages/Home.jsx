import {useContext} from 'react';
import {UserContext} from "../context/userContext";

export default function Home(){
    const {user} = useContext(UserContext);
    return(
        <div className="test">
            <h1>Information:</h1>
            {/*{!!user && (<h2>Hello {user.email}</h2>)}*/}
        </div>
    )
}