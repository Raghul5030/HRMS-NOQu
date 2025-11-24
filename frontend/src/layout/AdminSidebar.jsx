import { useNavigate, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import Admin_dashboard from "../assets/Admin_dashboard.svg";
import LogoutIcon from "../assets/logout.png";
import "./AdminLayout.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="admin_menu"
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <div>
          <div className="admin_menu_head">
            <div className="admin_menu_head-img">
              <img src={logo} alt="Logo" />
            </div>
            <h5>NoQu HRMS</h5>
          </div>

          <ul className="admin_menu_list">
            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <img
                  src={Admin_dashboard}
                  width={15}
                  style={{ marginRight: 8 }}
                />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/interview"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <img
                  src={Admin_dashboard}
                  width={15}
                  style={{ marginRight: 8 }}
                />
                Interview
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/onboarding"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <img
                  src={Admin_dashboard}
                  width={15}
                  style={{ marginRight: 8 }}
                />
                Onboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/employees"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <img
                  src={Admin_dashboard}
                  width={15}
                  style={{ marginRight: 8 }}
                />
                Employee
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/documents"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <img
                  src={Admin_dashboard}
                  width={15}
                  style={{ marginRight: 8 }}
                />
                Documents
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/asset"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                <img
                  src={Admin_dashboard}
                  width={15}
                  style={{ marginRight: 8 }}
                />
                Assets
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Logout button at the bottom */}
        <div style={{ marginTop: "auto", padding: "20px" }}>
          <div
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-200 text-gray-600 hover:text-gary-600 pl-2  py-2 rounded-xl cursor-pointer transition-all duration-200"
            onClick={() => {
              navigate("/");
              localStorage.removeItem("authToken");
            }}
          >
            <span className="text-md font-medium pl-2 hover:text-black">
              <span class="pr-3 font-bold hover:font-extrabold">⍈</span> Logout
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
