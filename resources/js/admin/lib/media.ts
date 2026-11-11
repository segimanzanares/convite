/** Resolves a stored media path to a URL the browser can load. */
export function mediaUrl(path: string, urlPrefix: string): string {
    return path.startsWith('/') ? path : `${urlPrefix}${path}`;
}
