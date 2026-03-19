import GalleryClient from './GalleryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gallery | Vishwa Wellness',
    description: 'Explore our therapy sessions, facility, Vishwa Centre, and promotional reels — a visual journey into sacred healing and wellness.',
};

export default function GalleryPage() {
    return <GalleryClient />;
}
