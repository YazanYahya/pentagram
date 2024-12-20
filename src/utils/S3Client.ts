import { ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const S3_BUCKET = process.env.S3_BUCKET || "";
const S3_REGION = process.env.S3_REGION || "";
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || "";
const S3_SECRET_KEY = process.env.S3_SECRET_KEY || "";
const S3_ENDPOINT = process.env.S3_ENDPOINT || "";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
    },
});

export async function uploadImageToS3(imageData: Buffer): Promise<string> {
    const fileName = `images/${uuidv4()}.jpg`;

    const uploadParams = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Body: imageData,
        ContentType: "image/jpeg",
    };

    try {
        await s3Client.send(new PutObjectCommand(uploadParams));
        return `${R2_PUBLIC_URL}/${fileName}`;
    } catch (error) {
        console.error("Error uploading image to S3:", error);
        throw new Error("Failed to upload image to S3");
    }
}

export async function listImagesFromS3(): Promise<string[]> {
    try {
        const command = new ListObjectsV2Command({
            Bucket: S3_BUCKET,
            Prefix: "images/",
        });

        const response = await s3Client.send(command);

        const imageKeys = response.Contents?.map((item) => `${R2_PUBLIC_URL}/${item.Key}`) || [];

        return imageKeys;
    } catch (error) {
        console.error("Error getting images from S3:", error);
        throw new Error("Failed to get images from S3");
    }
}