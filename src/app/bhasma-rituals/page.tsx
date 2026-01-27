import { fetchRituals } from "@/lib/sanity.fetch";
import RitualsContent from "./RitualsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bhasma Rituals | Vishwa Wellness",
    description: "Discover the sacred ash rituals of Bhasma Snan, Lepam, and Pana for deep purification and healing.",
};

export default async function BhasmaRitualsPage() {
    const rituals = await fetchRituals();

    return <RitualsContent rituals={rituals as any} />;
}
