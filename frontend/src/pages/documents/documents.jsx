import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";

const Documents = () => {
  const [user, setuser] = useState([]);
  const [openPopup1, setOpenPopup1] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const Navigate = useNavigate();

  const getDetails = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/document`);
    setuser(res.data);
  };

  useEffect(() => {
    getDetails();
  }, []);

  const Popup1 = ({ user }) => {
    const template = {
      EMPLOYEE_ID: user.EMPLOYEE_ID || "",
      PERFORMANCE_KEY: user.PERFORMANCE_KEY || "",
      NAME: user.NAME || "",
      DESIGNATION: user.DESIGNATION || "",
      DEPARTMENT: user.DEPARTMENT || "",
    };
    // alert("Note: As this is not a paid server, documents are stored in Cloudinary and cannot be viewed directly in the frontend.");


    const [formData, setFormData] = useState(template);
    const [fileInputs, setFileInputs] = useState({});

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      const field = e.target.name;
      if (file) {
        setFileInputs((prev) => ({ ...prev, [field]: file }));
      }
    };

    const getCloudinarySignature = async (folder, public_id) => {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/cloudinary-signature`, {
        folder,
        public_id
      });
      return res.data;
    };

    const handleFileUpload = async (field) => {
      const file = fileInputs[field];
      if (!file) return alert("Please select a file first");

      const folder = `employee_docs`;
      const public_id = `${field}_${formData.EMPLOYEE_ID}`;

      try {
        const { cloudName, apiKey, timestamp, signature } = await getCloudinarySignature(folder, public_id);

        const cloudData = new FormData();
        cloudData.append("file", file);
        cloudData.append("api_key", apiKey);
        cloudData.append("timestamp", timestamp);
        cloudData.append("signature", signature);
        cloudData.append("folder", folder);
        cloudData.append("public_id", public_id);

        const cloudRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
          cloudData
        );

        console.log("Cloudinary Upload Response:", cloudRes.data);
        const uploadedUrl = cloudRes.data.secure_url;

        await axios.post(`${import.meta.env.VITE_API_URL}/UpdateDocStatus`, {
          EMPLOYEE_ID: formData.EMPLOYEE_ID,
          field,
          url: uploadedUrl,
        });

        toast.success(`${field.replace(/_/g, ' ')} uploaded successfully`, { position: 'top-right' });
        getDetails();
      } catch (error) {
        console.error(error);
        toast.error(`Upload failed for ${field}`, { position: 'top-right' });
      }
    };

    const uploadFields = [
      "TENTH",
      "TWELFTH",
      "DEGREE",
      "AADHAR",
      "PAN",
      "RELIEVING_LETTER",
      "PAY_SLIP_3_MONTHS",
      "PARENTS_AADHAR"
    ];



    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-xl w-[700px] p-9 overflow-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-800">Documents Details</h2>
            <button onClick={() => setOpenPopup1(false)} className="text-blue-700 hover:bg-green-50">❎</button>
          </div>

          <h3 className="text-lg font-semibold text-yellow-400 mb-3 pt-8">1. Employee Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(template).map(([key, value]) => (
              <label key={key}>
                {key.replace(/_/g, ' ')}
                <input
                  name={key}
                  value={value}
                  readOnly
                  className="border mt-2 p-2 rounded w-full bg-gray-100 cursor-not-allowed"
                />
              </label>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-yellow-500 mb-4 pt-6 pb-2">2. Upload Documents</h3>
          <div className="space-y-4">
            {uploadFields.map((field) => (
              <div key={field} className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  {field.replace(/_/g, ' ')}
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <input
                    type="file"
                    name={field}
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-700 border border-gray-300 rounded px-7 py-1 bg-white"
                  />

                  <div className="flex gap-4 items-center">
                    <button
                      type="button"
                      onClick={() => handleFileUpload(field)}
                      className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 text-sm"
                    >
                      Upload
                    </button>
                    <span className={`text-sm font-semibold ${user[field] !== "0" ? 'text-green-600' : 'text-red-500'}`}>
                      {user[field] !== "0" ? "Uploaded" : " Not Uploaded"}
                    </span>

                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6 gap-3 pt-8">
            <button
              onClick={() => setOpenPopup1(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };


  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("NAME"); // or any valid default filter key like "EMPLOYEE_ID"


  const filteredUsers = user.filter((x) => {
    return search === "" ? x : (x[filter].toLowerCase().replace(/\s/g, "")).includes(search.toLowerCase().replace(/\s/g, ""))
  }
  )
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(7);

  const lastItemIndex = currentPage * itemPerPage;
  const firstItemIndex = lastItemIndex - itemPerPage;
  const thisPageItems = filteredUsers.slice(firstItemIndex, lastItemIndex);

  const pages = []
  for (let i = 1; i <= Math.ceil(filteredUsers.length / itemPerPage); i++) {
    pages.push(i);
  }
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
          pageNumbers.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
        }
      }

      return pageNumbers;
    };

    return (
      <div className="flex justify-center mt-6 space-x-2">
        {/* Prev Button */}
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          className="px-2 py-1 border text-sm hover:bg-gray-100 rounded border-gray-500"
        >
          ᐊ
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            onClick={() => setCurrentPage(page)}
            disabled={page === "..."}
            className={`px-2.5 py-1 border text-sm ${currentPage === page ? 'bg-yellow-500 text-white border-yellow-500 rounded ' : 'text-gray-700 hover:bg-yellow-100 rounded border-gray-600'
              } ${page === "..." ? 'cursor-default text-gray-400' : ''}`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          className="px-2 py-1 border border-gray-600 text-sm hover:bg-gray-100 rounded"
        >
          ᐅ
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-7 pl-10 overflow-hidden bg-gray-50">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Documents Details</h1>

        <div className="flex flex-row gap-6 mb-6 w-1/2">
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Search by " + filter.toLowerCase()}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700 placeholder-gray-400"
          />
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="ml-auto w-56 px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700"
          >
            <option value="" hidden>Filter by</option>
            <option value="NAME">Name</option>
            <option value="EMPLOYEE_ID">Employee ID</option>
            <option value="PERFORMANCE_KEY">Performance Key</option>
            <option value="DESIGNATION">Designation</option>
            <option value="DEPARTMENT">Department</option>
          </select>
        </div>

        <div className="bg-white rounded-lg border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl border-gray-200">
              <thead className="bg-yellow-400">
                <tr>
                  {["Performance Key", "Employee ID", "Name", "Designation", "Departnment", "10th", "12th", "Degree", "Aadhar", "Pan", "Relieving letter", "Pay slip", "Parents Aadhar", "Update"].map(header => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {Array.isArray(user) && user.length > 0 ? (
                  thisPageItems.map((x, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                      {[
                        "PERFORMANCE_KEY", "EMPLOYEE_ID", "NAME", "DESIGNATION", "DEPARTMENT",
                        "TENTH", "TWELFTH", "DEGREE", "AADHAR", "PAN", "RELIEVING_LETTER",
                        "PAY_SLIP_3_MONTHS", "PARENTS_AADHAR"
                      ].map((field, idx) => (
                        <td key={idx} className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                          {[
                            "TENTH", "TWELFTH", "DEGREE", "AADHAR", "PAN",
                            "RELIEVING_LETTER", "PAY_SLIP_3_MONTHS", "PARENTS_AADHAR"
                          ].includes(field) ? (
                            <span className={`px-2 py-1 text-xs rounded-full font-semibold 
                          ${x[field] && x[field] !== "0" ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-800'}`}>
                              {x[field] && x[field] !== "0" ? "Submited" : "Pending"}
                            </span>
                          ) : (
                            x[field] || '-'
                          )}
                        </td>
                      ))}

                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        <button
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setOpenPopup1(true);
                            setSelectedUser(x);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>

                  ))
                ) : (
                  <tr>
                    <td colSpan="20" className="text-center text-gray-500">
                      <div className="bg-white p-6 rounded-xl shadow-inner border-2 border-dashed border-gray-200">
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-medium">No Documents records found</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredUsers.length / itemPerPage)}
          setCurrentPage={setCurrentPage}
        />
        {openPopup1 && <Popup1 user={selectedUser} />}
      </div>
    </div>
  );
};

export { Documents };
