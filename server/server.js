import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const port = 3080;
const logDirectory = path.join("./", "logs");

app.use(express.json());
app.use(cors({ origin: true }));

// Function to parse log content from a single file
function parseLogContent(content) {
    return content
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line));
}

// Function to aggregate log data for each file and return comparison result
function aggregateLogs(logEntries, fileName) {
    const result = {
        file: fileName,
        LIT_NETWORK: "",
        totalRuns: 0,
        averageDuration_v6_4_10: 0,
        averageDuration_v6_4_8: 0,
        successfulRuns_v6_4_10: 0,
        successfulRuns_v6_4_8: 0,
        failedRuns_v6_4_10: 0,
        failedRuns_v6_4_8: 0,
    };

    logEntries.forEach((entry) => {
        result.LIT_NETWORK = entry.LIT_NETWORK;
        result.totalRuns = entry.totalRuns;

        if (entry.sdk === "v_6_4_10") {
            result.averageDuration_v6_4_10 = entry.averageDuration;
            result.successfulRuns_v6_4_10 = entry.successfulRuns;
            result.failedRuns_v6_4_10 = entry.failedRuns;
        }

        if (entry.sdk === "v_6_4_8") {
            result.averageDuration_v6_4_8 = entry.averageDuration;
            result.successfulRuns_v6_4_8 = entry.successfulRuns;
            result.failedRuns_v6_4_8 = entry.failedRuns;
        }
    });

    return result;
}

app.post("/testConnect/", (req, res) => {
    const { TOTAL_RUNS } = req.body;
    console.log(`running tests ${TOTAL_RUNS} times`);

    exec(
        `TOTAL_RUNS=${TOTAL_RUNS} npm run test-client`,
        { cwd: __dirname },
        (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                res.status(500).send(
                    `Error executing command: ${error.message}`
                );
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                res.status(500).send(`Error during execution: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            res.json({ message: `Command executed successfully:\n${stdout}` });
        }
    );
    res.status(500).send(`Failed to execute npm command`);
});

// Endpoint to compare logs and return aggregated results for each log file
app.get("/logs/comparison", (req, res) => {
    fs.readdir(logDirectory, (err, files) => {
        if (err) {
            return res.status(500).send("Unable to read log directory.");
        }

        const comparisonResults = [];

        files
            .filter((file) => file.endsWith(".log"))
            .forEach((file) => {
                const filePath = path.join(logDirectory, file);
                const content = fs.readFileSync(filePath, "utf8");
                const logEntries = parseLogContent(content);

                // Aggregate logs for each file
                const result = aggregateLogs(logEntries, file);
                comparisonResults.push(result);
            });

        res.json(comparisonResults);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
