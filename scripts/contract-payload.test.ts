import { z } from 'zod';

import { buildPublishPayload } from '../lib/admin-data';

const blockSchema = z.object({
  key: z.string().min(1),
  label: z.string(),
  kind: z.enum(['TEXT', 'LINK', 'RICH_TEXT']),
  value: z.string(),
});

const sectionSchema = z.object({
  key: z.string().min(1),
  title: z.string(),
  subtitle: z.string().nullable(),
  description: z.string().nullable(),
  ctaLabel: z.string().nullable(),
  ctaHref: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  imageUrl: z.string().nullable(),
  blocks: z.array(blockSchema),
});

const payloadSchema = z.object({
  siteSettings: z.object({
    siteName: z.string().min(1),
    siteUrl: z.string().min(1),
    defaultSeoTitle: z.string().min(1),
    defaultSeoDescription: z.string().min(1),
    defaultCtaLabel: z.string().min(1),
    defaultCtaHref: z.string().min(1),
  }),
  themeSettings: z.object({
    primaryColor: z.string().min(1),
    accentColor: z.string().min(1),
    surfaceColor: z.string().min(1),
    textColor: z.string().min(1),
    mutedColor: z.string().min(1),
    borderRadius: z.string().min(1),
  }),
  pages: z.array(
    z.object({
      slug: z.string().min(1),
      title: z.string().min(1),
      description: z.string().nullable(),
      sections: z.array(sectionSchema),
    }),
  ),
});

function assertStyleContracts() {
  const validContentWidth = new Set(['compact', 'normal', 'wide']);
  const validVerticalSpacing = new Set(['tight', 'normal', 'airy']);
  const validContentAlign = new Set(['left', 'center']);
  const validHeadingScale = new Set(['sm', 'md', 'lg']);
  const validMobileSpacing = new Set(['inherit', 'compact', 'comfortable', 'airy']);
  const validMobileAlign = new Set(['inherit', 'left', 'center']);

  return {
    validContentWidth,
    validVerticalSpacing,
    validContentAlign,
    validHeadingScale,
    validMobileSpacing,
    validMobileAlign,
  };
}

async function run() {
  const payload = await buildPublishPayload();
  payloadSchema.parse(payload);

  const {
    validContentWidth,
    validVerticalSpacing,
    validContentAlign,
    validHeadingScale,
    validMobileSpacing,
    validMobileAlign,
  } = assertStyleContracts();

  for (const page of payload.pages) {
    for (const section of page.sections) {
      const byKey = new Map(section.blocks.map((block) => [block.key, block.value]));

      const width = byKey.get('style.contentWidth');
      if (width && !validContentWidth.has(width)) {
        throw new Error(`Invalid style.contentWidth in ${page.slug}/${section.key}: ${width}`);
      }

      const spacing = byKey.get('style.verticalSpacing');
      if (spacing && !validVerticalSpacing.has(spacing)) {
        throw new Error(`Invalid style.verticalSpacing in ${page.slug}/${section.key}: ${spacing}`);
      }

      const align = byKey.get('style.contentAlign');
      if (align && !validContentAlign.has(align)) {
        throw new Error(`Invalid style.contentAlign in ${page.slug}/${section.key}: ${align}`);
      }

      const heading = byKey.get('style.headingScale');
      if (heading && !validHeadingScale.has(heading)) {
        throw new Error(`Invalid style.headingScale in ${page.slug}/${section.key}: ${heading}`);
      }

      const mobileSpacing = byKey.get('style.mobileSpacing');
      if (mobileSpacing && !validMobileSpacing.has(mobileSpacing)) {
        throw new Error(`Invalid style.mobileSpacing in ${page.slug}/${section.key}: ${mobileSpacing}`);
      }

      const mobileAlign = byKey.get('style.mobileAlign');
      if (mobileAlign && !validMobileAlign.has(mobileAlign)) {
        throw new Error(`Invalid style.mobileAlign in ${page.slug}/${section.key}: ${mobileAlign}`);
      }
    }
  }

  console.log(`Contract payload test OK: ${payload.pages.length} pages validated.`);
}

run().catch((error) => {
  console.error('Contract payload test failed.', error);
  process.exit(1);
});
