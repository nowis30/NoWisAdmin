import type { PublishPayload, SectionContract } from '@/types/site';

export type GateSeverity = 'blocking' | 'warning' | 'suggestion';

export interface PublishGateIssue {
  severity: GateSeverity;
  pageSlug: string;
  sectionKey?: string;
  message: string;
}

export interface PublishGateReport {
  blocking: PublishGateIssue[];
  warnings: PublishGateIssue[];
  suggestions: PublishGateIssue[];
  isBlocked: boolean;
}

const CRITICAL_SLUGS = new Set(['home', 'musique', 'videos', 'contact', 'commander-une-chanson']);

function isValidHref(value: string) {
  const link = value.trim();
  if (!link) {
    return false;
  }

  return link.startsWith('/') || link.startsWith('#') || link.startsWith('https://') || link.startsWith('http://');
}

function isHero(section: SectionContract) {
  return section.key.toLowerCase().includes('hero');
}

function isTextEmpty(value: string | null | undefined) {
  return !value || value.trim().length === 0;
}

function addIssue(issues: PublishGateIssue[], severity: GateSeverity, pageSlug: string, message: string, sectionKey?: string) {
  issues.push({ severity, pageSlug, sectionKey, message });
}

function evaluateSection(payloadIssues: PublishGateIssue[], pageSlug: string, section: SectionContract) {
  const sectionLabel = section.title?.trim() || section.key;

  if (isTextEmpty(section.title)) {
    addIssue(payloadIssues, 'blocking', pageSlug, `La section "${sectionLabel}" doit avoir un titre lisible.`, section.key);
  }

  const hasCtaLabel = !isTextEmpty(section.ctaLabel);
  const hasCtaHref = !isTextEmpty(section.ctaHref);
  if (hasCtaLabel !== hasCtaHref) {
    addIssue(payloadIssues, 'blocking', pageSlug, `Le bouton de "${sectionLabel}" est incomplet (texte ou lien manquant).`, section.key);
  }

  if (hasCtaHref && !isValidHref(section.ctaHref || '')) {
    addIssue(payloadIssues, 'blocking', pageSlug, `Le lien du bouton de "${sectionLabel}" semble invalide.`, section.key);
  }

  const linkBlocks = section.blocks.filter((block) => block.kind === 'LINK');
  for (const block of linkBlocks) {
    if (!isTextEmpty(block.value) && !isValidHref(block.value)) {
      addIssue(payloadIssues, 'warning', pageSlug, `Le lien "${block.label}" dans "${sectionLabel}" semble invalide.`, section.key);
    }
  }

  if (isHero(section) && CRITICAL_SLUGS.has(pageSlug) && !section.imageUrl) {
    addIssue(payloadIssues, 'warning', pageSlug, `La section hero de "${pageSlug}" est publiee sans image.`, section.key);
  }

  if (isHero(section) && isTextEmpty(section.description)) {
    addIssue(payloadIssues, 'warning', pageSlug, `La section hero "${sectionLabel}" a peu de contexte (description vide).`, section.key);
  }

  const isEssentiallyEmpty =
    isTextEmpty(section.title) &&
    isTextEmpty(section.subtitle) &&
    isTextEmpty(section.description) &&
    isTextEmpty(section.ctaLabel) &&
    isTextEmpty(section.ctaHref);

  if (isEssentiallyEmpty) {
    addIssue(payloadIssues, 'blocking', pageSlug, `La section "${section.key}" semble vide ou cassee.`, section.key);
  }

  if (!section.imageUrl && !isHero(section)) {
    addIssue(payloadIssues, 'suggestion', pageSlug, `La section "${sectionLabel}" pourrait etre plus forte avec un visuel.`, section.key);
  }
}

export function evaluatePublishQuality(payload: PublishPayload): PublishGateReport {
  const issues: PublishGateIssue[] = [];

  for (const page of payload.pages) {
    if (isTextEmpty(page.title)) {
      addIssue(issues, 'blocking', page.slug, `La page "${page.slug}" doit avoir un titre.`);
    }

    if (page.sections.length === 0) {
      addIssue(issues, 'blocking', page.slug, `La page "${page.slug}" ne contient aucune section active.`);
      continue;
    }

    for (const section of page.sections) {
      evaluateSection(issues, page.slug, section);
    }

    const missingDescriptionCount = page.sections.filter((section) => isTextEmpty(section.description)).length;
    if (missingDescriptionCount >= 3) {
      addIssue(issues, 'suggestion', page.slug, `Plusieurs sections de "${page.slug}" manquent de texte descriptif.`);
    }
  }

  const blocking = issues.filter((item) => item.severity === 'blocking');
  const warnings = issues.filter((item) => item.severity === 'warning');
  const suggestions = issues.filter((item) => item.severity === 'suggestion');

  return {
    blocking,
    warnings,
    suggestions,
    isBlocked: blocking.length > 0,
  };
}
