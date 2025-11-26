import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useAuth } from "./authProvider";
import axios from "axios";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [pass, setPass] = useState();
  const [cpass, setCpass] = useState();
  //const {email,setEmail,setOTP,otp}=useAuth();
  const [email, setEmail] = useState(localStorage.getItem("resetEmail") || "");


  const checkPass = async () => {
    if (pass != cpass) {
      toast.error("Password does not match.....", { position: 'top-right', duration: 5000 })
    }
    else {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/ResetPass`, { email, newPassword: pass })
        .then((res) => {

          toast.success(res.data.message, { position: 'top-right', duration: 5000 })
          localStorage.removeItem("resetEmail")
          navigate("/");

        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "some thing went wrong", { position: 'top-right', duration: 5000 })
        })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-semibold text-center text-yellow-600 mb-4">
          Change Password
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              onChange={(e) => setPass(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter new password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              onChange={(e) => setCpass(e.target.value)}
              required
              className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              className="mr-2 focus:ring-yellow-400"
            />
            <span className="text-sm text-gray-600">
              I accept the <span className="text-yellow-600 underline cursor-pointer">Terms and Conditions</span>
            </span>
          </div>
          <button
            type="submit"
            onClick={(e) => { checkPass(); e.preventDefault() }}
            className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}



export { ForgetPassword }
