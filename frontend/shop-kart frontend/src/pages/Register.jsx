import { useState } from 'react'
import axios from "axios"
import {useNavigate} from "react-router-dom"

export default function Register() {


  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post("http://localhost:8082/customers/register" , {
                fullName : fullName,
                email : email,
                password : password,
                phone : phone }, {
                    withCredentials : true
                }
            )

            console.log(response.data)
            alert("Registration Successful!")
            navigate("/login")
        }
        catch(error){
            console.log(error)
            alert("Registeration Failed . Check the console")
        }
    }


    return (
        <div>
            <h2>Register</h2>
            <label>Email</label>
            <input 
            type = "email" 
            placeholder = "Enter Email"
            value = {email}
            onChange = {(e) => setEmail(e.target.value)}
            /> 
            <label>FullName</label>
            <input
                placeholder="Enter your name"
                value = {fullName}
                onChange={(e) => setFullName(e.target.value)}
            />
            <input
                type = "password"
                placeholder="Enter your password"
                value = {password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type = "phone"
                placeholder = "Enter you phone number"
                value = {phone}
                onChange = {(e) => setPhone(e.target.value)} 
            />
            <button onClick = {handleSubmit}>Create Account</button>
        </div>
    )
}