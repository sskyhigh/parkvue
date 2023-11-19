import React, {useState} from 'react'
import '../Components/Login_Sign_out/Design.css'
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const login = async (event) => {
        event.preventDefault();
        const {email, password} = data;
        try {
            const {data} = await axios.post('/login', {
                email,
                password,
            })
            if (data.error) {
                toast.error(data.error)
            } else {
                setData({});
                navigate('/home')
            }
        } catch (e) {
            console.error("login error: " + e)
        }
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
                    type="password"
                    placeholder={"****"}
                    value={data.password}
                    onChange={(event) => setData({...data, password: event.target.value})}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
