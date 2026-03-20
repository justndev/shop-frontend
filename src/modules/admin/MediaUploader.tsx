'use client';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/react/dashboard'
import AwsS3 from '@uppy/aws-s3';
import {useMemo} from 'react';
import mediaApi from "@/src/api/mediaApi";
import {FilesGrid, UppyContextProvider} from "@uppy/react";
import MediaLibrary from "@/src/modules/admin/MediaLibrary";

interface Props {
    onUploadComplete?: () => void;
}

export default function MediaUploader({onUploadComplete}: Props) {
    const uppy = useMemo(() => {
        const instance = new Uppy({
            restrictions: {
                allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
                maxFileSize: 10 * 1024 * 1024,
            },
        });

        instance.use(AwsS3, {
            shouldUseMultipart: false,  // forces single presigned PUT, not multipart
            async getUploadParameters(file) {
                const {uploadUrl, fileKey} = await mediaApi.presign(file.name!, file.type!)
                file.meta.fileKey = fileKey
                return {method: 'PUT' as const, url: uploadUrl, fields: {}, headers: {'Content-Type': file.type!}}

            },
        });

        instance.on('upload-success', async (file) => {
            await mediaApi.confirm({
                fileKey: file?.meta.fileKey as string,
                filename: file?.name!,
                mimetype: file?.type!,
                size: file?.size!,
                alt: file?.name ?? '',
            })
            onUploadComplete?.()
        })

        return instance;
    }, []);

    return (
        <Dashboard
            uppy={uppy}
            proudlyDisplayPoweredByUppy={false}
            height={400}
            theme="light"
        />

    );
}