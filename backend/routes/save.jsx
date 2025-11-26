
const Popup1 = ({ user }) => {
    const [errorMessage, setErrorMessage] = useState('')
    const [flag, setFlag] = useState(false)
    
    const template = {
      EMPLOYEE_ID: user.EMPLOYEE_ID || "",
      PERFORMANCE_KEY: user.PERFORMANCE_KEY || "",
      DATE_OF_BIRTH: user.DATE_OF_BIRTH?.split("T")[0] || "",
      NAME: user.NAME || "",
      DESIGNATION: user.DESIGNATION || "",
      DATE_OF_JOINING: user.DOJ?.split("T")[0] || "",
      MAIL_ID: user.MAIL_ID || "",
      PHONE: user.PHONE_NUMBER || "",
      ADDRESS: user.ADDRESS || "",
      CTC: user.CTC || "",
      DEPARTMENT: user.DEPARTMENT || "",
      DATE_OF_INTERVIEW: user.DOI?.split("T")[0] || "",
      GENDER: user.GENDER || "",
      EMPLOYEE_ACTIVE_STATUS: user.EMPLOYEE_ACTIVE_STATUS || "",
      DOCUMENTS_STATUS: user.DOCUMENTS_STATUS || "",
      ASSET_STATUS: user.ASSET_STATUS || "",
      BLOOD_GROUP: user.BLOOD_GROUP || "",
      MARRIED_STATUS: user.MARRIED_STATUS || "",
      FATHER_NAME: user.FATHER_NAME || "",
      FATHER_PHONE_NUMBER: user.FATHER_PHONE_NUMBER || "",
      MOTHER_NAME: user.MOTHER_NAME || "",
      MOTHER_PHONE_NUMBER: user.MOTHER_PHONE_NUMBER || "",
      EMERGENCY_CONTACT_NUMBER: user.EMERGENCY_CONTACT_NUMBER || "",
      GUARDIAN: user.GUARDIAN || "",
      GUARDIAN_PHONE_NUMBER: user.GUARDIAN_PHONE_NUMBER || ""
    }

    const [formData, setFormData] = useState(template)

    useEffect(() => {
      setFormData(template)
    }, [user])

    const EmployeeId_Validation = async () => {
      if (!formData.EMPLOYEE_ID || formData.EMPLOYEE_ID.length === 0) {
        setErrorMessage("❗ Employee ID cannot be empty")
        setFlag(false)
        return
      }

      try {
        const Eid = await axios.get(`http://hrms-noqu.onrender.com/v1/getuser/${formData.EMPLOYEE_ID}`)
        if (Eid.data.message !== "found") {
          setErrorMessage(`✅ ${formData.EMPLOYEE_ID} does not exist. You can proceed.`)
          setFlag(true)
        } else {
          setErrorMessage(`❌ ${formData.EMPLOYEE_ID} already exists`)
          setFlag(false)
        }
      } catch (error) {
        setErrorMessage("Error validating Employee ID")
        setFlag(false)
      }
    }

    const deleteUser = async () => {
      try {
        await axios.delete(`http://hrms-noqu.onrender.com/v1/deleteInterview/${ID}`)
        getDetails()
      } catch (error) {
        toast.error("Failed to delete user")
      }
    }

    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      
      if (!flag) {
        toast.error("Please validate Employee ID first", { position: 'top-right', duration: 5000 })
        return
      }

      try {
        const res = await axios.post("http://hrms-noqu.onrender.com/v1/createEmployee", formData)
        toast.success(res.data.message, { position: 'top-right', duration: 5000 })
        await deleteUser()
        setOpenPopup1(false)
      } catch (error) {
        toast.error("Something went wrong", { position: 'top-right', duration: 5000 })
      }
    }

    return (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-[700px] p-9 overflow-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-800">Onboarding Details</h2>
            <button onClick={() => setOpenPopup1(false)} className="text-blue-700 hover:bg-green-50">❎</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Section 1: Employee ID */}
            <h3 className="text-lg font-semibold text-yellow-400 mb-3 pt-4">1. Employee ID</h3>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Employee ID<span className="text-red-500"> *</span>
              </label>
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
              <div className={`${flag ? "text-[#44ed23]" : "text-red-500"} text-[14px] mt-3`}>
                {errorMessage}
              </div>
            </div>

            {/* Section 2: User Details */}
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 pt-8">2. Other Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <label>
                  Performance Key<span className='text-red-500'> *</span>
                  <input name="PERFORMANCE_KEY" value={formData.PERFORMANCE_KEY} onChange={handleChange} required className="border mt-2 p-2 rounded w-full font-medium" />
                </label>
                <label>
                  Date of Interview<span className='text-red-500'> *</span>
                  <input name="DATE_OF_INTERVIEW" value={formData.DATE_OF_INTERVIEW} onChange={handleChange} required className="border mt-2 p-2 rounded w-full" type="date" />
                </label>
                <label>
                  Name<span className='text-red-500'> *</span>
                  <input name="NAME" value={formData.NAME} onChange={handleChange} required className="border p-2 mt-2 rounded w-full" />
                </label>
                <label>
                  Designation<span className='text-red-500'> *</span>
                  <input name="DESIGNATION" value={formData.DESIGNATION} required onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
                <label>
                  Date of Joining<span className='text-red-500'> *</span>
                  <input name="DATE_OF_JOINING" value={formData.DATE_OF_JOINING} required onChange={handleChange} className="border mt-2 p-2 rounded w-full" type="date" />
                </label>
                <label>
                  Mail ID<span className='text-red-500'> *</span>
                  <input name="MAIL_ID" value={formData.MAIL_ID} onChange={handleChange} type='email' required className="border p-2 mt-2 rounded w-full" />
                </label>
                <label>
                  Phone Number<span className='text-red-500'> *</span>
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
                  Department<span className='text-red-500'> *</span>
                  <input name="DEPARTMENT" value={formData.DEPARTMENT} required onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
                <label>
                  Date of Birth<span className='text-red-500'> *</span>
                  <input name="DATE_OF_BIRTH" value={formData.DATE_OF_BIRTH} required onChange={handleChange} className="border mt-2 p-2 rounded w-full" type="date" />
                </label>
                <label>
                  Gender<span className='text-red-500'> *</span>
                  <select
                    name="GENDER"
                    value={formData.GENDER}
                    onChange={handleChange}
                    required
                    className="border p-2 mt-2 rounded w-full"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>
                  Married Status
                  <input name="MARRIED_STATUS" value={formData.MARRIED_STATUS} onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
                <label>
                  Blood Group
                  <input name="BLOOD_GROUP" value={formData.BLOOD_GROUP} onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
                <label>
                  Emergency Contact Number<span className='text-red-500'> *</span>
                  <input name="EMERGENCY_CONTACT_NUMBER" value={formData.EMERGENCY_CONTACT_NUMBER} required onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
              </div>
            </div>

            {/* Section 3: Parent Details */}
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mt-9 mb-5">3. Parent Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4 font-">
                <label>
                  Father's Name
                  <input name="FATHER_NAME" value={formData.FATHER_NAME} onChange={handleChange} className="border p-2 mt-2 rounded w-full" />
                </label>
                <label>
                  Father's Phone Number
                  <input name="FATHER_PHONE_NUMBER" value={formData.FATHER_PHONE_NUMBER} onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
                <label>
                  Mother's Name
                  <input name="MOTHER_NAME" value={formData.MOTHER_NAME} onChange={handleChange} className="border p-2 mt-2 rounded w-full" />
                </label>
                <label>
                  Mother's Phone Number
                  <input name="MOTHER_PHONE_NUMBER" value={formData.MOTHER_PHONE_NUMBER} onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
                <label>
                  Guardian
                  <input name="GUARDIAN" value={formData.GUARDIAN} onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
                <label>
                  Guardian Phone Number
                  <input name="GUARDIAN_PHONE_NUMBER" value={formData.GUARDIAN_PHONE_NUMBER} onChange={handleChange} className="border mt-2 p-2 rounded w-full" />
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3 pt-8">
              <button
                onClick={() => setOpenPopup1(false)}
                type="button"
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Onboard
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
