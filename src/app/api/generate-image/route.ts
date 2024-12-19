import {NextResponse} from "next/server";
import {fetchImageFromModal} from "@/utils/ModalClient";
import {uploadImageToS3} from "@/utils/S3Client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {prompt} = body;

        const imageData = await fetchImageFromModal(prompt);
        const imageUrl = await uploadImageToS3(imageData);

        return NextResponse.json(
            {success: true, imageUrl},
            {status: 200}
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            {success: false, error: error.message || "Failed to process request"},
            {status: 500}
        );
    }
}