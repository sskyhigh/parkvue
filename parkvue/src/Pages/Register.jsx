import React, {useState} from 'react'
import '../../src/Components/SignLogin/Design.css'

export default function Register() {
    const [data, setData] = useState({
        name:  "",
        email: "",
        password: "",
    })

    const addUser = async (event) =>{
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
                    onChange={(event)=>setData({...data, name: event.target.value})}
                />
                <label htmlFor="">email: </label>
                <input type="text" placeholder={"email"}/>
                <label htmlFor="">password: </label>
                <input type="text" placeholder={"password"}/>
            </form>
        </div>
    )
}