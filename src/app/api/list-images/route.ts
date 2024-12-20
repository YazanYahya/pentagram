import { NextResponse } from "next/server";
import { listImagesFromS3 } from "@/utils/S3Client";

export async function GET(request: Request) {
    try {
        const apiKey = request.headers.get("API_KEY");
        if (apiKey !== process.env.API_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const imageUrls = await listImagesFromS3();

        return NextResponse.json(
            { success: true, imageUrls },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching images:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch images from S3" },
            { status: 500 }
        );
    }
}
