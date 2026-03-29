export type ContentBlockKind = 'TEXT' | 'LINK' | 'RICH_TEXT';

export interface SiteSettingsContract {
  siteName: string;
  siteUrl: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultCtaLabel: string;
  defaultCtaHref: string;
}

export interface ThemeSettingsContract {
  primaryColor: string;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  borderRadius: string;
}

export interface SectionContract {
  key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  isActive: boolean;
  sortOrder: number;
  imageUrl: string | null;
}

export interface PublishPayload {
  siteSettings: SiteSettingsContract;
  themeSettings: ThemeSettingsContract;
  pages: Array<{
    slug: string;
    title: string;
    description: string | null;
    sections: SectionContract[];
  }>;
}