"use client";
import axios from "axios";
import { logEntries as logEntries_v6_4_10 } from "../../server/logs/v6.4.10/datil-dev-client-connect-test-log";
import { logEntries as logEntries_v6_4_8 } from "../../server/logs/v6.4.8/datil-dev-client-connect-test-log";
import { useState } from "react";

export default function Home() {
    const [results, setResults] = useState("");

    async function hitTestConnect() {
        setResults("Loading...");
        try {
            const response = await axios.post(
                "http://localhost:3080/testConnect/"
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
        <div>
            <button onClick={hitTestConnect}>Test Connection</button>
            {results == "" ? (
                <div>Nothing to show</div>
            ) : results == "Loading..." ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <p>Time Results for {logEntries_v6_4_10[0].totalRuns} runs (Check Console)</p>
                    <p>v6.4.10: {logEntries_v6_4_10[0]?.averageDuration} ms</p>
                    <p>v6.4.8: {logEntries_v6_4_8[0]?.averageDuration} ms </p>
                </div>
            )}
        </div>
    );
}
