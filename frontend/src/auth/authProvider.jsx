import { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const Navigate = useNavigate()

    const loginAction = async (data) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, data)
            .then((res) => {
                localStorage.setItem("authToken", res.data.token)
                toast.success(res.data.message, { position: 'top-right', duration: 5000 });
                Navigate("/dashboard")
            })
            .catch((error) => {

                toast.error(error.response?.data?.message || "Login failed. Please try again", { position: 'top-right', duration: 5000 });
            })
    }

    const [email, setEmail] = useState();
    const [otp, setOTP] = useState();


    return <AuthContext.Provider value={{ loginAction, email, setEmail, setOTP, otp }}>{children}</AuthContext.Provider>

}


const useAuth = () => {

    return useContext(AuthContext)
}

export { useAuth, AuthProvider }
