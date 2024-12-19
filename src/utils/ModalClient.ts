import axios from "axios";

const MODAL_API_URL = process.env.MODAL_API_URL;
const API_KEY = process.env.API_KEY;

export async function fetchImageFromModal(prompt: string): Promise<Buffer> {
    try {
        const response = await axios.get(MODAL_API_URL, {
            params: {prompt},
            headers: {
                "api-key": API_KEY,
            },
            responseType: "arraybuffer",
        });

        return Buffer.from(response.data);
    } catch (error) {
        console.error("Error fetching image from Modal API:", error);
        throw new Error("Failed to fetch image from Modal API");
    }
}