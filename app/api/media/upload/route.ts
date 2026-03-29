import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { NextRequest, NextResponse } from 'next/server';

import { getSessionFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const altText = String(formData.get('altText') ?? '').trim();

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.redirect(new URL('/media?error=upload', request.url));
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  const extension = path.extname(file.name) || '.bin';
  const safeBaseName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').replace(/-+/g, '-');
  const fileName = `${Date.now()}-${safeBaseName || `asset${extension}`}`;
  const filePath = path.join(uploadsDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  await prisma.mediaAsset.create({
    data: {
      fileName,
      originalName: file.name,
      mimeType: file.type || 'application/octet-stream',
      fileSize: file.size,
      altText: altText || null,
      url: `/uploads/${fileName}`,
    },
  });

  return NextResponse.redirect(new URL('/media?uploaded=1', request.url));
}