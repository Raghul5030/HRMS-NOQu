import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Itsupportdashboard = () => {
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [itComment, setItComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchDefects = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/asset-defects`);
      setDefects(response.data);
    } catch (error) {
      console.error("Error fetching defects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefects();
  }, []);

  const handleUpdateClick = (defect) => {
    setSelectedDefect(defect);
    setNewStatus(defect.status);
    setItComment(defect.it_comment || "");
    setOpenModal(true);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/update-defect-status`, {
        id: selectedDefect.id,
        status: newStatus,
        it_comment: itComment
      });
      toast.success("Status updated successfully", { position: 'top-right' });
      setOpenModal(false);
      fetchDefects();
    } catch (error) {
      toast.error("Failed to update status", { position: 'top-right' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">IT Support Dashboard</h1>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Total Issues: {defects.length}
        </span>
      </div>

      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-yellow-400 border-b border-yellow-500">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-yellow-900 border-r border-yellow-500">Employee</th>
              <th className="px-6 py-4 text-sm font-bold text-yellow-900 border-r border-yellow-500">Asset</th>
              <th className="px-6 py-4 text-sm font-bold text-yellow-900 border-r border-yellow-500">Description</th>
              <th className="px-6 py-4 text-sm font-bold text-yellow-900 border-r border-yellow-500">Priority</th>
              <th className="px-6 py-4 text-sm font-bold text-yellow-900 border-r border-yellow-500">IT Comment</th>
              <th className="px-6 py-4 text-sm font-bold text-yellow-900 border-r border-yellow-500">Status</th>
              <th className="px-6 py-4 text-sm font-bold text-yellow-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-10">Loading defect reports...</td></tr>
            ) : defects.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-10 text-gray-500">No defects reported yet.</td></tr>
            ) : (
              defects.map((defect) => (
                <tr key={defect.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{defect.employee_name}</p>
                    <p className="text-xs text-gray-500">{defect.employee_email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-semibold">{defect.asset_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={defect.defect_description}>
                    {defect.defect_description}
                  </td>
                  <td className="px-6 py-4">
                    {defect.priority === 'P1' && (
                      <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                        P1 - High
                      </span>
                    )}
                    {defect.priority === 'P2' && (
                      <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-200">
                        P2 - Med
                      </span>
                    )}
                    {defect.priority === 'P3' && (
                      <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200">
                        P3 - Low
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 italic max-w-xs truncate">
                    {defect.it_comment || "---"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1
                        ${defect.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                          defect.status === 'Asset Unavailable' ? 'bg-yellow-100 text-yellow-700' :
                            defect.status === 'Need to Replace' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full 
                          ${defect.status === 'Resolved' ? 'bg-green-500' :
                            defect.status === 'Asset Unavailable' ? 'bg-yellow-500' :
                              defect.status === 'Need to Replace' ? 'bg-red-500' :
                                'bg-gray-400'}`}></span>
                        {defect.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleUpdateClick(defect)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-4"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Update Status Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Update Issue Status</h2>
              <button onClick={() => setOpenModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmitUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Pending', 'In Progress', 'Resolved', 'Asset Unavailable', 'Need to Replace'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewStatus(s)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${newStatus === s
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">IT Support Comment</label>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm transition-all"
                  rows="4"
                  placeholder="Explain the resolution or status change..."
                  value={itComment}
                  onChange={(e) => setItComment(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Itsupportdashboard;