import React, { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCcw } from "lucide-react";

const ElectionResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/ele/result");
      if (response.data && response.data.data) {
        setResults(response.data.data);
      } else {
        setResults([]); // Set empty array if data is not present
      }
    } catch (error) {
      console.error("Failed to fetch election results:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupResultsByPost = () => {
    const grouped = results.reduce((acc, curr) => {
      if (!acc[curr.post]) acc[curr.post] = [];
      acc[curr.post].push(curr);
      return acc;
    }, {});
    return grouped;
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const groupedResults = groupResultsByPost();

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">Election Results</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={fetchResults}
          disabled={loading}
          className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 ${loading ? "opacity-50" : ""}`}
        >
          <RefreshCcw className={`mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {results.length === 0 ? (
        <div className="text-center text-gray-700 text-xl font-semibold bg-yellow-100 border border-yellow-400 rounded-lg py-6 px-4">
          Election results are still not declared. Please check back later.
        </div>
      ) : (
        Object.keys(groupedResults).map((post) => (
          <div key={post} className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">{post}</h2>

            <div className="bg-white shadow-md rounded-lg p-6">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Candidate Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Flat Number</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedResults[post]
                    .sort((a, b) => b.votes - a.votes)
                    .map((candidate) => (
                      <tr key={candidate._id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{candidate.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{candidate.flatnumber}</td>
                        <td className="border border-gray-300 px-4 py-2">{candidate.votes}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ElectionResults;
