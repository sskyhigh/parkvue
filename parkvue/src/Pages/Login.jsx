import React, {useState} from 'react'

export default function Login() {
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const login = async (event) => {
        event.preventDefault();
    }

    return (
        <div>
            <form onSubmit={login}>
                <label htmlFor="">Email: </label>
                <input
                    type="text"
                    placeholder={"something@something.com"}
                    value={data.email}
                    onChange={(event) => setData({...data, email: event.target.value})}
                />
                <label htmlFor="">Email: </label>
                <input
                    type="text"
                    placeholder={"****"}
                    value={data.password}
                    onChange={(event) => setData({...data, password: event.target.value})}
                />
            </form>
        </div>
    )
}
