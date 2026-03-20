'use client'
// app/admin/media/page.tsx
import MediaUploader from '@/src/modules/admin/MediaUploader';
import MediaLibrary from '@/src/modules/admin/MediaLibrary';

export default function MediaPage() {
    return (
        <div className="h-full flex flex-col">
            <div className="p-5 border-b bg-white shrink-0">
                <MediaUploader onUploadComplete={() => {
                    // MediaLibrary will refetch on its own if you lift state,
                    // or just add a key prop to force remount after upload
                }} />
            </div>
            <div className="flex-1 overflow-hidden">
                <MediaLibrary />
            </div>
        </div>
    );
}