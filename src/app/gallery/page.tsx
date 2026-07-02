import fs from "fs";
import path from "path";
import GalleryContent from "@/components/GalleryContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gallery | Vishwa Wellness",
    description: "Experience the healing power of Vishwa Wellness through our visual gallery. Explore Agnihotra therapy, Panchakarma, and holistic wellness moments.",
};

export default function GalleryPage() {
    const galleryDir = path.join(process.cwd(), "public", "gallery");
    let images: string[] = [];

    try {
        if (fs.existsSync(galleryDir)) {
            images = fs.readdirSync(galleryDir)
                .filter(file => /\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$/.test(file))
                .map(file => `/gallery/${file}`);
        }
    } catch (error) {
        console.error("Error reading gallery directory:", error);
    }

    return (
        <main className="min-h-screen bg-[#FDFCF8] pt-24 pb-24 overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full"></div>
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                {images.length > 0 ? (
                    <GalleryContent images={images} />
                ) : (
                    <div className="text-center py-20">
                        <header className="text-center mb-12 max-w-4xl mx-auto">
                            <span className="text-accent text-xs font-bold uppercase tracking-[0.5em] mb-4 block">
                                The Healing Narrative
                            </span>
                            <h1 className="text-5xl md:text-7xl font-heading font-bold text-dark mb-8 tracking-tight leading-[1.1]">
                                Sacred Spaces <br />
                                <span className="text-muted font-light italic">&</span> Healing Moments
                            </h1>
                            <div className="w-16 h-[2px] bg-accent/30 mx-auto mb-10"></div>
                            <p className="text-lg md:text-xl text-muted font-heading leading-relaxed italic">
                                "A curation of moments reflecting the purity of Agnihotra, the essence of Ayurvedic healing, and the serenity of holistic wellness."
                            </p>
                        </header>
                        <p className="text-muted italic">Our gallery is currently being curated. Please check back soon.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
