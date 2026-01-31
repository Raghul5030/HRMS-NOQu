import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../auth/authProvider";
import logo from "../assets/logo.png";
import Admin_dashboard from "../assets/Admin_dashboard.svg";
import "./AdminLayout.css";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { role } = useAuth(); // 🔑 role from auth context

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
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
          {/* IT SUPPORT ONLY */}
          {role === "it_support" && (
            <>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? "nav-link active-link" : "nav-link"
                  }
                >
                  <img src={Admin_dashboard} width={15} style={{ marginRight: 8 }} />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/asset"
                  className={({ isActive }) =>
                    isActive ? "nav-link active-link" : "nav-link"
                  }
                >
                  <img src={Admin_dashboard} width={15} style={{ marginRight: 8 }} />
                  Assets
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/it-dashboard" // Linking Status to IT Dashboard (defects view)
                  className={({ isActive }) =>
                    isActive ? "nav-link active-link" : "nav-link"
                  }
                >
                  <img src={Admin_dashboard} width={15} style={{ marginRight: 8 }} />
                  Status
                </NavLink>
              </li>
            </>
          )}

          {/* OTHER ROLES (HR, Employee, etc...) */}
          {role !== "it_support" && (
            <>
              {/* Dashboard → ALL ROLES EXCEPT IT */}
              <li>
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    isActive ? "nav-link active-link" : "nav-link"
                  }
                >
                  <img src={Admin_dashboard} width={15} style={{ marginRight: 8 }} />
                  Dashboard
                </NavLink>
              </li>

              {/* HR ONLY */}
              {role === "hr" && (
                <>
                  <li>
                    <NavLink to="/interview" className="nav-link">
                      <img src={Admin_dashboard} width={15} style={{ marginRight: 8 }} />
                      Interview
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/onboarding" className="nav-link">
                      <img src={Admin_dashboard} width={15} style={{ marginRight: 8 }} />
                      Onboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/documents" className="nav-link">
                      <img src={Admin_dashboard} width={15} style={{ marginRight: 8 }} />
                      Documents
                    </NavLink>
                  </li>
                </>
              )}

              {/* HR + EMPLOYEE */}
              {(role === "hr" || role === "employee") && (
                <li>
                  <NavLink to="/employees" className="nav-link">
                    <img src={Admin_dashboard} width={15} style={{ marginRight: 8 }} />
                    Employee
                  </NavLink>
                </li>
              )}

              {/* ALL ROLES EXCEPT IT (IT has its own Asset link above to maintain order if desired, or we can reuse this one. 
                  Refactoring to keep 'Asset' distinct if needed, but for now blocking it here to avoid duplication if we want custom order for IT) 
                  Actually, the user wants 'Dashboard, Assets, Status'. 
                  If I include 'Asset' in the general list below, it appears at the bottom. 
                  If I want specific order for IT, I should exclude IT from the general list below.
              */}
              <li>
                <NavLink to="/asset" className="nav-link">
                  <img src={Admin_dashboard} width={15} style={{ marginRight: 8 }} />
                  Assets
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Logout */}
      <div style={{ marginTop: "auto", padding: "20px" }}>
        <div
          className="flex items-center gap-2 bg-gray-50 hover:bg-gray-200 text-gray-600 pl-2 py-2 rounded-xl cursor-pointer"
          onClick={logout}
        >
          <span className="text-md font-medium pl-2">
            ⍈ Logout
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
