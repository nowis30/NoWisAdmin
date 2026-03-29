export type FieldInputType = 'text' | 'textarea' | 'url';

export interface SectionFieldModel {
  key: string;
  label: string;
  help: string;
  input: FieldInputType;
}

export interface SectionModel {
  id: string;
  name: string;
  summary: string;
  fields: SectionFieldModel[];
}

const sharedCardsFields: SectionFieldModel[] = [
  { key: 'item1.title', label: 'Carte 1 - Titre', help: 'Titre de la premiere carte.', input: 'text' },
  { key: 'item1.text', label: 'Carte 1 - Texte', help: 'Texte de la premiere carte.', input: 'textarea' },
  { key: 'item2.title', label: 'Carte 2 - Titre', help: 'Titre de la deuxieme carte.', input: 'text' },
  { key: 'item2.text', label: 'Carte 2 - Texte', help: 'Texte de la deuxieme carte.', input: 'textarea' },
  { key: 'item3.title', label: 'Carte 3 - Titre', help: 'Titre de la troisieme carte.', input: 'text' },
  { key: 'item3.text', label: 'Carte 3 - Texte', help: 'Texte de la troisieme carte.', input: 'textarea' },
];

export const sectionModels: Record<string, SectionModel> = {
  hero: {
    id: 'hero',
    name: 'Banniere principale',
    summary: 'Grand titre, texte d introduction, boutons et photo principale.',
    fields: [
      { key: 'eyebrow', label: 'Petit texte au-dessus du titre', help: 'Exemple: Musique, Contact, Services.', input: 'text' },
      { key: 'primaryCta.label', label: 'Bouton principal - Texte', help: 'Texte du bouton principal.', input: 'text' },
      { key: 'primaryCta.href', label: 'Bouton principal - Lien', help: 'Lien du bouton principal.', input: 'url' },
      { key: 'secondaryCta.label', label: 'Bouton secondaire - Texte', help: 'Texte du bouton secondaire.', input: 'text' },
      { key: 'secondaryCta.href', label: 'Bouton secondaire - Lien', help: 'Lien du bouton secondaire.', input: 'url' },
      { key: 'overlay', label: 'Style de voile', help: 'Ambiance visuelle du voile sur la photo (clair, doux, sombre).', input: 'text' },
    ],
  },
  cards: {
    id: 'cards',
    name: 'Cartes de contenu',
    summary: 'Serie de cartes avec titre et texte (services, valeurs, infos).',
    fields: sharedCardsFields,
  },
  process: {
    id: 'process',
    name: 'Etapes du parcours',
    summary: 'Bloc en etapes numerotees.',
    fields: [
      { key: 'step1.title', label: 'Etape 1 - Titre', help: 'Titre de la premiere etape.', input: 'text' },
      { key: 'step1.text', label: 'Etape 1 - Texte', help: 'Texte de la premiere etape.', input: 'textarea' },
      { key: 'step2.title', label: 'Etape 2 - Titre', help: 'Titre de la deuxieme etape.', input: 'text' },
      { key: 'step2.text', label: 'Etape 2 - Texte', help: 'Texte de la deuxieme etape.', input: 'textarea' },
      { key: 'step3.title', label: 'Etape 3 - Titre', help: 'Titre de la troisieme etape.', input: 'text' },
      { key: 'step3.text', label: 'Etape 3 - Texte', help: 'Texte de la troisieme etape.', input: 'textarea' },
    ],
  },
  trustStrip: {
    id: 'trustStrip',
    name: 'Bande de confiance',
    summary: 'Petits arguments de reassurance affiches en ligne.',
    fields: [
      { key: 'trust1.title', label: 'Argument 1 - Titre', help: 'Titre court du premier argument.', input: 'text' },
      { key: 'trust1.text', label: 'Argument 1 - Texte', help: 'Texte du premier argument.', input: 'textarea' },
      { key: 'trust2.title', label: 'Argument 2 - Titre', help: 'Titre court du deuxieme argument.', input: 'text' },
      { key: 'trust2.text', label: 'Argument 2 - Texte', help: 'Texte du deuxieme argument.', input: 'textarea' },
      { key: 'trust3.title', label: 'Argument 3 - Titre', help: 'Titre court du troisieme argument.', input: 'text' },
      { key: 'trust3.text', label: 'Argument 3 - Texte', help: 'Texte du troisieme argument.', input: 'textarea' },
      { key: 'trust4.title', label: 'Argument 4 - Titre', help: 'Titre court du quatrieme argument.', input: 'text' },
      { key: 'trust4.text', label: 'Argument 4 - Texte', help: 'Texte du quatrieme argument.', input: 'textarea' },
    ],
  },
  contactInfo: {
    id: 'contactInfo',
    name: 'Contact direct',
    summary: 'Coordonnees et boutons de contact.',
    fields: [
      { key: 'email', label: 'Adresse email', help: 'Email de contact principal.', input: 'text' },
      { key: 'phone', label: 'Numero de telephone', help: 'Numero de telephone visible.', input: 'text' },
      { key: 'button1.label', label: 'Bouton 1 - Texte', help: 'Texte du premier bouton de contact.', input: 'text' },
      { key: 'button1.href', label: 'Bouton 1 - Lien', help: 'Lien du premier bouton de contact.', input: 'url' },
      { key: 'button2.label', label: 'Bouton 2 - Texte', help: 'Texte du deuxieme bouton de contact.', input: 'text' },
      { key: 'button2.href', label: 'Bouton 2 - Lien', help: 'Lien du deuxieme bouton de contact.', input: 'url' },
    ],
  },
  socialLinks: {
    id: 'socialLinks',
    name: 'Liens reseaux sociaux',
    summary: 'Liens vers Spotify, YouTube, Instagram, Facebook.',
    fields: [
      { key: 'spotify', label: 'Lien Spotify', help: 'Lien vers la page Spotify.', input: 'url' },
      { key: 'youtube', label: 'Lien YouTube', help: 'Lien vers la chaine YouTube.', input: 'url' },
      { key: 'instagram', label: 'Lien Instagram', help: 'Lien vers le compte Instagram.', input: 'url' },
      { key: 'facebook', label: 'Lien Facebook', help: 'Lien vers la page Facebook.', input: 'url' },
    ],
  },
  finalCta: {
    id: 'finalCta',
    name: 'Bloc appel a l action final',
    summary: 'Grande zone de conclusion avec boutons.',
    fields: [
      { key: 'cta1.label', label: 'Bouton principal - Texte', help: 'Texte du bouton principal final.', input: 'text' },
      { key: 'cta1.href', label: 'Bouton principal - Lien', help: 'Lien du bouton principal final.', input: 'url' },
      { key: 'cta2.label', label: 'Bouton secondaire - Texte', help: 'Texte du bouton secondaire final.', input: 'text' },
      { key: 'cta2.href', label: 'Bouton secondaire - Lien', help: 'Lien du bouton secondaire final.', input: 'url' },
    ],
  },
  generic: {
    id: 'generic',
    name: 'Section simple',
    summary: 'Titre, texte, bouton et image.',
    fields: [],
  },
};

function hasKey(key: string, values: string[]) {
  return values.some((value) => key.includes(value));
}

export function inferSectionModel(sectionKey: string): SectionModel {
  const normalized = sectionKey.toLowerCase();

  if (hasKey(normalized, ['hero'])) return sectionModels.hero;
  if (hasKey(normalized, ['trust', 'reassurance'])) return sectionModels.trustStrip;
  if (hasKey(normalized, ['process', 'steps', 'how'])) return sectionModels.process;
  if (hasKey(normalized, ['contact'])) return sectionModels.contactInfo;
  if (hasKey(normalized, ['social', 'platform'])) return sectionModels.socialLinks;
  if (hasKey(normalized, ['final-cta', 'final_cta', 'cta-final'])) return sectionModels.finalCta;
  if (hasKey(normalized, ['cards', 'services', 'offers', 'about', 'package', 'portfolio'])) return sectionModels.cards;

  return sectionModels.generic;
}
