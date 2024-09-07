import { connectLitClient } from "../litNodeClient";
import { LitNetwork } from "@lit-protocol/constants";
import * as fs from "fs";
import * as path from "path";

const sdkV = "v_6_4_8";
const LIT_NETWORK = LitNetwork.DatilDev;
const TOTAL_RUNS = parseInt(process.env.TOTAL_RUNS || "1", 10);
const PARALLEL_RUNS = 1;
const DELAY_BETWEEN_TESTS = 0;
const timestamp = new Date().toISOString().split(".")[0].replace(/:/g, "-");
const LOG_FILE_PATH = `../logs/${LIT_NETWORK}-test-log-${timestamp}.log`;

jest.setTimeout(30000);

test("client connect batch testing", async () => {
    jest.setTimeout(1000000);
    const dir = path.dirname(LOG_FILE_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    const log = (entry: any) => {
        const logEntry = JSON.stringify({
            timestamp: new Date().toISOString(),
            ...entry,
        });
        fs.appendFileSync(LOG_FILE_PATH, logEntry + "\n");
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

            log(result);
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
        sdk: sdkV,
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
            sdk: sdkV,
            message: `${failedRuns.length} tests failed. Check the log file for details.`,
        });
    }

    console.log(`ran ${results.length} tests`);
});