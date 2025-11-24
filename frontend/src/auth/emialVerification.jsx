import { useNavigate } from "react-router-dom";
import { useAuth } from "./authProvider";
import { useState,useEffect } from "react";
import toast from "react-hot-toast"
import axios from "axios";

const EmailVerificationPage = () => {
  const { email, setEmail, setOTP, otp } = useAuth();
  const [OTPinput, setOTPinput] = useState([0, 0, 0, 0]);
  const [timeCount,setTimer]=useState(30);
  const [disable,setDisable]=useState(true)

  const navigate = useNavigate();

  const verifyOTP=()=>{
    if(parseInt(OTPinput.join(""))===otp)
    {
      toast.success("OTP verified successfully...",{position:'top-right',duration: 4000})
      navigate("/forgetPassword")
    }
    else
    {
      toast.error("Invalid OTP...",{position:'top-right',duration: 4000})
    }
  }

  const sendOTP=async()=>{
    try {
      const res = await axios.post("http://localhost:3000/sendOTP", {OTP:otp,recipitent_email:email});
      toast.success(res.data.message, { position: "top-right", duration: 5000 });
       setTimer(60);
       setDisable(true);
    } 
   
    catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong",{ position: "top-right", duration: 5000 });
    }
  }

  useEffect(() => {
    let interval;
    if (disable) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setDisable(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [disable]);


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-semibold text-center text-yellow-600 mb-4">
          Email Verification
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4 ">
          We have sent a code to your email <span className="font-medium">{localStorage.getItem("resetEmail")}<button onClick={()=>{navigate("/Email")}} class='text-yellow-400 cursor-pointer pl-2'>✏️</button></span>
        </p>
        <div className="flex justify-center gap-2 mb-6">
          <input
            type="text"
            maxLength="1"
            className="border border-gray-300 text-center w-12 h-12 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={(e)=>{
              setOTPinput([
                e.target.value,
                OTPinput[1],
                OTPinput[2],
                OTPinput[3]
              ])
            }}
          />
          <input
            type="text"
            maxLength="1"
            className="border border-gray-300 text-center w-12 h-12 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={(e)=>{
              setOTPinput([
                OTPinput[0],
                e.target.value,
                OTPinput[2],
                OTPinput[3]
              ])
            }}
          />
          <input
            type="text"
            maxLength="1"
            className="border border-gray-300 text-center w-12 h-12 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={(e)=>{
              setOTPinput([
                OTPinput[0],
                OTPinput[1],
                e.target.value,
                OTPinput[3]
              ])
            }}
          />
          <input
            type="text"
            maxLength="1"
            className="border border-gray-300 text-center w-12 h-12 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
             onChange={(e)=>{
              setOTPinput([
                OTPinput[0],
                OTPinput[1],
                OTPinput[2],
                e.target.value
              ])
            }}
          />
        </div>
        <button
          onClick={()=>verifyOTP()}
          className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Verify Account
        </button>
        <p className="text-sm text-center text-gray-600 mt-4">
          Didn’t receive a code?{" "}
          <button
            onClick={disable ? null : sendOTP}
            className={`${disable ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer underline text-yellow-400'}`}>
            {disable ? `Resend OTP in ${timeCount}s` : 'Resend OTP'}
          </button>

        </p>
      </div>
    </div>
  );
};

export { EmailVerificationPage };
