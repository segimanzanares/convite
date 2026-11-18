export type WishStatus = 'pending' | 'approved' | 'hidden';

/** A message a guest left in the wishes book. */
export interface Wish {
    id: number;
    author_name: string;
    message: string;
    status: WishStatus;
    /** The guest whose personalized link it came from, if any. */
    guest_name: string | null;
    created_at: string;
}

/** The wishes book as the panel shows it. */
export interface WishesBook {
    /** The invitation shows the book. */
    enabled: boolean;
    /** The approved messages show on the invitation; otherwise only the panel and the PDF have them. */
    public: boolean;
    /** New messages wait for a panel user's approval. */
    moderated: boolean;
    /** The book takes messages now. */
    is_open: boolean;
    closes_at: string | null;
    /** When the guest data purge deletes the messages. */
    purges_at: string | null;
    purged: boolean;
    max_messages: number;
    summary: {
        total: number;
        pending: number;
        approved: number;
        hidden: number;
    };
}
