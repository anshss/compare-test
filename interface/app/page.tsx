"use client";
import axios from "axios";
import { logEntries as logEntries_v6_4_10 } from "../../server/logs/v6.4.10/datil-dev-client-connect-test-log";
import { logEntries as logEntries_v6_4_8 } from "../../server/logs/v6.4.8/datil-dev-client-connect-test-log";
import { useState } from "react";

export default function Home() {
    const [results, setResults] = useState("");
    const [totalRuns, setTotalRuns] = useState(1);

    async function hitTestConnect() {
        setResults("Loading...");
        try {
            const response = await axios.post(
                "http://localhost:3080/testConnect/",
                { TOTAL_RUNS: totalRuns }
            );
            console.log(`Response from /testConnect/: ${response.data}`);
            const responseObj = JSON.parse(response.data);
            setResults(responseObj);
        } catch (error) {
            console.error(`Error: ${error}`);
            setResults("Failed");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="mb-4">
                <p className="text-gray-700 mb-2">Enter the number of runs</p>
                <input
                    onChange={(e) => setTotalRuns(parseInt(e.target.value))}
                    className="text-black border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
            <button
                onClick={hitTestConnect}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
            >
                Test Connection
            </button>
            <div className="mt-6">
                {results === "" ? (
                    <div className="text-gray-500">Nothing to show</div>
                ) : results === "Loading..." ? (
                    <div className="text-gray-500">Loading...</div>
                ) : (
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <p className="text-black text-lg mb-2">
                            Time Results for {logEntries_v6_4_10[0].totalRuns}{" "}
                            runs (Check Console)
                        </p>
                        <p className="text-gray-800">
                            v6.4.10: {logEntries_v6_4_10[0]?.averageDuration} ms
                        </p>
                        <p className="text-gray-800">
                            v6.4.8: {logEntries_v6_4_8[0]?.averageDuration} ms
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
