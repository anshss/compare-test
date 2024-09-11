import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";

export async function connectLitClient(_network: LitNetwork) {
    try {
        console.log("Connecting to Lit...");
        const litNodeClient = new LitNodeClient({
            litNetwork: _network,
        });
    
        await litNodeClient.connect();
        console.log("Connected!");
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }

}
