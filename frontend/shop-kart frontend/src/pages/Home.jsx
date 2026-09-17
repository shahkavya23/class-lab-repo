
import {useAuth} from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function Home() {

    const {user , setUser} = useAuth()
    const navigate = useNavigate()

    if(!user){
        return <h2>Loading profile...</h2>
    }


    const handleLogout = async () => {
        try{
            await axios.post("http://localhost:8082/customers/logout" , {} , { withCredentials: true })
            setUser(null)
            navigate("/login")
        }
        catch(error){
            console.log("Logout Failed" , error)
        }
    }


    return(
        <div>
            <h1>Welcome , {user.fullName}!</h1>
            <p>Email of User is : {user.email}</p>
            <p>User's Phone Number : {user.phone}</p>
            <button onClick = {handleLogout}>Logout</button>
        </div>
    )
}