import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import axios from "axios"

export default function Login() {

  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        "http://localhost:8082/customers/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      )

      console.log(response.data)
      alert("Login Successful")
      navigate("/home")
    } catch (err) {
      console.log(err)
      alert("Login Failed")
    }
  }

  return (
    <div>
      <label>Email</label>
      <input 
          type = "email"
          value = {email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder = "Enter email"
        />
        <label>Password</label>
        <input  
            type = "password"
            value = {password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder = "Enter the password"
            />

          <button  
          onClick = {handleSubmit}
          >Submit</button>
          
    </div>
  )


  
}