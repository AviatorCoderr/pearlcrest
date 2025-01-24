import React, { useState, useEffect} from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const [electionStatus, setElectionStatus] = useState("Loading...");
  const [auditLogs, setAuditLogs] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/ele/ele-status")
      .then((response) => {
        console.log(response)
        setElectionStatus(response.data.data); // Assume the API returns { status: "Ongoing" }
      })
      .catch((error) => {
        console.error("Error fetching election status:", error);
        setElectionStatus("Error"); // Fallback in case of an error
      });
      axios.get("/api/v1/ele/get-logs").then((response) => {
        console.log(response.data.data)
      setAuditLogs(response.data.data);
    });
  }, []);

  // Functions to handle election actions
  const handleStartElection = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will start the election. Voters can now cast their votes.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Start Election",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post("/api/v1/ele/start-election").then(() => {
          setElectionStatus("Ongoing");
          Swal.fire("Started!", "The election has been started.", "success");
        });
      }
    });
  };

  const handleCloseElection = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will close the election. No more votes can be cast.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Close Election",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post("/api/v1/ele/end-election").then(() => {
          setElectionStatus("Closed");
          Swal.fire("Closed!", "The election has been closed.", "success");
        });
      }
    });
  };

  const handleStartCounting = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will start vote counting.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes, Start Counting",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post("/api/v1/ele/count-votes").then(() => {
          setElectionStatus("Counting");
          Swal.fire("Counting Started!", "Vote counting is now in progress.", "success");
        });
      }
    });
  };

  const handleDeclareResults = () => {
    axios.get("/api/v1/ele/results").then((response) => {
      setResults(response.data.results);
      Swal.fire("Results Declared!", "The election results are now available.", "success");
    });
  };

  const fetchAuditLogs = () => {
    axios.get("/api/v1/ele/get-logs").then((response) => {
        console.log(response.data.data)
      setAuditLogs(response.data.data);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="bg-white shadow-md p-6 rounded-lg mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Election Officer Dashboard</h1>
          <p className="text-gray-500">Manage elections and oversee the process.</p>
        </div>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          onClick={() => navigate("/logout")}
        >
          Logout
        </button>
      </header>

      {/* Election Status */}
      <section className="bg-white shadow-md p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Election Status</h2>
        <p className="text-lg font-medium">
          Current Status:{" "}
          <span
            className={`px-3 py-1 rounded-lg ${
              electionStatus === "Not Started"
                ? "bg-gray-300 text-gray-800"
                : electionStatus === "Ongoing"
                ? "bg-blue-300 text-blue-800"
                : electionStatus === "Counting"
                ? "bg-yellow-300 text-yellow-800"
                : "bg-green-300 text-green-800"
            }`}
          >
            {electionStatus}
          </span>
        </p>
      </section>

      {/* Election Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button
          className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-md hover:bg-blue-700"
          onClick={handleStartElection}
          disabled={electionStatus !== "not started"}
        >
          Start Election
        </button>
        <button
          className="bg-red-600 text-white px-6 py-4 rounded-lg shadow-md hover:bg-red-700"
          onClick={handleCloseElection}
          disabled={electionStatus !== "Ongoing"}
        >
          Close Election
        </button>
        <button
          className="bg-yellow-600 text-white px-6 py-4 rounded-lg shadow-md hover:bg-yellow-700"
          onClick={handleStartCounting}
          disabled={electionStatus !== "finished"}
        >
          Start Counting
        </button>
        <button
          className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-md hover:bg-green-700"
          onClick={handleDeclareResults}
          disabled={electionStatus !== "finished"}
        >
          Declare Results
        </button>
      </section>

      {/* Audit Logs */}
      <section className="bg-white shadow-md p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Audit Logs</h2>
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
            onClick={fetchAuditLogs}
          >
            Refresh Logs
          </button>
        </div>
        <div className="overflow-auto max-h-96">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border border-gray-300">Timestamp</th>
                <th className="p-3 text-left border border-gray-300">Voter Name</th>
                <th className="p-3 text-left border border-gray-300">Action</th>
                <th className="p-3 text-left border border-gray-300">Description</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, index) => (
                <tr key={index}>
                  <td className="p-3 border border-gray-300">{new Date(log.auditTimestamp).toLocaleString()}</td>
                  <td className="p-3 border border-gray-300">{log?.userId?.flatnumber+" "+log?.userId?.name}</td>
                  <td className="p-3 border border-gray-300">{log.action}</td>
                  <td className="p-3 border border-gray-300">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Results */}
      {results.length > 0 && (
        <section className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Election Results</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border border-gray-300">Position</th>
                <th className="p-3 text-left border border-gray-300">Candidate</th>
                <th className="p-3 text-left border border-gray-300">Votes</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td className="p-3 border border-gray-300">{result.position}</td>
                  <td className="p-3 border border-gray-300">{result.candidate}</td>
                  <td className="p-3 border border-gray-300">{result.votes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
