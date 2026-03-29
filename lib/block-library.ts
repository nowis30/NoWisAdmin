export type BlockLibraryTemplate = {
  id: string;
  label: string;
  sectionName: string;
  keyHint: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  blocks?: Array<{
    key: string;
    label: string;
    kind: 'TEXT' | 'LINK' | 'RICH_TEXT';
    value: string;
    sortOrder: number;
  }>;
};

export const BLOCK_LIBRARY: BlockLibraryTemplate[] = [
  {
    id: 'hero-simple',
    label: 'Hero simple',
    sectionName: 'Hero simple',
    keyHint: 'hero',
    title: 'Titre principal de la page',
    description: 'Un message clair pour presenter la page.',
    blocks: [{ key: 'eyebrow', label: 'Petit texte', kind: 'TEXT', value: 'Nouveau', sortOrder: 10 }],
  },
  {
    id: 'hero-image',
    label: 'Hero avec image',
    sectionName: 'Hero avec image',
    keyHint: 'hero-image',
    title: 'Hero avec image',
    description: 'Un hero avec image en arriere-plan ou en illustration.',
    blocks: [{ key: 'eyebrow', label: 'Petit texte', kind: 'TEXT', value: 'A la une', sortOrder: 10 }],
  },
  {
    id: 'hero-two-cta',
    label: 'Hero avec 2 boutons',
    sectionName: 'Hero avec 2 boutons',
    keyHint: 'hero-cta',
    title: 'Hero avec deux actions',
    description: 'Utilise deux boutons pour guider rapidement.',
    ctaLabel: 'Action principale',
    ctaHref: '/contact',
    blocks: [
      { key: 'secondaryCta.label', label: 'Bouton secondaire texte', kind: 'TEXT', value: 'Action secondaire', sortOrder: 10 },
      { key: 'secondaryCta.href', label: 'Bouton secondaire lien', kind: 'LINK', value: '/services', sortOrder: 20 },
    ],
  },
  {
    id: 'text',
    label: 'Bloc texte',
    sectionName: 'Bloc texte',
    keyHint: 'text',
    title: 'Titre de section',
    description: 'Texte simple pour presenter une idee.',
  },
  {
    id: 'text-image',
    label: 'Bloc texte + image',
    sectionName: 'Texte + image',
    keyHint: 'text-image',
    title: 'Texte avec image',
    description: 'Combine un texte et une image.',
  },
  {
    id: 'image-text',
    label: 'Bloc image + texte',
    sectionName: 'Image + texte',
    keyHint: 'image-text',
    title: 'Image et texte',
    description: 'Mets l image en avant puis ajoute un texte.',
  },
  {
    id: 'gallery',
    label: 'Galerie images',
    sectionName: 'Galerie',
    keyHint: 'gallery',
    title: 'Galerie photos',
    description: 'Montre plusieurs photos ensemble.',
    blocks: [
      { key: 'item1.title', label: 'Image 1 titre', kind: 'TEXT', value: 'Photo 1', sortOrder: 10 },
      { key: 'item2.title', label: 'Image 2 titre', kind: 'TEXT', value: 'Photo 2', sortOrder: 20 },
      { key: 'item3.title', label: 'Image 3 titre', kind: 'TEXT', value: 'Photo 3', sortOrder: 30 },
    ],
  },
  {
    id: 'music',
    label: 'Bloc musique / chansons',
    sectionName: 'Bloc musique',
    keyHint: 'music-cards',
    title: 'Exemples musicaux',
    description: 'Presente des chansons ou extraits.',
    blocks: [
      { key: 'item1.title', label: 'Chanson 1 titre', kind: 'TEXT', value: 'Titre chanson 1', sortOrder: 10 },
      { key: 'item1.text', label: 'Chanson 1 texte', kind: 'RICH_TEXT', value: 'Description chanson 1', sortOrder: 20 },
    ],
  },
  {
    id: 'videos',
    label: 'Bloc videos',
    sectionName: 'Bloc videos',
    keyHint: 'videos-cards',
    title: 'Videos a decouvrir',
    description: 'Mets en avant des videos.',
    blocks: [
      { key: 'item1.title', label: 'Video 1 titre', kind: 'TEXT', value: 'Titre video 1', sortOrder: 10 },
      { key: 'item1.text', label: 'Video 1 texte', kind: 'RICH_TEXT', value: 'Description video 1', sortOrder: 20 },
    ],
  },
  {
    id: 'cta',
    label: 'Bloc CTA',
    sectionName: 'Bloc CTA',
    keyHint: 'final-cta',
    title: 'Pret a passer a l action ?',
    description: 'Ajoute un appel a l action clair.',
    ctaLabel: 'Nous contacter',
    ctaHref: '/contact',
  },
  {
    id: 'cards-services',
    label: 'Bloc cartes/services',
    sectionName: 'Cartes services',
    keyHint: 'services-cards',
    title: 'Nos services',
    description: 'Liste simple de services en cartes.',
    blocks: [
      { key: 'item1.title', label: 'Carte 1 titre', kind: 'TEXT', value: 'Service 1', sortOrder: 10 },
      { key: 'item1.text', label: 'Carte 1 texte', kind: 'RICH_TEXT', value: 'Description service 1', sortOrder: 20 },
      { key: 'item2.title', label: 'Carte 2 titre', kind: 'TEXT', value: 'Service 2', sortOrder: 30 },
      { key: 'item2.text', label: 'Carte 2 texte', kind: 'RICH_TEXT', value: 'Description service 2', sortOrder: 40 },
    ],
  },
  {
    id: 'testimonials',
    label: 'Bloc temoignages',
    sectionName: 'Temoignages',
    keyHint: 'trust-strip',
    title: 'Ils nous font confiance',
    description: 'Quelques avis clients rassurants.',
    blocks: [
      { key: 'trust1.title', label: 'Temoignage 1 titre', kind: 'TEXT', value: 'Client satisfait', sortOrder: 10 },
      { key: 'trust1.text', label: 'Temoignage 1 texte', kind: 'RICH_TEXT', value: 'Un avis court et utile.', sortOrder: 20 },
    ],
  },
  {
    id: 'contact',
    label: 'Bloc contact',
    sectionName: 'Contact',
    keyHint: 'contact-info',
    title: 'Contact direct',
    description: 'Coordonnees et boutons de contact.',
    blocks: [
      { key: 'email', label: 'Adresse email', kind: 'TEXT', value: 'contact@exemple.com', sortOrder: 10 },
      { key: 'phone', label: 'Telephone', kind: 'TEXT', value: '+1 555 000 0000', sortOrder: 20 },
    ],
  },
  {
    id: 'social',
    label: 'Bloc reseaux sociaux',
    sectionName: 'Reseaux sociaux',
    keyHint: 'social-links',
    title: 'Suivez-nous',
    description: 'Liens vers les reseaux sociaux.',
    blocks: [
      { key: 'spotify', label: 'Lien Spotify', kind: 'LINK', value: 'https://open.spotify.com/', sortOrder: 10 },
      { key: 'youtube', label: 'Lien YouTube', kind: 'LINK', value: 'https://youtube.com/', sortOrder: 20 },
      { key: 'instagram', label: 'Lien Instagram', kind: 'LINK', value: 'https://instagram.com/', sortOrder: 30 },
      { key: 'facebook', label: 'Lien Facebook', kind: 'LINK', value: 'https://facebook.com/', sortOrder: 40 },
    ],
  },
  {
    id: 'faq',
    label: 'FAQ simple',
    sectionName: 'FAQ',
    keyHint: 'faq-cards',
    title: 'Questions frequentes',
    description: 'Reponses claires aux questions utiles.',
    blocks: [
      { key: 'item1.title', label: 'Question 1', kind: 'TEXT', value: 'Question frequente 1', sortOrder: 10 },
      { key: 'item1.text', label: 'Reponse 1', kind: 'RICH_TEXT', value: 'Reponse claire et courte.', sortOrder: 20 },
    ],
  },
  {
    id: 'promo-banner',
    label: 'Banniere promotionnelle',
    sectionName: 'Banniere promo',
    keyHint: 'promo-cta',
    title: 'Offre speciale',
    description: 'Annonce rapide avec un bouton.',
    ctaLabel: 'Profiter de l offre',
    ctaHref: '/contact',
  },
  {
    id: 'divider',
    label: 'Separateur visuel',
    sectionName: 'Separateur',
    keyHint: 'divider',
    title: 'Separateur',
    description: 'Petite pause visuelle entre deux sections.',
  },
  {
    id: 'footer',
    label: 'Pied de page configurable',
    sectionName: 'Pied de page',
    keyHint: 'footer',
    title: 'Pied de page',
    description: 'Infos de fin de page et liens utiles.',
    blocks: [
      { key: 'item1.title', label: 'Colonne 1 titre', kind: 'TEXT', value: 'A propos', sortOrder: 10 },
      { key: 'item1.text', label: 'Colonne 1 texte', kind: 'RICH_TEXT', value: 'Texte de pied de page.', sortOrder: 20 },
    ],
  },
];

export function getBlockTemplate(templateId: string) {
  return BLOCK_LIBRARY.find((template) => template.id === templateId) || null;
}
