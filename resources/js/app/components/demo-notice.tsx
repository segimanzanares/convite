import { SparklesIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * Tells visitors of a demo's door or live gallery (`/i/{slug}/demo/...`) that they are trying it out with sample data
 * and that nothing they do is stored.
 */
export default function DemoNotice({ children }: { children: ReactNode }) {
    return (
        <Alert className="mb-5 border-primary/25 bg-primary/5">
            <SparklesIcon />
            <AlertTitle>Demostración</AlertTitle>
            <AlertDescription>{children}</AlertDescription>
        </Alert>
    );
}
