import React, {useState} from 'react'
import '../../src/Components/SignLogin/Design.css'
export default function Login() {
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const login = async (event) => {
        event.preventDefault();
    }

    return (
        <div className="test">
            <form onSubmit={login}>
                <label htmlFor="">Email: </label>
                <input
                    type="text"
                    placeholder={"email@email.com"}
                    value={data.email}
                    onChange={(event) => setData({...data, email: event.target.value})}
                />
                <br/>
                <label htmlFor="">Password: </label>
                <input
                    type="text"
                    placeholder={"****"}
                    value={data.password}
                    onChange={(event) => setData({...data, password: event.target.value})}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
