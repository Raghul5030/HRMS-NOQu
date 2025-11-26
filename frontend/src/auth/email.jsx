import { useNavigate } from "react-router-dom"
import { useAuth } from "./authProvider";
import axios from "axios";
import toast from "react-hot-toast"

const EnterEmailPage = () => {

  const { email, setEmail, setOTP, otp } = useAuth();
  const navigate = useNavigate();

  const checkEmail = async () => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/CheckMail`, { recipitent_email: email })
      .then((res) => {
        sendOTP();
        setEmail(email);
        localStorage.setItem("resetEmail", email);
        navigate("/verification");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "some thing went wrong", { position: 'top-right', duration: 4000 })
      })

  }

  const sendOTP = async () => {
    if (email) {
      const OTP = Math.floor(Math.random() * 9000 + 1000); // 4-digit OTP
      setOTP(OTP);
      setEmail(email);

      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/sendOTP`, { OTP, recipitent_email: email });
        toast.success(res.data.message, { position: "top-right", duration: 5000 });
      }

      catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong", { position: "top-right", duration: 5000 });
      }
    }

  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-semibold text-center text-yellow-600 mb-4">
          Enter Email Address
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Please enter your email address to receive an OTP.
        </p>
        <form>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 "
              placeholder="Enter your email"
            />
          </div>
          <button
            onClick={(e) => { checkEmail(); e.preventDefault() }}
            className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export { EnterEmailPage }
