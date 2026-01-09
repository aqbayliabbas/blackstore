"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
    images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-zinc-100 border border-zinc-200">
                <Image
                    src={images[selectedImage]}
                    alt="Product image"
                    fill
                    className="object-cover transition-all duration-500"
                    priority
                />
            </div>
            <div className="grid grid-cols-5 gap-3">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${selectedImage === index
                            ? "border-black opacity-100 scale-95"
                            : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                    >
                        <Image
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
