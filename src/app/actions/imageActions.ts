"use server";

export interface GenerateImageResponse {
    success: boolean;
    imageUrl?: string;
    error?: string;
}

export async function generateImage(prompt: string): Promise<GenerateImageResponse> {
    try {
        const response = await fetch("http://localhost:3000/api/generate-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                API_KEY: process.env.API_KEY || "",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Server Error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to generate image",
        };
    }
}

export async function loadImages(): Promise<string[] | undefined> {
    try {
        const response = await fetch("http://localhost:3000/api/list-images", {
            method: "GET",
            headers: {
                API_KEY: process.env.API_KEY || "",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch images. Status: ${response.status}`);
        }
        const data = await response.json();
        return data.imageUrls;
    } catch (error) {
        console.error("Error loading images:", error);
    }
}
