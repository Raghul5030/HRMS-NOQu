import { useEffect, useState } from "react";
import axios from "axios";

const IssueStatus = () => {
    const [defects, setDefects] = useState([]);
    const [loading, setLoading] = useState(true);
    const employee_id = localStorage.getItem("employee_id");

    useEffect(() => {
        const fetchMyDefects = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/my-defects?employee_id=${employee_id}`);
                setDefects(response.data);
            } catch (error) {
                console.error("Error fetching my defects:", error);
            } finally {
                setLoading(false);
            }
        };
        if (employee_id) {
            fetchMyDefects();
        }
    }, [employee_id]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Issue Status</h1>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Total Reports: {defects.length}
                </span>
            </div>

            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-yellow-400 border-b border-yellow-500">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-yellow-900 border-r border-yellow-500">Asset</th>
                            <th className="px-6 py-4 text-sm font-bold text-yellow-900 border-r border-yellow-500">Issue Description</th>
                            <th className="px-6 py-4 text-sm font-bold text-yellow-900 border-r border-yellow-500">Priority</th>
                            <th className="px-6 py-4 text-sm font-bold text-yellow-900 border-r border-yellow-500">IT Feedback</th>
                            <th className="px-6 py-4 text-sm font-bold text-yellow-900 border-r border-yellow-500">Status</th>
                            <th className="px-6 py-4 text-sm font-bold text-yellow-900">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-10 text-sm">Loading your reports...</td></tr>
                        ) : defects.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-10 text-gray-500 text-sm">No issues reported yet.</td></tr>
                        ) : (
                            defects.map((defect) => (
                                <tr key={defect.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">{defect.asset_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={defect.defect_description}>
                                        {defect.defect_description}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${defect.priority === 'P1' ? 'bg-red-50 text-red-600 border-red-100' :
                                            defect.priority === 'P2' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                'bg-green-50 text-green-600 border-green-100'
                                            }`}>
                                            {defect.priority || 'P3'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 italic">
                                        {defect.it_comment || "Waiting for IT review..."}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm inline-flex items-center gap-1.5 ${defect.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                            defect.status === 'Asset Unavailable' ? 'bg-yellow-100 text-yellow-700' :
                                                defect.status === 'Need to Replace' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${defect.status === 'Resolved' ? 'bg-green-500 animate-pulse' :
                                                defect.status === 'Asset Unavailable' ? 'bg-yellow-500' :
                                                    defect.status === 'Need to Replace' ? 'bg-red-500' :
                                                        'bg-blue-500'
                                                }`}></span>
                                            {defect.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {new Date(defect.created_at).toLocaleDateString()}
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

export default IssueStatus;
