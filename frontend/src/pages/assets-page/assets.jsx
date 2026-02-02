import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Asset = () => {
  const [user, setuser] = useState([]);
  const [openPopup1, setOpenPopup1] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("NAME");

  // ... (keeping existing imports and state)

  // REPORT DEFECT MODAL
  const ReportPopup = ({ user, onClose }) => {
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/report-defect`, {
          employee_id: user.EMPLOYEE_ID,
          asset_name: user.NAME || 'General Asset', // Using user name or asset identifier if available. Ideally should be Asset ID/Name but table structure uses Employee row as Asset row.
          defect_description: description
        });
        toast.success("Defect reported successfully!");
        onClose();
      } catch (error) {
        toast.error("Failed to report defect");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-[500px] p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Report Issue / Defect</h2>
          <p className="text-sm text-gray-600 mb-4">
            Reporting issue for asset assigned to: <strong>{user.EMPLOYEE_ID}</strong>
          </p>
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              rows="4"
              placeholder="Describe the issue with the asset (e.g., Laptop not charging, Screen broken)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const [openReportPopup, setOpenReportPopup] = useState(false);
  const [reportUser, setReportUser] = useState(null);

  // AUTH Context (Assuming useAuth is available or localStorage)
  const role = localStorage.getItem("role");
  const current_employee_id = localStorage.getItem("employee_id"); // Or however it's stored

  const getDetials = async () => {
    let url = `${import.meta.env.VITE_API_URL}/getAssets`;

    // If Employee, filter by their ID
    if (role === 'employee' || role === 'Employee') { // Handling potential case variations
      url += `?employee_id=${current_employee_id}`;
    }

    const res = await axios.get(url);
    setuser(res.data);
  };

  useEffect(() => {
    getDetials();
  }, []);

  const Popup1 = ({ user }) => {
    const tempalete = {
      EMPLOYEE_ID: user.EMPLOYEE_ID || "",
      PERFORMANCE_KEY: user.PERFORMANCE_KEY || "",
      NAME: user.NAME || "",
      DESIGNATION: user.DESIGNATION || "",
      DEPARTMENT: user.DEPARTMENT || "",
      LOCATION: user.LOCATION || "",

      LAPTOP_STATUS: !!user.LAPTOP_STATUS,
      LAPTOP_BRAND: user.LAPTOP_BRAND || "",
      LAPTOP_MODEL: user.LAPTOP_MODEL || "",
      LAPTOP_SERIAL_NUMBER: user.LAPTOP_SERIAL_NUMBER || "",
      LAPTOP_CHARGER: user.LAPTOP_CHARGER || "",
      MOUSE: user.MOUSE || "",

      MOBILE_STATUS: !!user.MOBILE_STATUS,
      MOBILE_BRAND: user.MOBILE_BRAND || "",
      MOBILE_MODEL: user.MOBILE_MODEL || "",
      MOBILE_IMEI_NUMBER1: user.MOBILE_IMEI_NUMBER1 || "",
      MOBILE_IMEI_NUMBER2: user.MOBILE_IMEI_NUMBER2 || "",
      MOBILE_CHARGER: user.MOBILE_CHARGER || "",

      CUG_NUMBER: user.CUG_NUMBER || "",
      HEADSET_STATUS: !!user.HEADSET_STATUS,
      HEADSET: user.HEADSET || "",
    };

    const [formData, setFormData] = useState(tempalete);

    const toBoolean = (value) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "string") return value.toLowerCase() === "true";
      return false;
    };

    // Then use it like:

    const handleChange = (a) => {
      const { name, value } = a.target;
      setFormData({ ...formData, [name]: value });
    };

    const submitHandaler = async (req, res) => {
      await axios
        .post(`${import.meta.env.VITE_API_URL}/UpdateAsset`, formData)

        .then((res) => {
          toast.success(res.data.message, {
            position: "top-right",
            duration: 5000,
          });
          getDetials();
          setOpenPopup1(false);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "some thing went wrong",
            { position: "top-right", duration: 5000 }
          );
        });
    };

    // RESTORED: Pagination and Filtering Logic
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(7);

    const filteredUsers = Array.isArray(user) ? user.filter((x) => {
      return search === ""
        ? x
        : x[filter]
          ?.toLowerCase()
          .replace(/\s/g, "")
          .includes(search.toLowerCase().replace(/\s/g, ""));
    }) : [];

    const lastItemIndex = currentPage * itemPerPage;
    const firstItemIndex = lastItemIndex - itemPerPage;
    const thisPageItems = filteredUsers.slice(firstItemIndex, lastItemIndex);

    const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
      const getPageNumbers = () => {
        const pageNumbers = [];

        if (totalPages <= 7) {
          for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
          }
        } else {
          if (currentPage <= 4) {
            pageNumbers.push(1, 2, 3, 4, 5, "...", totalPages);
          } else if (currentPage > totalPages - 4) {
            pageNumbers.push(
              1,
              "...",
              totalPages - 4,
              totalPages - 3,
              totalPages - 2,
              totalPages - 1,
              totalPages
            );
          } else {
            pageNumbers.push(
              1,
              "...",
              currentPage - 1,
              currentPage,
              currentPage + 1,
              "...",
              totalPages
            );
          }
        }

        return pageNumbers;
      };

      return (
        <div className="flex justify-center mt-6 space-x-2">
          {/* Prev Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="px-2 py-1 border text-sm hover:bg-gray-100 rounded border-gray-500"
          >
            ᐊ
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              disabled={page === "..."}
              className={`px-2.5 py-1 border text-sm ${currentPage === page
                ? "bg-yellow-500 text-white border-yellow-500 rounded "
                : "text-gray-700 hover:bg-yellow-100 rounded border-gray-600"
                } ${page === "..." ? "cursor-default text-gray-400" : ""}`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            className="px-2 py-1 border border-gray-600 text-sm hover:bg-gray-100 rounded"
          >
            ᐅ
          </button>
        </div>
      );
    };

    const handleStatus = async (EMPLOYEE_ID) => {
      if (!EMPLOYEE_ID) {
        toast.error("Missing or invalid EMPLOYEE_ID or status value");
        return;
      }

      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/udassets`, {
          EMPLOYEE_ID,
        });

        if (res.data.message) {
          toast.success(res.data.message);
        } else {
          toast.error("Unexpected response");
        }

        // Optional: Refresh employee list
        // await getEmployeeList();
      } catch (error) {
        console.error("Failed to update asset status:", error);
        toast.error("Asset status update failed");
      }
    };

    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex justify-center items-center ">
        <div className="bg-white rounded-lg shadow-xl w-[700px] p-9 overflow-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-800">Assets Details</h2>
            <button
              onClick={() => setOpenPopup1(false)}
              className="text-blue-700 hover:bg-green-50"
            >
              ❎
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevents the default form submit (page reload)
              submitHandaler();
            }}
          >
            {/* Section 2: User Details */}
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 pt-8">
                1. Employee Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <label>
                  Performance Key
                  <input
                    name="PERFORMANCE_KEY"
                    value={formData.PERFORMANCE_KEY}
                    readOnly
                    className="border mt-2 p-2 rounded w-full  bg-gray-100 cursor-not-allowed"
                  />
                </label>
                <label>
                  Employee ID
                  <input
                    name="EMPLOYEE_ID"
                    value={formData.EMPLOYEE_ID}
                    readOnly
                    className="border mt-2 p-2 rounded w-full bg-gray-100 cursor-not-allowed"
                  />
                </label>
                <label>
                  Name
                  <input
                    name="NAME"
                    value={formData.NAME}
                    readOnly
                    className="border p-2 mt-2 rounded w-full bg-gray-100 cursor-not-allowed"
                  />
                </label>
                <label>
                  Designation
                  <input
                    name="DESIGNATION"
                    value={formData.DESIGNATION}
                    readOnly
                    className="border mt-2 p-2 rounded w-full bg-gray-100 cursor-not-allowed"
                  />
                </label>
                <label>
                  Department
                  <input
                    name="DEPARTMENT"
                    value={formData.DEPARTMENT}
                    readOnly
                    className="border mt-2 p-2 rounded w-full bg-gray-100 cursor-not-allowed"
                  />
                </label>
                <label>
                  Location
                  <input
                    name="LOCATION"
                    value={formData.LOCATION}
                    readOnly
                    className="border mt-2 p-2 rounded w-full bg-gray-100 cursor-not-allowed"
                  />
                </label>
              </div>
            </div>

            {/* === LAPTOP SECTION === */}
            <h3 className="text-lg font-semibold text-yellow-500 mt-9 mb-5">
              2. Laptop
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.LAPTOP_STATUS}
                  onChange={() => {
                    const updatedStatus = !formData.LAPTOP_STATUS;
                    setFormData({ ...formData, LAPTOP_STATUS: updatedStatus });
                  }}
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>
                <div className="absolute left-[3px] top-[3px] w-3.5 h-3.5 bg-white rounded-full peer-checked:translate-x-5 transform transition-all duration-300"></div>
              </label>
              <span
                className={`text-sm font-semibold ${formData.LAPTOP_STATUS ? "text-blue-600" : "text-gray-400"
                  }`}
              >
                {formData.LAPTOP_STATUS ? "Applicable" : "Not Applicable"}
              </span>
            </div>

            {formData.LAPTOP_STATUS && (
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <label>
                  Laptop Brand<span className="text-red-500"> *</span>
                  <input
                    name="LAPTOP_BRAND"
                    value={formData.LAPTOP_BRAND}
                    required
                    onChange={handleChange}
                    className="border p-2 mt-2 rounded w-full"
                    type="text"
                  />
                </label>
                <label>
                  Laptop Model<span className="text-red-500"> *</span>
                  <input
                    name="LAPTOP_MODEL"
                    value={formData.LAPTOP_MODEL}
                    required
                    onChange={handleChange}
                    className="border mt-2 p-2 rounded w-full"
                    type="text"
                  />
                </label>
                <label>
                  Laptop Serial Number<span className="text-red-500"> *</span>
                  <input
                    name="LAPTOP_SERIAL_NUMBER"
                    value={formData.LAPTOP_SERIAL_NUMBER}
                    required
                    onChange={handleChange}
                    className="border p-2 mt-2 rounded w-full"
                  />
                </label>
                <label>
                  Laptop Charger<span className="text-red-500"> *</span>
                  <select
                    name="LAPTOP_CHARGER"
                    value={formData.LAPTOP_CHARGER}
                    onChange={handleChange}
                    required
                    className="border p-2 mt-2 rounded w-full"
                  >
                    <option value="">Select</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </label>
                <label>
                  Mouse<span className="text-red-500"> *</span>
                  <select
                    name="MOUSE"
                    value={formData.MOUSE}
                    onChange={handleChange}
                    required
                    className="border p-2 mt-2 rounded w-full"
                  >
                    <option value="">Select</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </label>
              </div>
            )}

            {/* === MOBILE SECTION === */}
            <h3 className="text-lg font-semibold text-yellow-400 mt-9 mb-5">
              3. Mobile
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.MOBILE_STATUS}
                  onChange={() => {
                    const updatedStatus = !formData.MOBILE_STATUS;
                    setFormData({ ...formData, MOBILE_STATUS: updatedStatus });
                  }}
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>
                <div className="absolute left-[3px] top-[3px] w-3.5 h-3.5 bg-white rounded-full peer-checked:translate-x-5 transform transition-all duration-300"></div>
              </label>
              <span
                className={`text-sm font-semibold ${formData.MOBILE_STATUS ? "text-blue-600" : "text-gray-400"
                  }`}
              >
                {formData.MOBILE_STATUS ? "Applicable" : "Not Applicable"}
              </span>
            </div>

            {formData.MOBILE_STATUS && (
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <label>
                  Mobile Brand<span className="text-red-500"> *</span>
                  <input
                    name="MOBILE_BRAND"
                    value={formData.MOBILE_BRAND}
                    required
                    onChange={handleChange}
                    className="border p-2 mt-2 rounded w-full"
                    type="text"
                  />
                </label>
                <label>
                  Mobile Model<span className="text-red-500"> *</span>
                  <input
                    name="MOBILE_MODEL"
                    value={formData.MOBILE_MODEL}
                    required
                    onChange={handleChange}
                    className="border mt-2 p-2 rounded w-full"
                    type="text"
                  />
                </label>
                <label>
                  Mobile IMEI Number-1<span className="text-red-500"> *</span>
                  <input
                    name="MOBILE_IMEI_NUMBER1"
                    value={formData.MOBILE_IMEI_NUMBER1}
                    required
                    onChange={handleChange}
                    className="border p-2 mt-2 rounded w-full"
                  />
                </label>
                <label>
                  Mobile IMEI Number-2
                  <input
                    name="MOBILE_IMEI_NUMBER2"
                    value={formData.MOBILE_IMEI_NUMBER2}
                    onChange={handleChange}
                    className="border p-2 mt-2 rounded w-full"
                  />
                </label>
                <label>
                  Mobile Charger<span className="text-red-500"> *</span>
                  <select
                    name="MOBILE_CHARGER"
                    value={formData.MOBILE_CHARGER}
                    onChange={handleChange}
                    required
                    className="border p-2 mt-2 rounded w-full"
                  >
                    <option value="">Select</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </label>
              </div>
            )}

            {/* === HEADSET / OTHER ASSETS SECTION === */}
            <h3 className="text-lg font-semibold text-yellow-400 mt-9 mb-5">
              4. Other Assets
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.HEADSET_STATUS}
                  onChange={() => {
                    const updatedStatus = !formData.HEADSET_STATUS;
                    setFormData({ ...formData, HEADSET_STATUS: updatedStatus });
                  }}
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600   transition-all duration-300"></div>
                <div className="absolute left-[3px] top-[3px] w-3.5 h-3.5 bg-white rounded-full peer-checked:translate-x-5 transform transition-all duration-300"></div>
              </label>
              <span
                className={`text-sm font-semibold ${formData.HEADSET_STATUS ? "text-blue-600" : "text-gray-400"
                  }`}
              >
                {formData.HEADSET_STATUS ? "Applicable" : "Not Applicable"}
              </span>
            </div>

            {formData.HEADSET_STATUS && (
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <label>
                  HeadSet<span className="text-red-500"> *</span>
                  <select
                    name="HEADSET"
                    value={formData.HEADSET}
                    onChange={handleChange}
                    required
                    className="border p-2 mt-2 rounded w-full"
                  >
                    <option value="">Select</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </label>
                <label>
                  CUG Number
                  <input
                    name="CUG_NUMBER"
                    value={formData.CUG_NUMBER}
                    onChange={handleChange}
                    className="border p-2 mt-2 rounded w-full"
                    type="number"
                  />
                </label>
              </div>
            )}

            <div className="flex justify-end mt-6 gap-3 pt-8">
              <button
                onClick={() => setOpenPopup1(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleStatus(formData.EMPLOYEE_ID);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                type="submit"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 p-7 pl-10 overflow-hidden bg-gray-50">
          <h1 className="text-3xl font-bold text-blue-800 mb-6">
            {role === 'employee' ? 'My Assigned Assets' : 'Assets List'}
          </h1>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 w-1/3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="w-full focus:outline-none text-gray-700"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="NAME">Name</option>
                <option value="EMPLOYEE_ID">Employee ID</option>
                <option value="DESIGNATION">Designation</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg  border-gray-50 overflow-hidden">
            {/* ... (Table Header - Same) */}
            <div className="overflow-x-auto">
              <table className="w-full border rounded-xl border-gray-200">
                {/* ... (Thead) */}
                <thead className="bg-yellow-400">
                  <tr>
                    {/* ... (Existing Headers) */}
                    <th className="px-3 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                      Performance Key
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                      Employee ID
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                      Name
                    </th>
                    {/* ... (Other Headers) */}
                    <th className="px-3 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                      Designation
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                      Departnment
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                      Location
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                      Laptop status
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                      Mobile status
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                      Headset status
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                      Option
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y  divide-gray-300 ">
                  {Array.isArray(user) && user.length > 0 ? (
                    thisPageItems.map((x, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        {/* ... (Render Cells) */}
                        <td className="px-4 py-3 whitespace-nowrap text-sm  text-gray-800 border-r border-gray-200">
                          {x.PERFORMANCE_KEY}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                          {x.EMPLOYEE_ID}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                          {x.NAME}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                          {x.DESIGNATION}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                          {x.DEPARTMENT}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                          {x.LOCATION}
                        </td>
                        <td className="px-4 py-3 pl-6 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                          {x.LAPTOP_STATUS ? "✅" : " -"}
                        </td>
                        <td className="px-4 py-3 pl-6 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                          {x.MOBILE_STATUS ? "✅" : "-"}
                        </td>
                        <td className="px-4 py-3 pl-6 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                          {x.HEADSET_STATUS ? "✅" : "-"}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                          {role === 'employee' ? (
                            <button
                              onClick={() => {
                                setReportUser(x);
                                setOpenReportPopup(true);
                              }}
                              className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer border border-red-200"
                            >
                              Report Issue
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setOpenPopup1(true);
                                setSelectedUser(x);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="20" className="text-center  text-gray-500">
                        {/* ... (Empty state) */}
                        <div className="bg-white p-6 rounded-xl shadow-inner border-2 border-dashed border-gray-200">
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-medium">
                              No assets found
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredUsers.length / itemPerPage)}
            setCurrentPage={setCurrentPage}
          />

          {openPopup1 && <Popup1 user={selectedUser} />}
          {openReportPopup && <ReportPopup user={reportUser} onClose={() => setOpenReportPopup(false)} />}
        </div>
      </div>
    </>
  );
};

export { Asset };

