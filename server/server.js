import express from "express";
import cors from "cors";
import { exec } from "child_process";
import path from "path";

const app = express();
const port = 3080;
const __dirname = path.resolve();

app.use(express.json());
app.use(cors({ origin: true }));

app.post("/testConnect/", (req, res) => {
    const { TOTAL_RUNS } = req.body;
    console.log(`running tests ${TOTAL_RUNS} times`)

    exec(`TOTAL_RUNS=${TOTAL_RUNS} npm run test-client`, { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            res.status(500).send(`Error executing command: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            res.status(500).send(`Error during execution: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.send(`Command executed successfully:\n${stdout}`);
    });
    // res.send("Command executed successfully");
});

app.get("/status", (req, res) => {
    res.send("server running!");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});