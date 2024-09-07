import { connectLitClient } from "../litNodeClient";
import { LitNetwork } from "@lit-protocol/constants";
import * as fs from "fs";
import * as path from "path";

const LIT_NETWORK = LitNetwork.DatilDev;
const TOTAL_RUNS = parseInt(process.env.TOTAL_RUNS || "1", 10);
const PARALLEL_RUNS = 1;
const DELAY_BETWEEN_TESTS = 0;
// const LOG_FILE_PATH = `../logs/v6.4.10/${LIT_NETWORK}-client-connect-test-log.js`;
const timestamp = new Date().toISOString().split(".")[0].replace(/:/g, "-");
const LOG_FILE_PATH = `../logs/${LIT_NETWORK}-pkp-sign-test-log-${timestamp}.js`;

let logFileHandle: number | null = null;
let logEntries: any[] = [];

jest.setTimeout(30000);

test("client connect batch testing", async () => {
    jest.setTimeout(1000000);
    const dir = path.dirname(LOG_FILE_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    // fs.writeFileSync(LOG_FILE_PATH, "");

    const log = (entry: any) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            ...entry,
        };
        logEntries.push(logEntry);
        console.log(JSON.stringify(logEntry));
    };

    const runTest = async (index: number) => {
        try {
            const startTime = Date.now();

            await connectLitClient(LIT_NETWORK);

            const endTime = Date.now();
            const duration = endTime - startTime;

            const result = {
                type: "test_result",
                index: index + 1,
                totalRuns: TOTAL_RUNS,
                status: "success",
                duration,
            };

            return result;
        } catch (error) {
            const errorResult = {
                type: "test_result",
                index: index + 1,
                totalRuns: TOTAL_RUNS,
                status: "error",
                error: (error as Error).message,
                stack: (error as Error).stack,
                fullError: JSON.stringify(error),
            };
            log(errorResult);
            return errorResult;
        }
    };

    const results: any[] = [];

    for (let i = 0; i < TOTAL_RUNS; i += PARALLEL_RUNS) {
        const batch = Array(Math.min(PARALLEL_RUNS, TOTAL_RUNS - i))
            .fill(null)
            .map((_, index) => {
                return new Promise((resolve) => {
                    setTimeout(async () => {
                        resolve(await runTest(i + index));
                    }, index * DELAY_BETWEEN_TESTS);
                });
            });

        const batchResults = await Promise.all(batch);
        results.push(...batchResults);
    }

    const successfulRuns = results.filter((r) => r.status === "success");
    const failedRuns = results.filter((r) => r.status === "error");

    const summary = {
        type: "test_summary",
        status: "test_completed",
        LIT_NETWORK,
        totalRuns: TOTAL_RUNS,
        successfulRuns: successfulRuns.length,
        failedRuns: failedRuns.length,
        averageDuration:
            successfulRuns.length > 0
                ? successfulRuns.reduce((sum, r) => sum + r.duration, 0) /
                  successfulRuns.length
                : 0,
    };

    log(summary);

    if (failedRuns.length > 0) {
        log({
            type: "test_failure_summary",
            message: `${failedRuns.length} tests failed. Check the log file for details.`,
        });
    }

    console.log(`ran ${results.length} tests`);

    // Write logEntries array to the file with export keyword
    const logContent = `export const logEntries_v6_4_10 = ${JSON.stringify(logEntries, null, 2)};`;
    // fs.writeFileSync(LOG_FILE_PATH, logContent, "utf-8");
    fs.appendFileSync(LOG_FILE_PATH, logContent + "\n", "utf-8");

    if (logFileHandle !== null) {
        fs.closeSync(logFileHandle);
    }
});