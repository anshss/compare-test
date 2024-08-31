import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";

export async function connectLitClient(_network: LitNetwork) {
    console.log("Connecting to Lit...");
    const litNodeClient = new LitNodeClient({
        litNetwork: _network,
        debug: false,
    });

    await litNodeClient.connect();
    console.log("Connected!");
}
