import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { PageStatus } from '@prisma/client';

import { getSessionFromRequest } from '@/lib/auth';
import { getBlockTemplate } from '@/lib/block-library';
import { prisma } from '@/lib/prisma';
import { inferSectionModel } from '@/lib/site-section-model';

function valueOf(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

async function normalizeSortOrders(pageId: string) {
  const sections = await prisma.section.findMany({
    where: { pageId },
    orderBy: { sortOrder: 'asc' },
    select: { id: true },
  });

  await Promise.all(
    sections.map((section, index) =>
      prisma.section.update({
        where: { id: section.id },
        data: { sortOrder: (index + 1) * 10 },
      }),
    ),
  );
}

async function getPageSectionsPayload(pageId: string) {
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: {
      sections: {
        include: {
          blocks: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  return {
    pageId,
    sections:
      page?.sections.map((section) => {
        const model = inferSectionModel(section.key);

        return {
          id: section.id,
          name: section.name,
          key: section.key,
          modelId: model.id,
          modelName: model.name,
          title: section.title,
          subtitle: section.subtitle,
          description: section.description,
          ctaLabel: section.ctaLabel,
          ctaHref: section.ctaHref,
          imageId: section.imageId,
          isActive: section.isActive,
          sortOrder: section.sortOrder,
          blocks: section.blocks.map((block) => ({
            id: block.id,
            key: block.key,
            label: block.label,
            kind: block.kind,
            value: block.value,
          })),
        };
      }) ?? [],
  };
}

export async function POST(request: NextRequest) {
  if (!getSessionFromRequest(request)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const formData = await request.formData();
  const action = valueOf(formData, 'action');

  if (!action) {
    return NextResponse.json({ error: 'action is required' }, { status: 400 });
  }

  if (action === 'add-section') {
    const pageId = valueOf(formData, 'pageId');
    const templateId = valueOf(formData, 'templateId');

    if (!pageId || !templateId) {
      return NextResponse.json({ error: 'pageId and templateId are required' }, { status: 400 });
    }

    const page = await prisma.page.findUnique({ where: { id: pageId }, select: { slug: true } });
    const template = getBlockTemplate(templateId);

    if (!page || !template) {
      return NextResponse.json({ error: 'Page or template not found' }, { status: 404 });
    }

    const maxOrder = await prisma.section.aggregate({
      where: { pageId },
      _max: { sortOrder: true },
    });

    const sectionKey = `${page.slug}.${template.keyHint}.${Date.now().toString(36)}`;
    const newSortOrder = (maxOrder._max.sortOrder ?? 0) + 10;

    const created = await prisma.section.create({
      data: {
        pageId,
        key: sectionKey,
        name: template.sectionName,
        title: template.title,
        subtitle: template.subtitle || null,
        description: template.description || null,
        ctaLabel: template.ctaLabel || null,
        ctaHref: template.ctaHref || null,
        isActive: true,
        sortOrder: newSortOrder,
      },
    });

    if (template.blocks && template.blocks.length > 0) {
      await prisma.contentBlock.createMany({
        data: template.blocks.map((block) => ({
          sectionId: created.id,
          key: block.key,
          label: block.label,
          kind: block.kind,
          value: block.value,
          sortOrder: block.sortOrder,
        })),
      });
    }

    await normalizeSortOrders(pageId);

    revalidatePath('/content');
    revalidatePath('/preview');
    revalidatePath('/publish');

    return NextResponse.json({ ok: true, ...(await getPageSectionsPayload(pageId)) });
  }

  if (action === 'set-page-status') {
    const pageId = valueOf(formData, 'pageId');
    const status = valueOf(formData, 'status');

    if (!pageId || !status) {
      return NextResponse.json({ error: 'pageId and status are required' }, { status: 400 });
    }

    if (status !== PageStatus.DRAFT && status !== PageStatus.PUBLISHED) {
      return NextResponse.json({ error: 'status must be DRAFT or PUBLISHED' }, { status: 400 });
    }

    await prisma.page.update({
      where: { id: pageId },
      data: { status },
    });

    revalidatePath('/content');
    revalidatePath('/preview');
    revalidatePath('/publish');

    return NextResponse.json({ ok: true, pageId, status });
  }

  const sectionId = valueOf(formData, 'sectionId');
  if (!sectionId) {
    return NextResponse.json({ error: 'sectionId is required' }, { status: 400 });
  }

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: {
      page: { select: { id: true, slug: true } },
      blocks: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!section) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 });
  }

  const pageId = section.page.id;

  if (action === 'move-section') {
    const direction = valueOf(formData, 'direction');
    if (direction !== 'up' && direction !== 'down') {
      return NextResponse.json({ error: 'direction must be up or down' }, { status: 400 });
    }

    const sections = await prisma.section.findMany({
      where: { pageId },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, sortOrder: true },
    });

    const index = sections.findIndex((item) => item.id === sectionId);
    if (index === -1) {
      return NextResponse.json({ error: 'Section not found in page' }, { status: 404 });
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) {
      return NextResponse.json({ ok: true, ...(await getPageSectionsPayload(pageId)) });
    }

    const current = sections[index];
    const target = sections[targetIndex];

    await prisma.$transaction([
      prisma.section.update({ where: { id: current.id }, data: { sortOrder: target.sortOrder } }),
      prisma.section.update({ where: { id: target.id }, data: { sortOrder: current.sortOrder } }),
    ]);

    await normalizeSortOrders(pageId);

    revalidatePath('/content');
    revalidatePath('/preview');

    return NextResponse.json({ ok: true, ...(await getPageSectionsPayload(pageId)) });
  }

  if (action === 'reorder-section') {
    const targetIndexValue = Number(valueOf(formData, 'targetIndex'));
    if (!Number.isInteger(targetIndexValue) || targetIndexValue < 0) {
      return NextResponse.json({ error: 'targetIndex must be a positive integer' }, { status: 400 });
    }

    const sections = await prisma.section.findMany({
      where: { pageId },
      orderBy: { sortOrder: 'asc' },
      select: { id: true },
    });

    const fromIndex = sections.findIndex((item) => item.id === sectionId);
    if (fromIndex === -1) {
      return NextResponse.json({ error: 'Section not found in page' }, { status: 404 });
    }

    const boundedTarget = Math.max(0, Math.min(targetIndexValue, sections.length - 1));
    if (fromIndex === boundedTarget) {
      return NextResponse.json({ ok: true, ...(await getPageSectionsPayload(pageId)) });
    }

    const reordered = sections.slice();
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(boundedTarget, 0, moved);

    await prisma.$transaction(
      reordered.map((item, index) =>
        prisma.section.update({
          where: { id: item.id },
          data: { sortOrder: (index + 1) * 10 },
        }),
      ),
    );

    revalidatePath('/content');
    revalidatePath('/preview');

    return NextResponse.json({ ok: true, ...(await getPageSectionsPayload(pageId)) });
  }

  if (action === 'duplicate-section') {
    const copyKey = `${section.key}.copy.${Date.now().toString(36)}`;

    const duplicated = await prisma.section.create({
      data: {
        pageId,
        key: copyKey,
        name: `${section.name} (copie)`,
        title: section.title,
        subtitle: section.subtitle,
        description: section.description,
        ctaLabel: section.ctaLabel,
        ctaHref: section.ctaHref,
        imageId: section.imageId,
        isActive: section.isActive,
        sortOrder: section.sortOrder + 1,
      },
    });

    if (section.blocks.length > 0) {
      await prisma.contentBlock.createMany({
        data: section.blocks.map((block, index) => ({
          sectionId: duplicated.id,
          key: block.key,
          label: block.label,
          kind: block.kind,
          value: block.value,
          sortOrder: block.sortOrder || (index + 1) * 10,
        })),
      });
    }

    await normalizeSortOrders(pageId);

    revalidatePath('/content');
    revalidatePath('/preview');

    return NextResponse.json({ ok: true, ...(await getPageSectionsPayload(pageId)), duplicatedSectionId: duplicated.id });
  }

  if (action === 'set-section-visibility') {
    const isActiveValue = valueOf(formData, 'isActive');
    if (isActiveValue !== 'true' && isActiveValue !== 'false') {
      return NextResponse.json({ error: 'isActive must be true or false' }, { status: 400 });
    }

    await prisma.section.update({
      where: { id: sectionId },
      data: { isActive: isActiveValue === 'true' },
    });

    revalidatePath('/content');
    revalidatePath('/preview');

    return NextResponse.json({ ok: true, ...(await getPageSectionsPayload(pageId)) });
  }

  if (action === 'delete-section') {
    const count = await prisma.section.count({ where: { pageId } });
    if (count <= 1) {
      return NextResponse.json({ error: 'La page doit garder au moins une section.' }, { status: 400 });
    }

    await prisma.section.delete({ where: { id: sectionId } });
    await normalizeSortOrders(pageId);

    revalidatePath('/content');
    revalidatePath('/preview');

    return NextResponse.json({ ok: true, ...(await getPageSectionsPayload(pageId)) });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
