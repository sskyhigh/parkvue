import React, {useState} from 'react'
import '../../src/Components/SignLogin/Design.css'

export default function Register() {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const addUser = async (event) => {
        event.preventDefault();

    }

    return (
        <div className='test'>
            <form onSubmit={addUser}>
                <label htmlFor="">Name: </label>
                <input
                    type="text"
                    placeholder={"name"}
                    value={data.name}
                    onChange={(event) => setData({...data, name: event.target.value})}
                />
                <label htmlFor="">Email: </label>
                <input
                    type="text"
                    placeholder={"email"}
                    value={data.email}
                    onChange={(event) => setData({...data, email: event.target.value})}
                />
                <label htmlFor="">password: </label>
                <input
                    type="text"
                    placeholder={"****"}
                    value={data.password}
                    onChange={(event) => setData({...data, password: event.target.value})}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}