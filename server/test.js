import axios from "axios";

const testComparisonEndpoint = async () => {
    const response = await axios.get("http://localhost:3080/logs/comparison");
    console.log("Status:", response.status);
    console.log("Data:", response.data);
};

testComparisonEndpoint();
