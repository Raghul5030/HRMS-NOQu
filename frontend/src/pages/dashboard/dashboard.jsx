import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [employeeCount, setEmployeeCount] = useState(0);
  const [activeEmployeeCount, setActiveEmployeeCount] = useState(0);
  const [onboardingCount, setOnboardingCount] = useState(0);
  const [recentEmployees, setRecentEmployees] = useState([]);
  
  // Interview statistics
  const [interviewStats, setInterviewStats] = useState({
    total: 0,
    requested: 0,
    selected: 0,
    rejected: 0
  });
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [recentlyProcessed, setRecentlyProcessed] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const fetchDashboardData = async () => {
      try {
        // Employee data
        const empRes = await axios.get("http://localhost:3000/getEmployee");
        const onboardRes = await axios.get("http://localhost:3000/getUsers");

        setEmployeeCount(empRes.data.length);
        setActiveEmployeeCount(empRes.data.filter(emp => emp.EMPLOYEE_ACTIVE_STATUS).length);
        setOnboardingCount(onboardRes.data.length);

        const sortedEmployees = [...empRes.data].sort(
          (a, b) => new Date(b.DATE_OF_JOINING) - new Date(a.DATE_OF_JOINING)
        ).slice(0, 5);
        setRecentEmployees(sortedEmployees);

        // Interview data
        const interviewRes = await axios.get("http://localhost:3000/getform");
        const totalInterviews = interviewRes.data.length;
        
        setInterviewStats({
          total: totalInterviews,
          requested: interviewRes.data.filter(i => i.STATUS === "Requested").length,
          selected: interviewRes.data.filter(i => i.STATUS === "Selected").length,
          rejected: interviewRes.data.filter(i => i.STATUS === "Rejected").length
        });


        
        const upcoming = interviewRes.data
        .filter(i => i.STATUS === "Requested")
        .slice(0, 5);

        
        setUpcomingInterviews(upcoming);

        // Recently processed interviews
        const processed = [...interviewRes.data]
          .filter(i => i.STATUS !== "Requested")
          .slice(0, 5);
        
        setRecentlyProcessed(processed);

      } catch (error) {
        toast.error("Error loading dashboard data");
        console.error("Dashboard error:", error);
      }
    };

    fetchDashboardData();
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const formattedTime = currentTime.toLocaleTimeString();

  const getStatusColor = (status) => {
    switch(status) {
      case "Selected": return "bg-green-100 text-green-700";
      case "Rejected": return "bg-red-100 text-red-700";
      case "Requested": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-10 bg-gradient-to-tr from-sky-50 to-yellow-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-3xl font-bold font-sans text-indigo-800">HR Dashboard</div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-700">{formattedTime}</div>
          <div className="text-md text-gray-500">{formattedDate}</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {/* Employee Cards */}
        <div className="rounded-xl shadow-md p-6 text-white bg-gradient-to-br from-blue-500 to-blue-700 hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">Total Employees</h3>
              <p className="text-4xl mt-1">{employeeCount}</p>
            </div>
          </div>
          <Link to="/employees" className="text-sm mt-8 block text-white underline hover:opacity-80">
            View all employees →
          </Link>
        </div>

        <div className="rounded-xl shadow-md p-6 text-white bg-gradient-to-br from-green-400 to-green-600 hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">Active Employees</h3>
              <p className="text-4xl mt-1">{activeEmployeeCount}</p>
              <p className="text-sm">{employeeCount > 0 ? `${Math.round((activeEmployeeCount / employeeCount) * 100)}%` : '0%'}</p>
            </div>
          </div>
          <Link to="/employees" className="text-sm mt-3 block text-white underline hover:opacity-80">
            View active employees →
          </Link>
        </div>

        {/* Interview Cards */}
        <div className="rounded-xl shadow-md p-6 text-white bg-gradient-to-br from-purple-500 to-purple-700 hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">Total Interviews</h3>
              <p className="text-4xl mt-1">{interviewStats.total}</p>
            </div>
          </div>
          <Link to="/interview" className="text-sm mt-8 block text-white underline hover:opacity-80">
            View all interviews →
          </Link>
        </div>

        <div className="rounded-xl shadow-md p-6 text-white bg-gradient-to-br from-pink-500 to-pink-700 hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">Interview Status</h3>
              <div className="flex justify-between mt-2 text-sm">
                <span className="bg-white/20 px-2 py-1 rounded">Request: {interviewStats.requested}</span>
                <span className="bg-white/20 px-2 py-1 rounded ml-2">Select: {interviewStats.selected}</span>
                <span className="bg-white/20 px-2 py-1 rounded ml-2">Reject: {interviewStats.rejected}</span>
              </div>
            </div>
          </div>
          <Link to="/interview" className="text-sm mt-5 block text-white underline hover:opacity-80">
            Manage interviews →
          </Link>
        </div>
      </div>

      {/* Recent Employees and Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Recent Employees */}
        <div className="bg-white rounded-xl shadow-md p-6 ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-700">Recently Onboarded Employees</h2>
            <Link to="/employees" className="text-indigo-600 hover:underline text-sm">View All</Link>
          </div>
          <div>
            <table className="w-full border  rounded-lg overflow-hidden text-sm">
              <thead className="bg-gradient-to-r from-teal-400 to-sky-500 text-white uppercase text-xs">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Joining</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.length > 0 ? (
                  recentEmployees.map((emp, idx) => (
                    <tr key={idx} className="border-t hover:bg-blue-50">
                      <td className="px-4 py-2">{emp.NAME}</td>
                      <td className="px-4 py-2">{emp.EMPLOYEE_ID}</td>
                      <td className="px-4 py-2">{emp.DEPARTMENT}</td>
                      <td className="px-4 py-2">{emp.DATE_OF_JOINING?.split("T")[0]}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${emp.EMPLOYEE_ACTIVE_STATUS ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {emp.EMPLOYEE_ACTIVE_STATUS ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">No recent employees</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-700"> Upcoming Interviews</h2>
            <Link to="/interview" className="text-indigo-600 hover:underline text-sm">View All</Link>
          </div>
          <div >
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
              <thead className="bg-gradient-to-r from-orange-400 to-amber-500 text-white uppercase text-xs">
                <tr>
                  <th className="px-4 py-2 text-left">Candidate</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Mode</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingInterviews.length > 0 ? (
                  upcomingInterviews.map((interview, idx) => (
                    <tr key={idx} className="border-t hover:bg-orange-50">
                      <td className="px-4 py-2">{interview.NAME}</td>
                      <td className="px-4 py-2">{interview.DESIGNATION}</td>
                      <td className="px-4 py-2">{interview.DOI?.split("T")[0]}</td>
                      <td className="px-4 py-2">{interview.INTERVIEW_MODE}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(interview.STATUS)}`}>
                          {interview.STATUS}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">No upcoming interviews</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recently Processed Interviews */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700"> Recently Processed Interviews</h2>
          <Link to="/interview" className="text-indigo-600 hover:underline text-sm">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gradient-to-r from-violet-400 to-purple-500 text-white uppercase text-xs">
              <tr>
                <th className="px-4 py-2 text-left">Candidate</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Conducted By</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {recentlyProcessed.length > 0 ? (
                recentlyProcessed.map((interview, idx) => (
                  <tr key={idx} className="border-t hover:bg-purple-50">
                    <td className="px-4 py-2">{interview.NAME}</td>
                    <td className="px-4 py-2">{interview.DESIGNATION || interview.ROLE}</td>
                    <td className="px-4 py-2">{interview.DOI?.split("T")[0]}</td>
                    <td className="px-4 py-2">{interview.CONDUCTED_BY || "—"}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(interview.STATUS)}`}>
                        {interview.STATUS}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {interview.STATUS === "Selected" ? (
                        <span className="text-green-600">CTC: {interview.CTC}, DOJ: {interview.DOJ?.split("T")[0]}</span>
                      ) : (
                        <span className="text-red-600 truncate max-w-xs" title={interview.REJECTION_REASON}>
                          {interview.REJECTION_REASON || "No reason provided"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">No recently processed interviews</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/onboarding"
          className="p-4 bg-violet-300 text-violet-900 font-semibold rounded-lg hover:bg-violet-500 hover:text-white transition"
        >
          Add Onboarding
        </Link>
        <Link
          to="/employees"
          className="p-4 bg-emerald-300 text-emerald-900 font-semibold rounded-lg hover:bg-emerald-500 hover:text-white transition"
        >
          Manage Employees
        </Link>
        <Link
          to="/interview"
          className="p-4 bg-amber-300 text-amber-900 font-semibold rounded-lg hover:bg-amber-500 hover:text-white transition"
        >
          Schedule Interview
        </Link>
        <Link
          to="/interview"
          className="p-4 bg-rose-300 text-rose-900 font-semibold rounded-lg hover:bg-rose-500 hover:text-white transition"
        >
          Review Candidates
        </Link>
      </div>
    </div>
  );
};

export { Dashboard };