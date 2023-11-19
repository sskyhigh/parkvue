import {useContext} from 'react';
import {UserContext} from "../context/userContext";

export default function Home(){
    const { user } = useContext(UserContext);
    return(
        <div className="test">
            <h1>Information:</h1>
            {/*Not sure why user does not show*/}
            {!!user && <h2>Hello {user.name}</h2>}
        </div>
    )
}