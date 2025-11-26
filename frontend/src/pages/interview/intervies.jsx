import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Interview = () => {
  const [user, setuser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("NAME");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("Requested");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingUser, setRejectingUser] = useState(null);
  const [rejectionConductedBy, setRejectionConductedBy] = useState("");

  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectDetails, setSelectDetails] = useState({
    conductedBy: "",
    ctc: "",
    role: "",
    doj: ""
  });

  const getDetials = async () => {
    // alert("Note: Updates may take time to appear due to server limits after submiting Interview form.");
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/getform`);
    setuser(res.data);
  };

  useEffect(() => {
    getDetials();
  }, []);

  const handleSelectClick = (employee) => {
    setSelectedUser(employee);
    setSelectDetails({
      conductedBy: "",
      ctc: "",
      role: "",
      doj: ""
    });
    setShowSelectModal(true);

  };

  const handleConfirmSelect = async () => {
    try {
      const { conductedBy, ctc, role, doj } = selectDetails;
      await axios.post(`${import.meta.env.VITE_API_URL}/UpdateInterview`, {
        ...selectedUser,
        STATUS: "Selected",
        CONDUCTED_BY: conductedBy,
        CTC: ctc,
        ROLE: role,
        DOJ: doj
      });
      getDetials();
      toast.success("Candidate Selected", { position: 'top-right' });

      await axios.post(`${import.meta.env.VITE_API_URL}/addinter`, {
        NAME: selectedUser.NAME,
        GENDER: selectedUser.GENDER,
        DATE_OF_BIRTH: selectedUser.DOB?.split("T")[0],
        MAIL_ID: selectedUser.EMAIL,
        PHONE_NUMBER: selectedUser.PHONE_NUMBER,
        ADDRESS: selectedUser.ADDRESS,
        DOI: selectedUser.DOI?.split("T")[0],
        CTC: ctc,
        DESIGNATION: role,
        DOJ: doj
      });
      setShowSelectModal(false);
    } catch (error) {
      console.error("Selection error:", error);
      toast.error(error.response?.data?.message || "Something went wrong", { position: 'top-right' });
    }
  };


  const handleRejectClick = (employee) => {
    setRejectingUser(employee);
    setRejectionReason("");
    setRejectionConductedBy("");
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/UpdateInterviewReject`, {
        ...rejectingUser,
        STATUS: "Rejected",
        REJECTION_REASON: rejectionReason,
        CONDUCTED_BY: rejectionConductedBy
      });
      getDetials();
      toast.success("Candidate Rejected", { position: 'top-right' });
      setShowRejectModal(false);
      setRejectingUser(null);
    } catch (error) {
      toast.error("Failed to reject", { position: 'top-right' });
    }
  };

  const statusFilteredUsers = user.filter(u => u.STATUS === statusFilter);

  const filteredUsers = statusFilteredUsers.filter((x) => {
    if (filter !== "DATE_OF_JOINING") {
      return search === ""
        ? x
        : (x[filter]?.toLowerCase().replace(/\s/g, "")).includes(search.toLowerCase().replace(/\s/g, ""));
    } else {
      if (!fromDate || !toDate) return x;
      const targetDate = new Date(x[filter]);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return targetDate >= from && targetDate <= to;
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(6);
  const lastItemIndex = currentPage * itemPerPage;
  const firstItemIndex = lastItemIndex - itemPerPage;
  const thisPageItems = filteredUsers.slice(firstItemIndex, lastItemIndex);

  const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    const getPageNumbers = () => {
      const pageNumbers = [];
      if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        if (currentPage <= 4) pageNumbers.push(1, 2, 3, 4, 5, "...", totalPages);
        else if (currentPage > totalPages - 4) pageNumbers.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        else pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
      return pageNumbers;
    };

    return (
      <div className="flex justify-center mt-6 space-x-2">
        <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="px-2 py-1 border text-sm rounded">ᐊ</button>
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(page)}
            disabled={page === "..."}
            className={`px-2.5 py-1 border rounded text-sm ${currentPage === page ? 'bg-yellow-500 text-white' : ''}`}
          >
            {page}
          </button>
        ))}
        <button onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredUsers.length / itemPerPage), prev + 1))} className="px-2 py-1 border text-sm rounded">ᐅ</button>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Reject Modal */}
      {showRejectModal && rejectingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              Reject {rejectingUser.NAME}?
            </h2>
            <p className="text-sm mb-2">Enter rejection details:</p>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Conducted By</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={rejectionConductedBy}
                onChange={(e) => setRejectionConductedBy(e.target.value)}
                placeholder="Interviewer name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
              <textarea
                rows={3}
                className="w-full border rounded px-3 py-2"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowRejectModal(false)} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleConfirmReject} className="px-3 py-2 bg-red-500 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Select Modal */}
      {showSelectModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-blue-700">
              Select {selectedUser.NAME}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conducted By</label>
                <input
                  type="text"
                  placeholder="Interviewer name"
                  value={selectDetails.conductedBy}
                  onChange={(e) => setSelectDetails({ ...selectDetails, conductedBy: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTC</label>
                <input
                  type="text"
                  placeholder="Compensation"
                  value={selectDetails.ctc}
                  onChange={(e) => setSelectDetails({ ...selectDetails, ctc: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  placeholder="Job role"
                  value={selectDetails.role}
                  onChange={(e) => setSelectDetails({ ...selectDetails, role: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                <input
                  type="date"
                  placeholder="Joining date"
                  value={selectDetails.doj}
                  onChange={(e) => setSelectDetails({ ...selectDetails, doj: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setShowSelectModal(false)} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleConfirmSelect} className="px-3 py-2 bg-green-500 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content with Yellow Table */}
      <div className="flex-1 p-7 pl-10 overflow-hidden bg-gray-50">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">
          Interview Details
          <a
            href="/interviewForm"
            target="_blank"

          >
            <span className='text-blue-400 text-sm pl-5'>(Interview Form:</span><span className="text-sm text-blue-500 pl-1 underline hover:text-blue-700">https://officenoqu.com/interviewForm)</span>
          </a>
        </h1>

        {/* Filter Section + Status Buttons */}
        <div className="flex flex-row gap-6 mb-6 items-end">
          {filter !== "DATE_OF_JOINING" && (
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={"Search by " + filter.toLowerCase()}
              className="w-80 px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700 placeholder-gray-400"
            />
          )}

          {filter === "DATE_OF_JOINING" && (
            <>
              <input
                type="date"
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700"
              />
              <p className="mt-2">to</p>
              <input
                type="date"
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700"
              />
            </>
          )}

          <select
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-700"
          >
            <option value="" hidden>Filter by</option>
            <option value="NAME">Name</option>
            <option value="GENDER">Gender</option>
            <option value="PHONE_NUMBER">Phone number</option>
            <option value="EMAIL">Email</option>
            <option value="DESIGNATION">Designation</option>
            <option value="INTERVIEW_MODE">Interview mode</option>
            <option value="DOB">Date of Birth</option>
            <option value="DOI">Date of Interview</option>
          </select>

          {/* Move Buttons to Right */}
          <div className="ml-auto flex gap-3">
            {["Requested", "Selected", "Rejected"].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors border ${statusFilter === status
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-white text-yellow-700 border-yellow-400 hover:bg-yellow-100"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl border-gray-200">
              <thead className="bg-yellow-400">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">GENDER</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">DOB</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">EMAIL</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Phone number</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Experiance</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Mode</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">DOI</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Applied for</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Address</th>

                  {/* Additional columns for Selected status */}
                  {statusFilter === "Selected" && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Conducted By</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">CTC</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">DOJ</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Selected for</th>
                    </>
                  )}

                  {/* Additional column for Rejected status */}
                  {statusFilter === "Rejected" && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Conducted By</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Reason</th>
                    </>
                  )}

                  {statusFilter === "Requested" && (
                    <th className="px-4 py-3 pl-4 text-xs font-bold text-yellow-900 uppercase tracking-wider border-r border-yellow-500">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {Array.isArray(user) && user.length > 0 ? (
                  thisPageItems.map((employee, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-sm text-gray-800 border- border-gray-200">{employee.NAME}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{employee.GENDER}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-sm text-gray-900 border-r border-gray-200">{employee.DOB?.split("T")[0]}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{employee.EMAIL}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{employee.PHONE_NUMBER}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{employee.EXPERIANCE}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{employee.INTERVIEW_MODE}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{employee.DOI?.split("T")[0]}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r max-w-[150px] truncate border-gray-200" title={employee.DESIGNATION}>{employee.DESIGNATION}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r max-w-[150px] truncate border-gray-200" title={employee.ADDRESS}>{employee.ADDRESS}</td>

                      {/* Additional data for Selected status */}
                      {statusFilter === "Selected" && (
                        <>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{employee.CONDUCTED_BY || "—"}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{employee.CTC || "—"}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{employee.DOJ?.split("T")[0] || "—"}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{employee.ROLE || "—"}</td>
                        </>
                      )}

                      {/* Additional data for Rejected status */}
                      {statusFilter === "Rejected" && (
                        <>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{employee.CONDUCTED_BY || "—"}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">{employee.REJECTION_REASON || "—"}</td>
                        </>
                      )}

                      {statusFilter === "Requested" && (
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 space-x-2">
                          <button
                            onClick={() => handleSelectClick(employee)}
                            className="text-green-600 hover:text-green-800 font-medium text-sm px-3 py-1 rounded-md hover:bg-green-100 transition-colors border-r border-gray-200"
                          >
                            Select
                          </button>
                          <button
                            onClick={() => handleRejectClick(employee)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1 rounded-md hover:bg-red-100 transition-colors border-r border-gray-200"
                          >
                            Reject
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="20" className="text-center text-gray-500">
                      <div className="bg-white p-6 rounded-xl shadow-inner border-2 border-dashed border-gray-200">
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-medium">No Interview records found</span>
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
      </div>
    </div>
  );
};

export { Interview };  
