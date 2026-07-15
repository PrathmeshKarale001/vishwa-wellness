import { notFound } from "next/navigation";
import { Metadata } from "next";
import { retreatFormats, getRetreatFormat } from "../retreatFormats";
import RetreatFormatDetail from "./RetreatFormatDetail";

export function generateStaticParams() {
    return retreatFormats.map((format) => ({ slug: format.slug }));
}

interface RetreatFormatPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: RetreatFormatPageProps): Promise<Metadata> {
    const { slug } = await params;
    const format = getRetreatFormat(slug);

    if (!format) {
        return { title: "Retreat Not Found" };
    }

    return {
        title: `${format.title} | Vishwa Wellness`,
        description: format.tagline,
        openGraph: {
            title: format.title,
            description: format.tagline,
            type: "website",
        },
    };
}

export default async function RetreatFormatPage({ params }: RetreatFormatPageProps) {
    const { slug } = await params;
    const format = getRetreatFormat(slug);

    if (!format) {
        notFound();
    }

    return <RetreatFormatDetail format={format} />;
}
