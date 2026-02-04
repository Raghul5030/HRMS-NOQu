/*import { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // role state (persisted)
  const [role, setRole] = useState(
    localStorage.getItem("role") || null
  );

  const [email, setEmail] = useState();
  const [otp, setOTP] = useState();

  const loginAction = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        data
      );

      // normalize role
      const normalizedRole = res.data.role.toLowerCase();

      // store auth data
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("role", normalizedRole);

      // update state
      setRole(normalizedRole);

      toast.success(res.data.message, {
        position: "top-right",
        duration: 5000,
      });

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please try again",
        {
          position: "top-right",
          duration: 5000,
        }
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loginAction,
        role,
        email,
        setEmail,
        otp,
        setOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { useAuth, AuthProvider };*/

import { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // role state (persisted)
  const [role, setRole] = useState(
    localStorage.getItem("role") || null
  );

  const [email, setEmail] = useState();
  const [otp, setOTP] = useState();

  const loginAction = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        data
      );

      // normalize role (e.g., "IT_SUPPORT" becomes "it_support")
      const normalizedRole = res.data.role.toLowerCase();

      // store auth data
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("role", normalizedRole);
      localStorage.setItem("employee_id", res.data.employee_id || "");

      // update state
      setRole(normalizedRole);

      toast.success(res.data.message, {
        position: "top-right",
        duration: 5000,
      });

      // --- ROLE-BASED NAVIGATION ---
      if (normalizedRole === "it_support") {
        navigate("/it-dashboard");
      } else if (normalizedRole === "employee") {
        navigate("/asset");
      } else {
        // This covers "hr" or any other admin roles
        navigate("/dashboard");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Login failed. Please try again",
        {
          position: "top-right",
          duration: 5000,
        }
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loginAction,
        role,
        email,
        setEmail,
        otp,
        setOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { useAuth, AuthProvider };
