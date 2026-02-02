import { useEffect, useState } from "react";
import axios from "axios";

const Itsupportdashboard = () => {
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDefects = async () => {
      try {
        // Ensure this matches your backend URL
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/asset-defects`);
        setDefects(response.data);
      } catch (error) {
        console.error("Error fetching defects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDefects();
  }, []);

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
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Reported By</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Asset</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Description</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-10">Loading defect reports...</td></tr>
            ) : defects.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-10 text-gray-500">No defects reported yet.</td></tr>
            ) : (
              defects.map((defect) => (
                <tr key={defect.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{defect.employee_name}</p>
                    <p className="text-xs text-gray-500">{defect.employee_email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-semibold">{defect.asset_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{defect.defect_description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(defect.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${defect.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                      {defect.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Itsupportdashboard;