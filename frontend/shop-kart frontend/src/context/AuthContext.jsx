import { createContext , useContext , useState , useEffect} from "react";
import axios from "axios"


const AuthContext = createContext()


export const AuthProvider = ({children}) => {

    const [user , setUser] = useState(null)

    const [loading , setLoading] = useState(true)


    useEffect (() => {

        const checkLoggedIn = async () => {
            try{
                const response = await axios.get("http://localhost:8082/customers/me" , { withCredentials: true })

                setUser(response.data)
            }
            catch(error){
                setUser(null)
            }
            finally{
                setLoading(false)
            }
        }

        checkLoggedIn()


    },[])



    return (
        <AuthContext.Provider value = {{user , loading , setUser}}>
            {children}
        </AuthContext.Provider>
    )


}


export const useAuth = () => {
    return useContext(AuthContext)//Build to laziness of everytime doing useContext(AuthContext)
}







