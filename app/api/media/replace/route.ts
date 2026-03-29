import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

import { getSessionFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function classifyBlobError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  if (message.includes('Cannot use public access on a private store')) return 'storage-private';
  if (message.includes('404')) return 'storage-404';
  if (message.includes('403') || message.toLowerCase().includes('forbidden')) return 'storage-403';
  return 'storage-write';
}

function logBlobError(stage: 'token' | 'native', error: unknown) {
  const message = error instanceof Error ? error.message : String(error || 'Unknown error');
  console.error(`[MEDIA_REPLACE_BLOB_${stage.toUpperCase()}] ${message}`);
}

function valueOf(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const formData = await request.formData();
  const assetId = valueOf(formData, 'assetId');
  const altText = valueOf(formData, 'altText');
  const file = formData.get('file');

  if (!assetId || !(file instanceof File) || file.size === 0) {
    return NextResponse.redirect(new URL('/media?error=file', request.url));
  }

  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.redirect(new URL('/media?error=file-too-large', request.url));
  }

  const isProd = process.env.NODE_ENV === 'production';
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  const hasBlobToken = Boolean(blobToken);
  if (isProd && !hasBlobToken) {
    return NextResponse.redirect(new URL('/media?error=storage-token', request.url));
  }

  try {
    const extension = path.extname(file.name) || '.bin';
    const safeBaseName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').replace(/-+/g, '-');
    const fileName = `${Date.now()}-${safeBaseName || `asset${extension}`}`;

    let publicUrl = '';
    if (hasBlobToken) {
      try {
        const blob = await put(`nowis-admin/uploads/${fileName}`, file, {
          access: 'public',
          token: blobToken,
        });
        publicUrl = blob.url;
      } catch (errorWithToken) {
        logBlobError('token', errorWithToken);
        try {
          const blob = await put(`nowis-admin/uploads/${fileName}`, file, {
            access: 'public',
          });
          publicUrl = blob.url;
        } catch (fallbackError) {
          logBlobError('native', fallbackError);
          const code = classifyBlobError(fallbackError || errorWithToken);
          return NextResponse.redirect(new URL(`/media?error=${code}`, request.url));
        }
      }
    } else {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);
      publicUrl = `/uploads/${fileName}`;
    }

    await prisma.mediaAsset.update({
      where: { id: assetId },
      data: {
        fileName,
        originalName: file.name,
        mimeType: file.type || 'application/octet-stream',
        fileSize: file.size,
        altText: altText || null,
        url: publicUrl,
      },
    });

    return NextResponse.redirect(new URL('/media?replaced=1', request.url));
  } catch {
    return NextResponse.redirect(new URL('/media?error=replace', request.url));
  }
}
