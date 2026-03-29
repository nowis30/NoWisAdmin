import { PageEditor } from '@/components/editor/page-editor';
import type { EditorMediaAsset, EditorPage } from '@/components/editor/types';
import { getContentSections, getMediaLibrary } from '@/lib/admin-data';
import { inferSectionModel } from '@/lib/site-section-model';

export default async function ContentPage({ searchParams }: { searchParams?: { mediaId?: string } }) {
  const [pages, media] = await Promise.all([getContentSections(), getMediaLibrary()]);

  const editorPages: EditorPage[] = pages.map((page) => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    description: page.description,
     status: page.status,
    sections: page.sections.map((section) => {
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
    }),
  }));

  const mediaAssets: EditorMediaAsset[] = media.map((asset) => ({
    id: asset.id,
    originalName: asset.originalName,
    url: asset.url,
    altText: asset.altText,
    usedInSections: asset.sections.map((section) => section.name),
  }));

  return <PageEditor initialPages={editorPages} mediaAssets={mediaAssets} suggestedMediaId={searchParams?.mediaId} />;
}
