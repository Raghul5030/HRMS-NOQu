import { useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"

const Onboarding = () => {
  const [user, setuser] = useState([])
  const [openPopup1, setOpenPopup1] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [ID, setID] = useState(0);

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("NAME")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);

  const getDetials = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/getUsers`)
      setuser(res.data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load onboarding list")
    }
  }

  useEffect(() => {
    getDetials();
  }, []);

  useEffect(() => {
    setCurrentPage(1)
  }, [search, filter, fromDate, toDate])

  const usersArray = Array.isArray(user) ? user : (user?.data ?? []);

  const filteredUsers = usersArray.filter((x) => {
    if (!x) return false;
    // date keys used: DOI and DOJ in this component
    if (filter !== "DOJ" && filter !== "DOI") {
      if (search === "") return true;
      const field = (x[filter] || "").toString().toLowerCase().replace(/\s/g, "");
      return field.includes(search.toLowerCase().replace(/\s/g, ""));
    } else {
      if (!fromDate || !toDate) return true;
      const targetDate = new Date(x[filter]);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return targetDate >= from && targetDate <= to;
    }
  });

  const lastItemIndex = currentPage * itemPerPage;
  const firstItemIndex = lastItemIndex - itemPerPage;
  const thisPageItems = filteredUsers.slice(firstItemIndex, lastItemIndex);

  const Popup1 = ({ user }) => {
    let [errorMessage, setErrorMessage] = useState('');
    let [flag, setFlag] = useState("");
    let [isSubmitting, setIsSubmitting] = useState(false);
    let [isValidated, setIsValidated] = useState(false);

    const EmployeeId_Validation = async () => {
      if ((formData.EMPLOYEE_ID || "").length === 0) {
        setErrorMessage("❗ Employee ID cannot be empty");
        setFlag(false);
        setIsValidated(false);
      } else {
        try {
          const Eid = await axios.get(`${import.meta.env.VITE_API_URL}/getuser/${formData.EMPLOYEE_ID}`);
          if (Eid.data.message !== "found") {
            setErrorMessage(`✅ ${formData.EMPLOYEE_ID} does not exist. You can proceed.`);
            setFlag(true);
            setIsValidated(true);
          } else {
            setErrorMessage(`❌ ${formData.EMPLOYEE_ID} already exists`);
            setFlag(false);
            setIsValidated(false);
          }
        } catch (err) {
          setErrorMessage("Error checking Employee ID");
          setFlag(false);
          setIsValidated(false);
        }
      }
    };

    const tempalete = {
      EMPLOYEE_ID: user?.EMPLOYEE_ID || "",
      PERFORMANCE_KEY: user?.PERFORMANCE_KEY || "",
      DATE_OF_BIRTH: user?.DATE_OF_BIRTH?.split("T")[0] || "",
      NAME: user?.NAME || "",
      DESIGNATION: user?.DESIGNATION || "",
      DATE_OF_JOINING: user?.DOJ?.split("T")[0] || "",
      MAIL_ID: user?.MAIL_ID || "",
      PHONE: user?.PHONE_NUMBER || "",
      ADDRESS: user?.ADDRESS || "",
      CTC: user?.CTC || "",
      DEPARTMENT: user?.DEPARTMENT || "",
      LOCATION: user?.LOCATION || "",
      DATE_OF_INTERVIEW: user?.DOI?.split("T")[0] || "",
      GENDER: user?.GENDER || "",
      EMPLOYEE_ACTIVE_STATUS: !!user?.EMPLOYEE_ACTIVE_STATUS ?? 0,
      DOCUMENTS_STATUS: user?.DOCUMENTS_STATUS || "",
      ASSET_STATUS: user?.ASSET_STATUS || "",
      BLOOD_GROUP: user?.BLOOD_GROUP || "",
      MARRIED_STATUS: user?.MARRIED_STATUS || "",
      FATHER_NAME: user?.FATHER_NAME || "",
      FATHER_PHONE_NUMBER: user?.FATHER_PHONE_NUMBER || "",
      MOTHER_NAME: user?.MOTHER_NAME || "",
      MOTHER_PHONE_NUMBER: user?.MOTHER_PHONE_NUMBER || "",
      EMERGENCY_CONTACT_NUMBER: user?.EMERGENCY_CONTACT_NUMBER || "",
      GUARDIAN: user?.GUARDIAN || "",
      GUARDIAN_PHONE_NUMBER: user?.GUARDIAN_PHONE_NUMBER || ""
    };

    const [formData, setFormData] = useState(tempalete)

    useEffect(() => {
      setFormData(tempalete)
    }, [user])

    const deleteUser = async () => {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/deleteInterview/${ID}`);
        getDetials();
      } catch (err) {
        console.error(err)
      }
    }

    const handleChange = (a) => {
      const { name, value } = a.target;
      setFormData({ ...formData, [name]: value })
    }

    const submitHandaler = async () => {
      try {
        const updatedForm = { ...formData, EMPLOYEE_ACTIVE_STATUS: 1 };
        // optional: setFormData(updatedForm);
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/createEmployee`, updatedForm)
        const res1 = await axios.post(`${import.meta.env.VITE_API_URL}/empass`, updatedForm)
        await axios.post(`${import.meta.env.VITE_API_URL}/empdoc`, updatedForm)
        toast.success(res.data.message || "Onboarded", { position: 'top-right', duration: 5000 })
        await deleteUser();
        await getDetials();
        setOpenPopup1(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "some thing went wrong", { position: 'top-right', duration: 5000 })
      }
    }

    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex justify-center items-center ">
        <div className="bg-white rounded-lg shadow-xl w-[700px] p-9 overflow-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-800">Onboarding Details</h2>
            <button onClick={() => setOpenPopup1(false)} className="text-blue-700 hover:bg-green-50">❎</button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            submitHandaler();
          }}>
            {/* section-1: Employee ID*/}
            <h3 className="text-lg font-semibold text-yellow-400 mb-3 pt-4">1.Employee ID</h3>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Employee ID<span className="text-red-500"> *</span>
                <div className="flex gap-2 items-center">
                  <input
                    name="EMPLOYEE_ID"
                    value={formData.EMPLOYEE_ID}
                    onChange={handleChange}
                    className="flex-1 border rounded-sm px-3 py-2"
                  />

                  <button
                    type="button"
                    onClick={EmployeeId_Validation}
                    className="mr-59 px-5 ml-3 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Check
                  </button>
                </div>
              </label>
              <div className={`${flag ? "text-[#44ed23]" : "text-red-500"} text-[14px] mt-3`}>{errorMessage}</div>
            </div>

            {/* Section 2: User Details */}
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 pt-8">2.Other Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <label>
                  Performance Key<span className='text-red-500 '> *</span>
                  <input name="PERFORMANCE_KEY" value={formData.PERFORMANCE_KEY} onChange={handleChange} required className="border mt-2 p-2 rounded w-full font-medium" />
                </label>
                <label>
                  Date of Interview<span className='text-red-500 '> *</span>
                  <input name="DATE_OF_INTERVIEW" value={formData.DATE_OF_INTERVIEW} onChange={handleChange} required className="border mt-2 p-2 rounded w-full" type="date" />
                </label>
                <label>
                  Name<span className='text-red-500 '> *</span>
                  <input name="NAME" value={formData.NAME} onChange={handleChange} required className="border p-2 mt-2 rounded w-full" />
                </label>
                <label>
                  Designation<span className='text-red-500 '> *</span>
                  <input name="DESIGNATION" value={formData.DESIGNATION} required onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
                <label>
                  Date of Joining<span className='text-red-500 '> *</span>
                  <input name="DATE_OF_JOINING" value={formData.DATE_OF_JOINING} required onChange={handleChange} className="border mt-2 p-2 rounded w-full" type="date" />
                </label>
                <label>
                  Mail ID<span className='text-red-500 '> *</span>
                  <input name="MAIL_ID" value={formData.MAIL_ID} onChange={handleChange} type='email' required className="border p-2 mt-2 rounded w-full" />
                </label>
                <label>
                  Phone Number<span className='text-red-500 '> *</span>
                  <input name="PHONE" value={formData.PHONE} onChange={handleChange} required className="border p-2 mt-2 rounded w-full" />
                </label>
                <label>
                  Address
                  <input name="ADDRESS" value={formData.ADDRESS} onChange={handleChange} className="border p-2 mt-2 rounded w-full" />
                </label>
                <label>
                  CTC
                  <input name="CTC" value={formData.CTC} onChange={handleChange} type="number" className="border mt-2 p-2 rounded w-full" />
                </label>
                <label>
                  Department<span className='text-red-500 '> *</span>
                  <input name="DEPARTMENT" value={formData.DEPARTMENT} required onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
                <label>
                  Job Location
                  <input name="LOCATION" value={formData.LOCATION} onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
                <label>
                  Date of Birth<span className='text-red-500 '> *</span>
                  <input name="DATE_OF_BIRTH" value={formData.DATE_OF_BIRTH} required onChange={handleChange} className="border mt-2 p-2 rounded w-full" type="date" />
                </label>
                <label>Gender<span className='text-red-500 '> *</span>
                  <select name="GENDER" value={formData.GENDER} onChange={handleChange} required className="border p-2 mt-2 rounded w-full">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label>Married Status<span className='text-red-500 '> *</span>
                  <select name="MARRIED_STATUS" value={formData.MARRIED_STATUS} onChange={handleChange} required className="border p-2 mt-2 rounded w-full">
                    <option value="">Select </option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </label>

                <label>
                  Blood Group
                  <input name="BLOOD_GROUP" value={formData.BLOOD_GROUP} onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
                <label>
                  Emergency Contact Number<span className='text-red-500 '> *</span>
                  <input name="EMERGENCY_CONTACT_NUMBER" type="number" value={formData.EMERGENCY_CONTACT_NUMBER} required onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
              </div>
            </div>

            {/* Section 3: Parent Details */}
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mt-9 mb-5">3. Parent Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <label>
                  Father's Name
                  <input name="FATHER_NAME" value={formData.FATHER_NAME} onChange={handleChange} className="border p-2 mt-2 rounded w-full" />
                </label>

                <label>
                  Father's Phone Number
                  <input name="FATHER_PHONE_NUMBER" value={formData.FATHER_PHONE_NUMBER} onChange={handleChange} className="border mt-2 p-2 rounded w-full" type="number" />
                </label>
                <label>
                  Mother's Name
                  <input name="MOTHER_NAME" value={formData.MOTHER_NAME} onChange={handleChange} className="border p-2 mt-2 rounded w-full" />
                </label>
                <label>
                  Mother's Phone Number
                  <input name="MOTHER_PHONE_NUMBER" value={formData.MOTHER_PHONE_NUMBER} onChange={handleChange} className="border mt-2 p-2 rounded w-full" type="number" />
                </label>
                <label>
                  guardian
                  <input name="GUARDIAN" value={formData.GUARDIAN} onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
                <label>
                  guardian Phone Number
                  <input name="GUARDIAN_PHONE_NUMBER" value={formData.GUARDIAN_PHONE_NUMBER} onChange={handleChange} className="border mt-2 p-2 rounded w-full" type="number" />
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3 pt-8">
              <button onClick={() => setOpenPopup1(false)} className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">Onboard</button>
            </div>
          </form>
        </div>
      </div>
    )
  };

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
        <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="px-2 py-1 border text-sm hover:bg-gray-100 rounded border-gray-500">ᐊ</button>

        {getPageNumbers().map((page, index) => (
          <button
            key={String(page) + index}
            onClick={() => { if (page !== "...") setCurrentPage(Number(page)) }}
            disabled={page === "..."}
            className={`px-2.5 py-1 border text-sm ${currentPage === page ? 'bg-yellow-500 text-white border-yellow-500 rounded ' : 'text-gray-700 hover:bg-yellow-100 rounded border-gray-600'} ${page === "..." ? 'cursor-default text-gray-400' : ''}`}
          >
            {page}
          </button>
        ))}

        <button onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredUsers.length / itemPerPage) || 1, prev + 1))} className="px-2 py-1 border border-gray-600 text-sm hover:bg-gray-100 rounded">ᐅ</button>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-7 pl-10 overflow-hidden bg-gray-50">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Onboarding List</h1>

        <div className="flex flex-row gap-6 mb-6 w-1/2">
          {(filter !== "DOI" && filter !== "DOJ") && (
            <input type="text" onChange={(e) => setSearch(e.target.value)} value={search} placeholder={"Search by " + filter.toLowerCase()} className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700 placeholder-gray-400" />
          )}

          {(filter === "DOI" || filter === "DOJ") && (
            <>
              <input type="date" onChange={(e) => setFromDate(e.target.value)} value={fromDate} className="px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700" />
              <p className="mt-2">to</p>
              <input type="date" onChange={(e) => setToDate(e.target.value)} value={toDate} className="px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700" />
            </>
          )}

          <select onChange={(e) => setFilter(e.target.value)} value={filter} className="ml-auto w-56 px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700">
            <option value="" hidden>Filter by</option>
            <option value="NAME">Name</option>
            <option value="DESIGNATION">Designation</option>
            <option value="DEPARTMENT">Department</option>
            <option value="PHONE_NUMBER">Phone Number</option>
            <option value="DOI">Date of Interview</option>
            <option value="DOJ">Date of Joining</option>
          </select>
        </div>

        <div className="bg-white rounded-lg border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl border-gray-300">
              <thead className="bg-yellow-400">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">DOI</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">DOJ</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Designation</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {filteredUsers.length > 0 ? (
                  thisPageItems.map((x, index) => (
                    <tr key={x.ID || index} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{x.NAME || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{x.DOI?.split("T")[0] || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{x.DOJ?.split("T")[0] || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{x.DESIGNATION || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{x.DEPARTMENT || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{x.PHONE_NUMBER || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        <button onClick={() => { setOpenPopup1(true); setSelectedUser(x); setID(x.ID); }} className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer">View</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      <div className="bg-white p-6 rounded-xl shadow-inner border-2 border-dashed border-gray-200">
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-medium">No onboarding records found</span>
                          <span className="text-sm text-gray-400 mt-1">Add candidates to see them here</span>
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
}

export { Onboarding }
