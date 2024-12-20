"use server";

import ImageGallery from "@/app/components/ImageGallery";
import {generateImage, loadImages} from "@/app/actions/imageActions";

export default async function HomePage() {
    return <ImageGallery generateImage={generateImage} loadImages={loadImages}/>;
}