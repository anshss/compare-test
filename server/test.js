import axios from "axios";

async function hitTestConnect() {
    try {
        const response = await axios.post("http://localhost:3080/testConnect/");
        console.log(`Response from /testConnect/: ${response.data}`);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

hitTestConnect();
