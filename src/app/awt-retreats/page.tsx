import { fetchRetreats } from "@/lib/sanity.fetch";
import RetreatsContent from "./RetreatsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AWT Retreats | Vishwa Wellness",
    description: "Immersive wellness retreats focused on sacred fire ceremonies, Bhasma rituals, and profound healing.",
};

export default async function AWTRetreatsPage() {
    const retreats = await fetchRetreats();

    return <RetreatsContent retreats={retreats as any} />;
}
