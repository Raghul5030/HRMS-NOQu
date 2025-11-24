import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom'
import { useState,useEffect,useRef} from 'react'
import axios from 'axios'

const UpdateDocuments=()=>{

    const Navigate=useNavigate();
    const [user, setuser] = useState([]);
    const fileInputRefs = useRef({}); // to track file inputs per row
    const [selectedFiles, setSelectedFiles] = useState({});
    const [openPopup1,setOpenPopup1]=useState(false)
    

    const getDetials = async () => {
    const res = await axios.get("http://localhost:3000/document")
    setuser(res.data)

    }

    useEffect(() => {
    getDetials(); 
    }, []);

    const handleFileChange = (e, key,ID, col) => {
        const file = e.target.files[0];
        if (file) {
          setSelectedFiles((prev) => ({ ...prev, [key]: file }));
          alert(`Selected "${file.name}" for ${key}`);

          const updatedData = { EMPLOYEE_ID: ID, field: col };
          axios.post("http://localhost:3000/UpdateDocStatus", updatedData).then((res) => {
            console.log(res);
            getDetials();
          });
        }

    };

    const handleUploadClick = (key) => {
      if (fileInputRefs.current[key]) {
        fileInputRefs.current[key].click();
      }
    };


    const Popup1 = ({user}) => {
     const tempalete = {
        EMPLOYEE_ID: user.EMPLOYEE_ID || "",
        PERFORMANCE_KEY: user.PERFORMANCE_KEY || "",
        NAME: user.NAME || "",
        DESIGNATION: user.DESIGNATION || "",
        DEPARTMENT: user.DEPARTMENT || "",
        LOCATION: user.LOCATION || "",

        LAPTOP_STATUS: !! user.LAPTOP_STATUS,     
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
        HEADSET: user.HEADSET || "" 
      };

      

      const [formData,setFormData]=useState(tempalete)

  
      const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return false;
};

// Then use it like:

  
 
  const handleChange=(a)=>{

          const {name,value}=a.target;
          setFormData({...formData,[name]:value})
      }
 
  const submitHandaler=async(req,res)=>{          
        await axios.post("http://localhost:3000/UpdateAsset",formData)

        .then((res)=>{
           
            toast.success(res.data.message,{position:'top-right',duration: 5000})
            getDetials();
            setOpenPopup1(false);
        })
        .catch((error)=>{
  
            toast.error(error.response?.data?.message||"some thing went wrong",{position:'top-right',duration: 5000})
        })
  }

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex justify-center items-center ">
      <div className="bg-white rounded-lg shadow-xl w-[700px] p-9 overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-800">Assets Details</h2>
          <button onClick={()=>setOpenPopup1(false)}  className="text-blue-700 hover:bg-green-50">❎</button>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();  // Prevents the default form submit (page reload)
            submitHandaler();
          }}>
        {/* Section 2: User Details */}
       <div>
        <h3 className="text-lg font-semibold text-yellow-400 mb-3 pt-8">1. Employee Details</h3>
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


      <div className="flex justify-end mt-6 gap-3 pt-8">
        <button
            onClick={()=>setOpenPopup1(false)}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >Cancel
        </button>
        <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit" >
        Update
        </button>

           </div>
         </form>
        </div>
        </div>
        )          
    }

    

return(
     <div className="flex h-screen">
      {/* Main Content with Yellow Table */}
      <div className="flex-1 p-7 pl-10 overflow-hidden bg-gray-50">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Update / View Documents</h1>
        
        {/* Yellow-themed Table */}
        <div className="bg-white rounded-lg  border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl border-gray-200">
              <thead className="bg-yellow-400">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                    Performance Key
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                    Employee ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                    Designation
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                    Departnment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                    10th
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                    12th
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">
                    Degree
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider">
                    Aadhar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider">
                    Pan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider">
                    Relieving letter
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider">
                    Pay slip
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider">
                    Parents Aadhar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider">
                    Update
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y  divide-gray-300 ">
              
                 {Array.isArray(user) && user.length > 0 ? (
                user.map((x, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm  text-gray-800 border-r border-gray-200">
                      {x.PERFORMANCE_KEY }
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
                      {x.DEPARTMENT }
                    </td>
                   <td className="px-4 pl-4 text-xs text-gray-800 border-r border-gray-200">
                      {x.TENTH ? 
                      (
                          <>
                            <button className="bg-green-500 text-white rounded-sm px-1 cursor-pointer hover:bg-gray-400">View</button>
                            <input
                              type="file"
                              ref={(el) => (fileInputRefs.current[x.PERFORMANCE_KEY] = el)}
                              onChange={(e) => handleFileChange(e, x.PERFORMANCE_KEY,x.EMPLOYEE_ID, "TENTH")}
                              style={{ display: 'none' }}
                            />
                            <button className="bg-amber-600 text-white rounded-sm pr-1.5 pl-1.5 mt-0.5 cursor-pointer hover:bg-gray-400 " onClick={() => handleUploadClick(x.PERFORMANCE_KEY)}>  Edit  </button>
                          </>
                      )
                      : 
                      (
                         <>
                            <input
                              type="file"
                              ref={(el) => (fileInputRefs.current[x.PERFORMANCE_KEY] = el)}
                              onChange={(e) => handleFileChange(e, x.PERFORMANCE_KEY,x.EMPLOYEE_ID, "TENTH")}
                              style={{ display: 'none' }}
                            />
                            <button onClick={() => handleUploadClick(x.PERFORMANCE_KEY)} className="text-[14px] cursor-pointer pl-1.5">
                              ⬆️
                            </button>
                          </>
                      )
                      }
                    </td>
                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {x.TWELFTH }
                    </td>
                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {x.DEGREE }
                    </td>
                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {x.AADHAR }
                    </td>
                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {x.PAN}
                    </td>
                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {x.RELIEVING_LETTER}
                    </td>
                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {x.PAY_SLIP_3_MONTHS }
                    </td>
                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {x.PARENTS_AADHAR}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={()=>{Navigate('/documents')}}
                      >
                        Back
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="20" className="text-center  text-gray-500">
                    <div className="bg-white p-6 rounded-xl shadow-inner border-2 border-dashed border-gray-200">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-medium">No onboarding records found</span>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
    
      </div>
    </div>
  );
}


export {UpdateDocuments}