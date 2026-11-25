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
    /** Guests may share photos now, within the window the invitation chose around the event. */
    is_open: boolean;
    opens_at: string | null;
    closes_at: string | null;
    /** New photos wait for a panel user's approval before the wall shows them. */
    moderated: boolean;
    /** How long the wall shows each photo. */
    slide_seconds: number;
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
    /** Days before the event the gallery opens, at 00:00 (0 = the event day). */
    opens_days_before: number;
    /** Days after the event the gallery closes, at noon. */
    closes_days_after: number;
    /** How long the wall shows each photo. */
    slide_seconds: number;
    max_opens_days_before: number;
    /** Never past the day the guest data is purged. */
    max_closes_days_after: number;
    min_slide_seconds: number;
    max_slide_seconds: number;
    opens_at: string | null;
    closes_at: string | null;
    is_open: boolean;
    max_photos: number;
    summary: { total: number; pending: number; approved: number; hidden: number };
}
