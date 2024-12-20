"use client";

import { useEffect, useState } from "react";

interface ImageGalleryProps {
    generateImage: (text: string) => Promise<{ success: boolean; imageUrl?: string; error?: string }>;
    loadImages: () => Promise<string[] | undefined>;
}

export default function ImageGallery({ generateImage, loadImages }: ImageGalleryProps) {
    const [inputText, setInputText] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const imageUrls = await loadImages();
                if (imageUrls) {
                    setImages(imageUrls);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchImages();
    }, [loadImages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await generateImage(inputText);
            if (!result.success) {
                throw new Error(result.error || "Failed to generate image");
            }
            if (result.imageUrl) {
                setImages((prevImages) => [result.imageUrl, ...prevImages]);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setInputText("");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
            <main className="w-full max-w-3xl">
                <form onSubmit={handleSubmit} className="w-full mb-12">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1 p-4 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500 shadow-md"
                            placeholder="Describe the image you want to generate..."
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 transition-transform transform hover:scale-110 disabled:opacity-50 shadow-lg"
                        >
                            {isLoading ? "Generating..." : "Generate"}
                        </button>
                    </div>
                </form>

                <div className="flex flex-wrap justify-center gap-6">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className="w-[240px] h-[180px] relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                        >
                            <img
                                src={src}
                                alt={`Generated ${index}`}
                                className="w-full h-full object-cover rounded-lg hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
