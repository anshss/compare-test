"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface LogComparison {
    file: string;
    LIT_NETWORK: string;
    totalRuns: number;
    averageDuration_v6_4_10: number;
    averageDuration_v6_4_8: number;
    successfulRuns_v6_4_10: number;
    successfulRuns_v6_4_8: number;
    failedRuns_v6_4_10: number;
    failedRuns_v6_4_8: number;
}

export default function Home() {
    const [comparisons, setComparisons] = useState<LogComparison[]>([]);

    const baseUrl = `http://localhost:3080`;

    useEffect(() => {
        fetchComparisonResults();
    }, []);

    // Fetch log comparison results from the Express API
    async function fetchComparisonResults() {
        try {
            const res = await axios.get(`${baseUrl}/logs/comparison`);
            setComparisons(res.data);
        } catch (error) {
            console.error("Error fetching log comparisons:", error);
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-8">Log Comparison Results</h1>

            <h2 className="text-xl font-semibold mt-8 mb-4">Logs Table</h2>
            <table className="w-full border-collapse border border-black text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-black p-1">File</th>
                        <th className="border border-black p-1">Network</th>
                        <th className="border border-black p-1">Total Runs</th>
                        <th className="border border-black p-1">
                            Avg Duration v6.4.10 (ms)
                        </th>
                        <th className="border border-black p-1">
                            Avg Duration v6.4.8 (ms)
                        </th>
                        <th className="border border-black p-1">
                            Success v6.4.10
                        </th>
                        <th className="border border-black p-1">
                            Success v6.4.8
                        </th>
                        <th className="border border-black p-1">Failed v6.4.10</th>
                        <th className="border border-black p-1">Failed v6.4.8</th>
                    </tr>
                </thead>
                <tbody>
                    {comparisons.map((comparison) => (
                        <tr key={comparison.file} className="hover:bg-gray-50">
                            <td className="border border-black p-1">
                                {comparison.file}
                            </td>
                            <td className="border border-black p-1">
                                {comparison.LIT_NETWORK}
                            </td>
                            <td className="border border-black p-1">
                                {comparison.totalRuns}
                            </td>
                            <td className="border border-black p-1">
                                {comparison.averageDuration_v6_4_10}
                            </td>
                            <td className="border border-black p-1">
                                {comparison.averageDuration_v6_4_8}
                            </td>
                            <td className="border border-black p-1">
                                {comparison.successfulRuns_v6_4_10}
                            </td>
                            <td className="border border-black p-1">
                                {comparison.successfulRuns_v6_4_8}
                            </td>
                            <td className="border border-black p-1">
                                {comparison.failedRuns_v6_4_10}
                            </td>
                            <td className="border border-black p-1">
                                {comparison.failedRuns_v6_4_8}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}