'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductImageGalleryProps {
    images: Array<{ url: string; alt: string }>;
    productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">No image available</p>
            </div>
        );
    }

    const currentImage = images[selectedIndex];

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden group">
                <Image
                    src={currentImage.url}
                    alt={currentImage.alt || productName}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    priority={selectedIndex === 0}
                />

                {/* Navigation Arrows - Only show if multiple images */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                    </>
                )}

                {/* Zoom Icon */}
                <button
                    onClick={() => setIsZoomed(true)}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Zoom image"
                >
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {selectedIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${index === selectedIndex
                                    ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <Image
                                src={image.url}
                                alt={`${productName} thumbnail ${index + 1}`}
                                width={80}
                                height={80}
                                className="w-full h-full object-contain p-1 bg-white"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen Modal */}
            {isZoomed && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsZoomed(false)}
                >
                    <div className="relative max-w-7xl max-h-full">
                        <Image
                            src={currentImage.url}
                            alt={currentImage.alt || productName}
                            width={1200}
                            height={1200}
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                        <button
                            onClick={() => setIsZoomed(false)}
                            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                            aria-label="Close zoom"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
