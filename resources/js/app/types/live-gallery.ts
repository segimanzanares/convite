export type GalleryPhotoStatus = 'pending' | 'approved' | 'hidden';

/** A photo a guest shared in the live gallery. */
export interface GalleryPhoto {
    id: number;
    url: string;
    thumb_url: string;
    width: number;
    height: number;
    uploader_name: string | null;
    message: string | null;
    created_at: string;
    /** Only sent to the panel; the public pages only get approved photos. */
    status?: GalleryPhotoStatus;
}

/** The gallery's window and links, sent with the guests' upload page and the wall. */
export interface LiveGallery {
    title: string;
    /** Guests may share photos now (from the start of the event day until noon after it). */
    is_open: boolean;
    opens_at: string | null;
    closes_at: string | null;
    /** New photos wait for a panel user's approval before the wall shows them. */
    moderated: boolean;
    upload_url: string;
    wall_url: string;
}

export interface LiveGalleryPageProps {
    gallery: LiveGallery;
    /** The latest approved photos, newest first. */
    photos: GalleryPhoto[];
    [key: string]: unknown;
}

/** The live gallery as the panel shows it. */
export interface GallerySettings {
    /** The link the gallery QR code opens; null until one is made. */
    upload_url: string | null;
    wall_url: string | null;
    moderated: boolean;
    opens_at: string | null;
    closes_at: string | null;
    is_open: boolean;
    max_photos: number;
    summary: { total: number; pending: number; approved: number; hidden: number };
}
