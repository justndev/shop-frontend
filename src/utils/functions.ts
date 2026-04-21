export function getThumbnailUrl(url: string) {
    return url.replace('/uploads/', '/thumbs/');
}

export function cutTitle(title: string, maxLength = 50): string {
    if (title.length <= maxLength) return title;

    const lastSpace = title.lastIndexOf(' ', maxLength);

    if (lastSpace === -1) return title;

    return title.substring(0, lastSpace);
}

export function slugFromPath(pathname: string) {
    return pathname.split("/").pop();
}