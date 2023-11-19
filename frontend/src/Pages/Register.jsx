import React, {useState} from 'react'
import '../Components/Login_Sign_out/Design.css'
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const addUser = async (event) => {
        event.preventDefault();
        const {name, email, password} = data;
        try {
            const {data} = await axios.post("/register", {
                name,
                email,
                password,
            })
            if (data.error) {
                toast.error(data.error)
            } else {
                // resetting the input fields
                setData({})
                toast.success('Login successful')
                navigate('/home')
            }
        } catch (e) {
            console.error('register has an error: ' + e)
            toast.error("there is an error: " + e)
        }
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
                <br/>
                <label htmlFor="">Email: </label>
                <input
                    type="text"
                    placeholder={"email"}
                    value={data.email}
                    onChange={(event) => setData({...data, email: event.target.value})}
                />
                <br/>
                <label htmlFor="">password: </label>
                <input
                    type="password"
                    placeholder={"****"}
                    value={data.password}
                    onChange={(event) => setData({...data, password: event.target.value})}
                />
                <br/>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}