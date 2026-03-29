export interface EditorBlock {
  id: string;
  key: string;
  label: string;
  kind: 'TEXT' | 'LINK' | 'RICH_TEXT';
  value: string;
}

export interface EditorSection {
  id: string;
  name: string;
  key: string;
  modelId: string;
  modelName: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  imageId: string | null;
  isActive: boolean;
  sortOrder: number;
  blocks: EditorBlock[];
}

export interface EditorPage {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status?: 'DRAFT' | 'PUBLISHED';
  sections: EditorSection[];
}

export interface EditorMediaAsset {
  id: string;
  originalName: string;
  url: string;
  altText: string | null;
  usedInSections: string[];
}

export interface SectionFormState {
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  imageId: string;
  imageAltText: string;
  imageFocalX: number;
  imageFocalY: number;
  imageZoom: number;
  imageFit: 'cover' | 'contain';
  imageAspectRatio: 'auto' | '16/9' | '4/3' | '1/1';
  backgroundColor: string;
  textColor: string;
  contentWidth: 'compact' | 'normal' | 'wide';
  verticalSpacing: 'tight' | 'normal' | 'airy';
  contentAlign: 'left' | 'center';
  headingScale: 'sm' | 'md' | 'lg';
  mobileSpacing: 'inherit' | 'compact' | 'comfortable' | 'airy';
  mobileAlign: 'inherit' | 'left' | 'center';
  isActive: boolean;
  extraFields: Record<string, string>;
}
