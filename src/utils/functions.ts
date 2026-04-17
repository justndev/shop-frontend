export function getThumbnailUrl(url: string) {
    return url.replace('/uploads/', '/thumbs/');
}