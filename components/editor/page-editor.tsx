"use client";

import { useEffect, useMemo, useState } from 'react';

import { ImageStyleModal } from '@/components/editor/image-style-modal';
import { LivePreview } from '@/components/editor/live-preview';
import { SectionCard } from '@/components/editor/section-card';
import { SectionEditor } from '@/components/editor/section-editor';
import type { EditorPage, EditorSection, EditorMediaAsset, SectionFormState } from '@/components/editor/types';
import { BLOCK_LIBRARY } from '@/lib/block-library';
import { inferSectionModel } from '@/lib/site-section-model';

const BLOCK_STYLE_BG = 'style.backgroundColor';
const BLOCK_STYLE_TEXT = 'style.textColor';
const BLOCK_STYLE_WIDTH = 'style.contentWidth';
const BLOCK_STYLE_SPACING = 'style.verticalSpacing';
const BLOCK_STYLE_ALIGN = 'style.contentAlign';
const BLOCK_STYLE_HEADING = 'style.headingScale';
const BLOCK_STYLE_MOBILE_SPACING = 'style.mobileSpacing';
const BLOCK_STYLE_MOBILE_ALIGN = 'style.mobileAlign';
const BLOCK_IMAGE_ALT = 'style.image.altText';
const BLOCK_IMAGE_FOCAL_X = 'style.image.focalX';
const BLOCK_IMAGE_FOCAL_Y = 'style.image.focalY';
const BLOCK_IMAGE_ZOOM = 'style.image.zoom';
const BLOCK_IMAGE_FIT = 'style.image.fit';
const BLOCK_IMAGE_RATIO = 'style.image.aspectRatio';

interface ChecklistItem {
	id: string;
	message: string;
	targetId?: string;
}

type AutosaveState = 'idle' | 'saving' | 'saved' | 'error';

type ImageStylePatch = Pick<
	SectionFormState,
	'imageAltText' | 'imageFocalX' | 'imageFocalY' | 'imageZoom' | 'imageFit' | 'imageAspectRatio'
>;

function getBlockValue(section: EditorSection, key: string) {
	return section.blocks.find((block) => block.key === key)?.value ?? '';
}

function pickImageStylePatch(form: SectionFormState): ImageStylePatch {
	return {
		imageAltText: form.imageAltText,
		imageFocalX: form.imageFocalX,
		imageFocalY: form.imageFocalY,
		imageZoom: form.imageZoom,
		imageFit: form.imageFit,
		imageAspectRatio: form.imageAspectRatio,
	};
}

function getNumberBlockValue(section: EditorSection, key: string, fallback: number, min: number, max: number) {
	const raw = Number(getBlockValue(section, key));
	if (!Number.isFinite(raw)) {
		return fallback;
	}

	return Math.max(min, Math.min(max, raw));
}

function getImageFitValue(section: EditorSection): SectionFormState['imageFit'] {
	const value = getBlockValue(section, BLOCK_IMAGE_FIT);
	return value === 'contain' ? 'contain' : 'cover';
}

function getImageRatioValue(section: EditorSection): SectionFormState['imageAspectRatio'] {
	const value = getBlockValue(section, BLOCK_IMAGE_RATIO);
	if (value === '16/9' || value === '4/3' || value === '1/1') {
		return value;
	}

	return 'auto';
}

function upsertSectionBlocks(
	section: EditorSection,
	nextValues: Array<{ key: string; value: string; label: string; kind: 'TEXT' | 'LINK' | 'RICH_TEXT' }>,
) {
	const map = new Map(section.blocks.map((block) => [block.key, block]));

	for (const entry of nextValues) {
		const existing = map.get(entry.key);
		if (existing) {
			map.set(entry.key, { ...existing, value: entry.value, label: entry.label, kind: entry.kind });
			continue;
		}

		map.set(entry.key, {
			id: `${section.id}-${entry.key}`,
			key: entry.key,
			label: entry.label,
			kind: entry.kind,
			value: entry.value,
		});
	}

	return Array.from(map.values());
}

function getExtraFieldValues(section: EditorSection) {
	const model = inferSectionModel(section.key);
	const values: Record<string, string> = {};

	for (const field of model.fields) {
		values[field.key] = getBlockValue(section, field.key);
	}

	return values;
}

function buildSectionForm(section: EditorSection): SectionFormState {
	return {
		title: section.title || '',
		subtitle: section.subtitle || '',
		description: section.description || '',
		ctaLabel: section.ctaLabel || '',
		ctaHref: section.ctaHref || '',
		imageId: section.imageId || '',
		imageAltText: getBlockValue(section, BLOCK_IMAGE_ALT) || '',
		imageFocalX: getNumberBlockValue(section, BLOCK_IMAGE_FOCAL_X, 50, 0, 100),
		imageFocalY: getNumberBlockValue(section, BLOCK_IMAGE_FOCAL_Y, 50, 0, 100),
		imageZoom: getNumberBlockValue(section, BLOCK_IMAGE_ZOOM, 1, 1, 2.5),
		imageFit: getImageFitValue(section),
		imageAspectRatio: getImageRatioValue(section),
		backgroundColor: getBlockValue(section, BLOCK_STYLE_BG) || '#f8fafc',
		textColor: getBlockValue(section, BLOCK_STYLE_TEXT) || '#141826',
		contentWidth: (getBlockValue(section, BLOCK_STYLE_WIDTH) as SectionFormState['contentWidth']) || 'normal',
		verticalSpacing: (getBlockValue(section, BLOCK_STYLE_SPACING) as SectionFormState['verticalSpacing']) || 'normal',
		contentAlign: (getBlockValue(section, BLOCK_STYLE_ALIGN) as SectionFormState['contentAlign']) || 'left',
		headingScale: (getBlockValue(section, BLOCK_STYLE_HEADING) as SectionFormState['headingScale']) || 'md',
		mobileSpacing: (getBlockValue(section, BLOCK_STYLE_MOBILE_SPACING) as SectionFormState['mobileSpacing']) || 'inherit',
		mobileAlign: (getBlockValue(section, BLOCK_STYLE_MOBILE_ALIGN) as SectionFormState['mobileAlign']) || 'inherit',
		isActive: section.isActive,
		extraFields: getExtraFieldValues(section),
	};
}

interface PageEditorProps {
	initialPages: EditorPage[];
	mediaAssets: EditorMediaAsset[];
	suggestedMediaId?: string;
	initialSelectedPageId?: string;
}

interface PageBuilderResponse {
	ok: boolean;
	pageId: string;
	sections: EditorSection[];
	duplicatedSectionId?: string;
	error?: string;
}

function statusLabel(status?: 'DRAFT' | 'PUBLISHED') {
	return status === 'PUBLISHED' ? 'Publiee' : 'Brouillon';
}

function statusBadgeClass(status?: 'DRAFT' | 'PUBLISHED') {
	return status === 'PUBLISHED'
		? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
		: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200';
}

function isValidHref(value: string) {
	const link = value.trim();
	if (!link) {
		return false;
	}

	return link.startsWith('/') || link.startsWith('#') || link.startsWith('https://') || link.startsWith('http://');
}

function getSectionChecklist(formState: SectionFormState) {
	const items: ChecklistItem[] = [];

	if (!formState.title.trim()) {
		items.push({ id: 'title', message: 'Ajoute un grand titre.', targetId: 'section-title' });
	}

	if (!formState.description.trim()) {
		items.push({ id: 'description', message: 'Ajoute un texte principal.', targetId: 'section-description' });
	}

	const ctaLabel = formState.ctaLabel.trim();
	const ctaHref = formState.ctaHref.trim();

	if (ctaLabel && !ctaHref) {
		items.push({ id: 'cta-href', message: 'Ton bouton a un texte mais pas de lien.', targetId: 'section-cta-href' });
	}

	if (!ctaLabel && ctaHref) {
		items.push({ id: 'cta-label', message: 'Ton bouton a un lien mais pas de texte.', targetId: 'section-cta-label' });
	}

	if (ctaHref && !isValidHref(ctaHref)) {
		items.push({
			id: 'cta-href-format',
			message: 'Le lien du bouton semble invalide. Utilise /page, #ancre ou https://...',
			targetId: 'section-cta-href',
		});
	}

	return items;
}

export function PageEditor({ initialPages, mediaAssets, suggestedMediaId, initialSelectedPageId }: PageEditorProps) {
	const [pages, setPages] = useState(initialPages);
	const [selectedPageId, setSelectedPageId] = useState(initialSelectedPageId ?? initialPages[0]?.id ?? '');
	const selectedPage = useMemo(() => pages.find((page) => page.id === selectedPageId) ?? pages[0], [pages, selectedPageId]);

	const [selectedSectionId, setSelectedSectionId] = useState(selectedPage?.sections[0]?.id ?? '');
	const selectedSection = useMemo(() => {
		const fallback = selectedPage?.sections[0];
		if (!selectedPage) {
			return undefined;
		}

		return selectedPage.sections.find((section) => section.id === selectedSectionId) ?? fallback;
	}, [selectedPage, selectedSectionId]);

	const [form, setForm] = useState<SectionFormState>(selectedSection ? buildSectionForm(selectedSection) : {
		title: '',
		subtitle: '',
		description: '',
		ctaLabel: '',
		ctaHref: '',
		imageId: '',
		imageAltText: '',
		imageFocalX: 50,
		imageFocalY: 50,
		imageZoom: 1,
		imageFit: 'cover',
		imageAspectRatio: 'auto',
		backgroundColor: '#f8fafc',
		textColor: '#141826',
		contentWidth: 'normal',
		verticalSpacing: 'normal',
		contentAlign: 'left',
		headingScale: 'md',
		mobileSpacing: 'inherit',
		mobileAlign: 'inherit',
		isActive: true,
		extraFields: {},
	});
	const [isImageStyleModalOpen, setIsImageStyleModalOpen] = useState(false);
	const [imageStyleBeforeEdit, setImageStyleBeforeEdit] = useState<ImageStylePatch | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [saveMessage, setSaveMessage] = useState('');
	const [autosaveState, setAutosaveState] = useState<AutosaveState>('idle');
	const [autosaveStamp, setAutosaveStamp] = useState<string>('');
	const [builderMessage, setBuilderMessage] = useState('');
	const [busyAction, setBusyAction] = useState<string | null>(null);
	const [isPublishing, setIsPublishing] = useState(false);
	const [libraryQuery, setLibraryQuery] = useState('');
	const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
	const [previewMode, setPreviewMode] = useState<'editing' | 'final'>('editing');
	const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
	const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);

	useEffect(() => {
		if (!selectedPage || !selectedSection) {
			return;
		}

		const latestSection = selectedPage.sections.find((section) => section.id === selectedSection.id);
		if (latestSection) {
			setForm(buildSectionForm(latestSection));
			setAutosaveState('idle');
			setAutosaveStamp('');
		}
	}, [selectedPage, selectedSection]);

	const hasUnsavedChanges = useMemo(() => {
		if (!selectedSection) {
			return false;
		}

		return JSON.stringify(form) !== JSON.stringify(buildSectionForm(selectedSection));
	}, [form, selectedSection]);

	const selectedChecklist = useMemo(() => getSectionChecklist(form), [form]);

	const pageChecklist = useMemo(() => {
		if (!selectedPage) {
			return [] as ChecklistItem[];
		}

		const messages: ChecklistItem[] = [];
		const activeSections = selectedPage.sections.filter((section) => section.isActive);

		if (activeSections.length === 0) {
			messages.push({ id: 'no-active-sections', message: 'Aucune section visible: la page sera vide pour les visiteurs.' });
		}

		if (!selectedPage.title.trim()) {
			messages.push({ id: 'page-title', message: 'Ajoute un nom de page clair pour te reperer rapidement.' });
		}

		return messages;
	}, [selectedPage]);

	useEffect(() => {
		if (!selectedSection || !hasUnsavedChanges || isSaving || !!busyAction) {
			return;
		}

		const timer = window.setTimeout(() => {
			void saveSection({ mode: 'autosave' });
		}, 1400);

		return () => window.clearTimeout(timer);
	}, [form, hasUnsavedChanges, selectedSection, isSaving, busyAction]);

	function focusField(targetId: string) {
		const element = document.getElementById(targetId) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
		if (!element) {
			return;
		}

		element.scrollIntoView({ behavior: 'smooth', block: 'center' });
		element.focus();
	}

	const filteredTemplates = useMemo(() => {
		const query = libraryQuery.trim().toLowerCase();
		if (!query) {
			return BLOCK_LIBRARY;
		}

		return BLOCK_LIBRARY.filter((template) => {
			const haystack = `${template.label} ${template.sectionName} ${template.description || ''}`.toLowerCase();
			return haystack.includes(query);
		});
	}, [libraryQuery]);

	function askBeforeLosingChanges() {
		if (!hasUnsavedChanges) {
			return true;
		}

		return window.confirm('Tu as des changements non enregistres. Continuer sans enregistrer ?');
	}

	function applyPageSections(pageId: string, sections: EditorSection[]) {
		const sortedSections = sections.slice().sort((a, b) => a.sortOrder - b.sortOrder);

		setPages((currentPages) =>
			currentPages.map((page) =>
				page.id === pageId
					? {
							...page,
							sections: sortedSections,
					  }
					: page,
			),
		);

		if (!selectedSectionId || !sortedSections.some((section) => section.id === selectedSectionId)) {
			const next = sortedSections[0];
			setSelectedSectionId(next?.id ?? '');
			setForm((current) => (next ? buildSectionForm(next) : current));
		}
	}

	async function runBuilderAction(action: string, data: Record<string, string>, successMessage: string) {
		if (!selectedPage) {
			return;
		}

		if (!askBeforeLosingChanges()) {
			return;
		}

		setBusyAction(action);
		setBuilderMessage('Mise a jour en cours...');

		const formData = new FormData();
		formData.set('action', action);
		for (const [key, value] of Object.entries(data)) {
			formData.set(key, value);
		}

		try {
			const response = await fetch('/api/admin/page-builder', {
				method: 'POST',
				body: formData,
			});

			const payload = (await response.json()) as PageBuilderResponse;
			if (!response.ok || !payload.ok) {
				throw new Error(payload.error || 'Action impossible pour le moment.');
			}

			applyPageSections(payload.pageId, payload.sections);
			if (payload.duplicatedSectionId) {
				setSelectedSectionId(payload.duplicatedSectionId);
			}
			setBuilderMessage(successMessage);
		} catch (error) {
			setBuilderMessage(error instanceof Error ? error.message : 'Action impossible pour le moment.');
		} finally {
			setBusyAction(null);
		}
	}

	async function reorderByDrag(targetSectionId: string) {
		if (!selectedPage || !draggedSectionId || draggedSectionId === targetSectionId) {
			return;
		}

		const targetIndex = selectedPage.sections.findIndex((item) => item.id === targetSectionId);
		if (targetIndex < 0) {
			return;
		}

		await runBuilderAction(
			'reorder-section',
			{ sectionId: draggedSectionId, targetIndex: String(targetIndex) },
			'Section reordonnee a la souris.',
		);
		setDraggedSectionId(null);
		setDragOverSectionId(null);
	}

	function pickPage(pageId: string) {
		if (!askBeforeLosingChanges()) {
			return;
		}

		const page = pages.find((item) => item.id === pageId);
		setSelectedPageId(pageId);
		const firstSection = page?.sections[0];
		setSelectedSectionId(firstSection?.id ?? '');
		setForm((current) => (firstSection ? buildSectionForm(firstSection) : current));
		setSaveMessage('');
	}

	function pickSection(section: EditorSection) {
		if (!askBeforeLosingChanges()) {
			return;
		}

		setSelectedSectionId(section.id);
		setForm(buildSectionForm(section));
		setSaveMessage('');
	}

	async function setPageStatus(status: 'DRAFT' | 'PUBLISHED') {
		if (!selectedPage) {
			return;
		}

		setBusyAction(`status-${status}`);
		setBuilderMessage('Mise a jour du statut...');

		const formData = new FormData();
		formData.set('action', 'set-page-status');
		formData.set('pageId', selectedPage.id);
		formData.set('status', status);

		try {
			const response = await fetch('/api/admin/page-builder', {
				method: 'POST',
				body: formData,
			});

			const payload = (await response.json()) as { ok?: boolean; error?: string };
			if (!response.ok || !payload.ok) {
				throw new Error(payload.error || 'Impossible de changer le statut.');
			}

			setPages((currentPages) =>
				currentPages.map((page) => (page.id === selectedPage.id ? { ...page, status } : page)),
			);
			setBuilderMessage(status === 'PUBLISHED' ? 'Page marquee comme publiee.' : 'Page remise en brouillon.');
		} catch (error) {
			setBuilderMessage(error instanceof Error ? error.message : 'Impossible de changer le statut.');
		} finally {
			setBusyAction(null);
		}
	}

	async function publishNow() {
		if (hasUnsavedChanges) {
			setBuilderMessage('Enregistre d abord la section en cours avant de publier.');
			return;
		}

		const publishIssues = [...pageChecklist, ...selectedChecklist];
		if (publishIssues.length > 0) {
			const confirmed = window.confirm(`Attention: ${publishIssues.map((issue) => issue.message).join(' ')} Continuer la publication quand meme ?`);
			if (!confirmed) {
				return;
			}
		}

		setIsPublishing(true);
		setBuilderMessage('Publication en cours...');

		const formData = new FormData();
		formData.set('notes', `Publication rapide: ${new Date().toISOString()}`);

		try {
			const response = await fetch('/api/admin/publish', {
				method: 'POST',
				body: formData,
				redirect: 'follow',
			});

			if (!response.ok) {
				throw new Error('Impossible de publier maintenant.');
			}

			await setPageStatus('PUBLISHED');
			setBuilderMessage('Publication terminee.');
		} catch (error) {
			setBuilderMessage(error instanceof Error ? error.message : 'Impossible de publier maintenant.');
		} finally {
			setIsPublishing(false);
		}
	}

	async function saveSection(options?: { mode?: 'manual' | 'autosave' }) {
		if (!selectedSection) {
			return;
		}

		const mode = options?.mode || 'manual';
		const isAutosave = mode === 'autosave';

		if (isAutosave) {
			setAutosaveState('saving');
		} else {
			setSaveMessage('Enregistrement en cours...');
		}

		setIsSaving(true);

		const body = new FormData();
		body.set('sectionId', selectedSection.id);
		body.set('title', form.title);
		body.set('subtitle', form.subtitle);
		body.set('description', form.description);
		body.set('ctaLabel', form.ctaLabel);
		body.set('ctaHref', form.ctaHref);
		body.set('imageId', form.imageId);
		body.set('isActive', form.isActive ? 'on' : 'off');
		body.set('sortOrder', String(selectedSection.sortOrder));
		body.set('styleBackgroundColor', form.backgroundColor);
		body.set('styleTextColor', form.textColor);

		const model = inferSectionModel(selectedSection.key);
		for (const field of model.fields) {
			body.set(`blockKey:${field.key}`, form.extraFields[field.key] ?? '');
			body.set(`blockLabel:${field.key}`, field.label);
			body.set(`blockKind:${field.key}`, field.input === 'textarea' ? 'RICH_TEXT' : field.input === 'url' ? 'LINK' : 'TEXT');
		}

		body.set(`blockKey:${BLOCK_STYLE_WIDTH}`, form.contentWidth);
		body.set(`blockLabel:${BLOCK_STYLE_WIDTH}`, 'Largeur du contenu de section');
		body.set(`blockKind:${BLOCK_STYLE_WIDTH}`, 'TEXT');

		body.set(`blockKey:${BLOCK_STYLE_SPACING}`, form.verticalSpacing);
		body.set(`blockLabel:${BLOCK_STYLE_SPACING}`, 'Hauteur verticale de section');
		body.set(`blockKind:${BLOCK_STYLE_SPACING}`, 'TEXT');

		body.set(`blockKey:${BLOCK_STYLE_ALIGN}`, form.contentAlign);
		body.set(`blockLabel:${BLOCK_STYLE_ALIGN}`, 'Alignement du contenu de section');
		body.set(`blockKind:${BLOCK_STYLE_ALIGN}`, 'TEXT');

		body.set(`blockKey:${BLOCK_STYLE_HEADING}`, form.headingScale);
		body.set(`blockLabel:${BLOCK_STYLE_HEADING}`, 'Intensite visuelle du titre de section');
		body.set(`blockKind:${BLOCK_STYLE_HEADING}`, 'TEXT');

		body.set(`blockKey:${BLOCK_STYLE_MOBILE_SPACING}`, form.mobileSpacing);
		body.set(`blockLabel:${BLOCK_STYLE_MOBILE_SPACING}`, 'Densite verticale mobile de section');
		body.set(`blockKind:${BLOCK_STYLE_MOBILE_SPACING}`, 'TEXT');

		body.set(`blockKey:${BLOCK_STYLE_MOBILE_ALIGN}`, form.mobileAlign);
		body.set(`blockLabel:${BLOCK_STYLE_MOBILE_ALIGN}`, 'Alignement mobile de section');
		body.set(`blockKind:${BLOCK_STYLE_MOBILE_ALIGN}`, 'TEXT');

		body.set(`blockKey:${BLOCK_IMAGE_ALT}`, form.imageAltText);
		body.set(`blockLabel:${BLOCK_IMAGE_ALT}`, 'Texte alternatif image de section');
		body.set(`blockKind:${BLOCK_IMAGE_ALT}`, 'TEXT');

		body.set(`blockKey:${BLOCK_IMAGE_FOCAL_X}`, String(form.imageFocalX));
		body.set(`blockLabel:${BLOCK_IMAGE_FOCAL_X}`, 'Position horizontale image de section');
		body.set(`blockKind:${BLOCK_IMAGE_FOCAL_X}`, 'TEXT');

		body.set(`blockKey:${BLOCK_IMAGE_FOCAL_Y}`, String(form.imageFocalY));
		body.set(`blockLabel:${BLOCK_IMAGE_FOCAL_Y}`, 'Position verticale image de section');
		body.set(`blockKind:${BLOCK_IMAGE_FOCAL_Y}`, 'TEXT');

		body.set(`blockKey:${BLOCK_IMAGE_ZOOM}`, String(form.imageZoom));
		body.set(`blockLabel:${BLOCK_IMAGE_ZOOM}`, 'Niveau de zoom image de section');
		body.set(`blockKind:${BLOCK_IMAGE_ZOOM}`, 'TEXT');

		body.set(`blockKey:${BLOCK_IMAGE_FIT}`, form.imageFit);
		body.set(`blockLabel:${BLOCK_IMAGE_FIT}`, 'Mode d ajustement image de section');
		body.set(`blockKind:${BLOCK_IMAGE_FIT}`, 'TEXT');

		body.set(`blockKey:${BLOCK_IMAGE_RATIO}`, form.imageAspectRatio);
		body.set(`blockLabel:${BLOCK_IMAGE_RATIO}`, 'Format de cadre image de section');
		body.set(`blockKind:${BLOCK_IMAGE_RATIO}`, 'TEXT');

		try {
			const response = await fetch('/api/admin/section-editor', {
				method: 'POST',
				body,
			});

			if (!response.ok) {
				throw new Error('Impossible de sauvegarder la section.');
			}

			setPages((currentPages) =>
				currentPages.map((page) => ({
					...page,
					sections: page.sections.map((section) => {
						if (section.id !== selectedSection.id) {
							return section;
						}

						return {
							...section,
							title: form.title,
							subtitle: form.subtitle || null,
							description: form.description || null,
							ctaLabel: form.ctaLabel || null,
							ctaHref: form.ctaHref || null,
							imageId: form.imageId || null,
							isActive: form.isActive,
							blocks: upsertSectionBlocks(section, [
								{ key: BLOCK_STYLE_BG, value: form.backgroundColor, label: 'Couleur de fond de section', kind: 'TEXT' },
								{ key: BLOCK_STYLE_TEXT, value: form.textColor, label: 'Couleur de texte de section', kind: 'TEXT' },
								{ key: BLOCK_STYLE_WIDTH, value: form.contentWidth, label: 'Largeur du contenu de section', kind: 'TEXT' },
								{ key: BLOCK_STYLE_SPACING, value: form.verticalSpacing, label: 'Hauteur verticale de section', kind: 'TEXT' },
								{ key: BLOCK_STYLE_ALIGN, value: form.contentAlign, label: 'Alignement du contenu de section', kind: 'TEXT' },
								{ key: BLOCK_STYLE_HEADING, value: form.headingScale, label: 'Intensite visuelle du titre de section', kind: 'TEXT' },
								{ key: BLOCK_STYLE_MOBILE_SPACING, value: form.mobileSpacing, label: 'Densite verticale mobile de section', kind: 'TEXT' },
								{ key: BLOCK_STYLE_MOBILE_ALIGN, value: form.mobileAlign, label: 'Alignement mobile de section', kind: 'TEXT' },
								{ key: BLOCK_IMAGE_ALT, value: form.imageAltText, label: 'Texte alternatif image de section', kind: 'TEXT' },
								{ key: BLOCK_IMAGE_FOCAL_X, value: String(form.imageFocalX), label: 'Position horizontale image de section', kind: 'TEXT' },
								{ key: BLOCK_IMAGE_FOCAL_Y, value: String(form.imageFocalY), label: 'Position verticale image de section', kind: 'TEXT' },
								{ key: BLOCK_IMAGE_ZOOM, value: String(form.imageZoom), label: 'Niveau de zoom image de section', kind: 'TEXT' },
								{ key: BLOCK_IMAGE_FIT, value: form.imageFit, label: 'Mode d ajustement image de section', kind: 'TEXT' },
								{ key: BLOCK_IMAGE_RATIO, value: form.imageAspectRatio, label: 'Format de cadre image de section', kind: 'TEXT' },
								...Object.entries(form.extraFields).map(([key, value]) => ({
									key,
									value,
									label: key,
									kind: 'TEXT' as const,
								})),
							]),
						};
					}),
				})),
			);

			if (isAutosave) {
				setAutosaveState('saved');
				setAutosaveStamp(new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
			} else {
				setSaveMessage('Section enregistree.');
			}
		} catch {
			if (isAutosave) {
				setAutosaveState('error');
			} else {
				setSaveMessage('Une erreur est survenue. Verifie les champs puis reessaie.');
			}
		} finally {
			setIsSaving(false);
		}
	}

	if (!selectedPage || !selectedSection) {
		return (
			<section className="panel p-6">
				<h3 className="text-xl font-semibold text-ink">Atelier des pages</h3>
				<p className="mt-2 text-sm text-slate-600">Aucune piece disponible pour le moment.</p>
			</section>
		);
	}

	const selectedModel = inferSectionModel(selectedSection.key);
	const selectedImageAsset = mediaAssets.find((asset) => asset.id === form.imageId) ?? null;
	const activeSections = selectedPage.sections.filter((section) => section.isActive);
	const livePreviewMode = previewMode === 'final' ? 'final' : 'page';
	const selectedSectionIndex = selectedPage.sections.findIndex((item) => item.id === selectedSection.id);
	const totalWarnings = selectedChecklist.length + pageChecklist.length;

	function openImageStudio() {
		setImageStyleBeforeEdit(pickImageStylePatch(form));
		setIsImageStyleModalOpen(true);
	}

	function cancelImageStudio() {
		if (imageStyleBeforeEdit) {
			setForm((current) => ({ ...current, ...imageStyleBeforeEdit }));
		}
		setIsImageStyleModalOpen(false);
		setImageStyleBeforeEdit(null);
	}

	function applyImageStudio() {
		setIsImageStyleModalOpen(false);
		setImageStyleBeforeEdit(null);
	}

	function autosaveLabel() {
		if (autosaveState === 'saving') return 'Autosave en cours...';
		if (autosaveState === 'saved') return autosaveStamp ? `Autosave effectue a ${autosaveStamp}` : 'Autosave effectue.';
		if (autosaveState === 'error') return 'Autosave en erreur.';
		return 'Autosave actif';
	}

	return (
		<div className="space-y-6">
			<section className="panel p-6">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Document ouvert</p>
						<h3 className="mt-1 text-2xl font-semibold leading-tight text-ink">{selectedPage.title}</h3>
						<p className="mt-2 text-sm text-slate-600">{selectedPage.description || 'Travaille la page section par section, sauvegarde et publie en confiance.'}</p>
						<div className="mt-3 flex flex-wrap gap-2 text-xs">
							<span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-700">Slug: /{selectedPage.slug}</span>
							<span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-700">{selectedPage.sections.length} sections</span>
							<span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-700">{activeSections.length} visibles</span>
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(selectedPage.status)}`}>
							{statusLabel(selectedPage.status)}
						</span>
						{hasUnsavedChanges ? (
							<span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">Modifs non enregistrees</span>
						) : null}
						<span className={`rounded-full px-3 py-1 text-xs font-semibold ${autosaveState === 'error' ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200' : autosaveState === 'saving' ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'}`}>
							{autosaveLabel()}
						</span>
						{autosaveState === 'error' ? (
							<button
								type="button"
								onClick={() => {
									void saveSection({ mode: 'autosave' });
								}}
								disabled={isSaving || !!busyAction}
								className="button-secondary px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
							>
								Retry autosave
							</button>
						) : null}
						{hasUnsavedChanges ? (
							<button
								type="button"
								onClick={() => {
									setForm(buildSectionForm(selectedSection));
									setSaveMessage('Modifs locales annulees.');
								}}
								disabled={isSaving || !!busyAction}
								className="button-secondary px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
							>
								Annuler les modifs
							</button>
						) : null}
						<button type="button" onClick={() => void saveSection({ mode: 'manual' })} disabled={isSaving || !!busyAction} className="button-secondary px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50">
							Sauvegarder la section
						</button>
						<button type="button" onClick={publishNow} disabled={isPublishing || !!busyAction} className="button-primary px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50">
							Publier
						</button>
					</div>
				</div>

				{(builderMessage || saveMessage) && (
					<p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">{builderMessage || saveMessage}</p>
				)}
			</section>

			{suggestedMediaId ? (
				<section className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
					Photo choisie. Clique sur "Retoucher" puis selectionne cette photo dans "Photo de cette zone".
				</section>
			) : null}

			<section className="grid gap-6 lg:grid-cols-[minmax(240px,0.72fr)_minmax(320px,0.95fr)_minmax(620px,1.45fr)_minmax(360px,1fr)]">
				<div className="panel min-h-[72vh] p-4">
					<div className="flex items-start justify-between gap-2">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Explorateur</p>
							<h4 className="mt-1 text-lg font-semibold text-ink">Pages et documents</h4>
						</div>
						<span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">{pages.length}</span>
					</div>

					<div className="mt-4 space-y-2">
						{pages.map((page) => (
							<button
								key={page.id}
								type="button"
								onClick={() => pickPage(page.id)}
								className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
									page.id === selectedPage.id
										? 'border-pine/60 bg-pine/5 shadow-[0_12px_24px_rgba(31,77,75,0.12)]'
										: 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
								}`}
							>
								<div className="flex items-start justify-between gap-2">
									<p className="text-sm font-semibold text-ink">{page.title}</p>
									<span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusBadgeClass(page.status)}`}>{statusLabel(page.status)}</span>
								</div>
								<p className="mt-1 text-xs text-slate-500">/{page.slug}</p>
								<p className="mt-2 text-xs text-slate-600">{page.sections.length} sections</p>
							</button>
						))}
					</div>

					<section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">Securite de travail</p>
						<ul className="mt-2 space-y-1 text-xs leading-5 text-emerald-800">
							<li>Brouillon et publication sont separes.</li>
							<li>Confirmation avant suppression.</li>
							<li>Checklist anti-erreur avant publication.</li>
						</ul>
					</section>
				</div>

				<div className="panel flex min-h-[72vh] flex-col p-4">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Document actif</p>
					<h4 className="mt-1 text-lg font-semibold text-ink">Structure des sections</h4>
					<p className="mt-1 text-xs text-slate-500">Glisse une section pour reordonner comme dans un vrai explorateur.</p>

					<div className="mt-4 space-y-3 overflow-y-auto pr-1">
						{selectedPage.sections.map((section, index) => (
							<SectionCard
								key={section.id}
								section={section}
								index={index}
								active={section.id === selectedSection.id}
								dropTarget={dragOverSectionId === section.id && draggedSectionId !== section.id}
								onEdit={() => pickSection(section)}
								onMoveUp={() => runBuilderAction('move-section', { sectionId: section.id, direction: 'up' }, 'Section deplacee vers le haut.')}
								onMoveDown={() => runBuilderAction('move-section', { sectionId: section.id, direction: 'down' }, 'Section deplacee vers le bas.')}
								onDuplicate={() => runBuilderAction('duplicate-section', { sectionId: section.id }, 'Section dupliquee.')}
								onDelete={() => {
									const confirmed = window.confirm('Supprimer cette section ? Cette action ne peut pas etre annulee.');
									if (!confirmed) {
										return;
									}

									runBuilderAction('delete-section', { sectionId: section.id }, 'Section supprimee.');
								}}
								onDragStart={() => {
									setDraggedSectionId(section.id);
									setDragOverSectionId(section.id);
								}}
								onDragEnd={() => {
									setDraggedSectionId(null);
									setDragOverSectionId(null);
								}}
								onDropOnCard={() => {
									setDragOverSectionId(null);
									reorderByDrag(section.id);
								}}
								onDragOverCard={(event) => {
									event.preventDefault();
									if (draggedSectionId && draggedSectionId !== section.id) {
										setDragOverSectionId(section.id);
									}
								}}
								disableMoveUp={index === 0}
								disableMoveDown={index === selectedPage.sections.length - 1}
								disableDelete={selectedPage.sections.length <= 1}
								busy={!!busyAction}
							/>
						))}
					</div>

					<div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/85 p-3">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Bibliotheque de blocs</p>
						<input
							type="text"
							value={libraryQuery}
							onChange={(event) => setLibraryQuery(event.target.value)}
							placeholder="Chercher un bloc (hero, FAQ, contact...)"
							className="mt-3"
						/>
						<div className="mt-3 grid gap-2">
							{filteredTemplates.map((template) => (
								<button
									key={template.id}
									type="button"
									onClick={() => runBuilderAction('add-section', { pageId: selectedPage.id, templateId: template.id }, `Bloc ajoute: ${template.label}.`)}
									disabled={!!busyAction}
									className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-pine hover:text-pine hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
								>
									{template.label}
								</button>
							))}
							{filteredTemplates.length === 0 ? (
								<p className="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2 text-xs text-slate-500">Aucun bloc ne correspond a ta recherche.</p>
							) : null}
						</div>
					</div>
				</div>

				<div className="panel min-h-[72vh] p-4">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Canevas</p>
							<p className="mt-1 text-sm text-slate-600">
								{previewMode === 'final'
									? 'Rendu final sans repere d editeur.'
									: 'Mode edition avec controle visuel de section.'}
							</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<button
								type="button"
								onClick={() => setPreviewMode('editing')}
								className={`rounded-full px-3 py-1 text-xs font-semibold transition ${previewMode === 'editing' ? 'bg-pine text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
							>
								Edition
							</button>
							<button
								type="button"
								onClick={() => setPreviewMode('final')}
								className={`rounded-full px-3 py-1 text-xs font-semibold transition ${previewMode === 'final' ? 'bg-slate-950 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
							>
								Apercu final
							</button>
						</div>
					</div>

					<section className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/85 p-3">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions rapides</p>
						<p className="mt-1 text-xs text-slate-600">Section active: {selectedSection.title || selectedSection.name}</p>
						<div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
							<button
								type="button"
								onClick={() => runBuilderAction('move-section', { sectionId: selectedSection.id, direction: 'up' }, 'Section deplacee vers le haut.')}
								disabled={!!busyAction || selectedSectionIndex === 0}
								className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
							>
								Monter
							</button>
							<button
								type="button"
								onClick={() => runBuilderAction('move-section', { sectionId: selectedSection.id, direction: 'down' }, 'Section deplacee vers le bas.')}
									disabled={!!busyAction || selectedSectionIndex === selectedPage.sections.length - 1}
									className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
							>
								Descendre
							</button>
							<button
								type="button"
								onClick={() => runBuilderAction('duplicate-section', { sectionId: selectedSection.id }, 'Section dupliquee.')}
								disabled={!!busyAction}
								className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-700 transition hover:border-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
							>
								Dupliquer
							</button>
							<button
								type="button"
								onClick={() =>
									runBuilderAction(
										'set-section-visibility',
										{ sectionId: selectedSection.id, isActive: selectedSection.isActive ? 'false' : 'true' },
										selectedSection.isActive ? 'Section masquee.' : 'Section affichee.',
									)
								}
								disabled={!!busyAction}
								className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
							>
								{selectedSection.isActive ? 'Masquer' : 'Afficher'}
							</button>
							<button
								type="button"
								onClick={() => {
									const confirmed = window.confirm('Supprimer cette section ? Cette action ne peut pas etre annulee.');
									if (!confirmed) {
										return;
									}

									runBuilderAction('delete-section', { sectionId: selectedSection.id }, 'Section supprimee.');
								}}
								disabled={!!busyAction || selectedPage.sections.length <= 1}
								className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
							>
								Supprimer
							</button>
						</div>
					</section>

					{previewMode === 'editing' ? (
					<div className="mt-3 flex flex-wrap gap-2">
						<button
							type="button"
							onClick={() => setPreviewDevice('mobile')}
							className={`rounded-full px-3 py-1 text-xs font-semibold ${previewDevice === 'mobile' ? 'bg-pine text-white' : 'bg-slate-100 text-slate-700'}`}
						>
							Mobile
						</button>
						<button
							type="button"
							onClick={() => setPreviewDevice('tablet')}
							className={`rounded-full px-3 py-1 text-xs font-semibold ${previewDevice === 'tablet' ? 'bg-pine text-white' : 'bg-slate-100 text-slate-700'}`}
						>
							Tablette
						</button>
						<button
							type="button"
							onClick={() => setPreviewDevice('desktop')}
							className={`rounded-full px-3 py-1 text-xs font-semibold ${previewDevice === 'desktop' ? 'bg-pine text-white' : 'bg-slate-100 text-slate-700'}`}
						>
							Desktop
						</button>
					</div>
					) : null}

					<div
						className={`mt-4 space-y-4 ${
							previewMode === 'editing' && previewDevice === 'mobile'
								? 'mx-auto max-w-sm'
								: previewMode === 'editing' && previewDevice === 'tablet'
									? 'mx-auto max-w-3xl'
									: 'max-w-none'
						}`}
					>
						<div className="rounded-[30px] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(241,245,249,0.8))] p-4 shadow-inner">
							<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Studio visuel</p>
							<p className="mt-1 text-xs text-slate-600">Clique une section pour ouvrir ses proprietes dans la colonne de droite.</p>
						</div>
						{activeSections.map((section) => {
							const previewForm = section.id === selectedSection.id ? form : buildSectionForm(section);
							return (
								<LivePreview
									key={section.id}
									section={section}
									form={previewForm}
									mediaAssets={mediaAssets}
									mode={livePreviewMode}
									selected={section.id === selectedSection.id}
									onSelect={() => pickSection(section)}
								/>
							);
						})}
						{activeSections.length === 0 ? (
							<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
								Aucune section visible. Active au moins une section pour voir la page.
							</div>
						) : null}
					</div>
				</div>

				<div className="space-y-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-1">
					<section className="panel p-4">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Statut de travail</p>
						<div className="mt-3 space-y-2 text-sm">
							<p className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
								<span className="text-slate-600">Document</span>
								<span className="font-semibold text-ink">{selectedPage.title}</span>
							</p>
							<p className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
								<span className="text-slate-600">Etat</span>
								<span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${statusBadgeClass(selectedPage.status)}`}>{statusLabel(selectedPage.status)}</span>
							</p>
							<p className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
								<span className="text-slate-600">Alertes</span>
								<span className="font-semibold text-ink">{totalWarnings}</span>
							</p>
						</div>
					</section>

					<SectionEditor
						section={selectedSection}
						sectionModel={selectedModel}
						form={form}
						mediaAssets={mediaAssets}
						onOpenImageStyle={openImageStudio}
						onChange={(patch) => setForm((current) => ({ ...current, ...patch }))}
						onChangeExtraField={(key, value) =>
							setForm((current) => ({
								...current,
								extraFields: {
									...current.extraFields,
									[key]: value,
								},
							}))
						}
						onSave={() => void saveSection({ mode: 'manual' })}
						isSaving={isSaving}
						saveMessage={saveMessage}
					/>

					<ImageStyleModal
						open={isImageStyleModalOpen}
						image={selectedImageAsset}
						value={{
							imageAltText: form.imageAltText,
							imageFocalX: form.imageFocalX,
							imageFocalY: form.imageFocalY,
							imageZoom: form.imageZoom,
							imageFit: form.imageFit,
							imageAspectRatio: form.imageAspectRatio,
						}}
						onClose={applyImageStudio}
						onCancel={cancelImageStudio}
						onLiveChange={(patch) => setForm((current) => ({ ...current, ...patch }))}
						onApply={(patch) => {
							setForm((current) => ({ ...current, ...patch }));
							applyImageStudio();
						}}
					/>

					<section className="panel p-4">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Statut de page</p>
						<div className="mt-3 flex gap-2">
							<button
								type="button"
								onClick={() => setPageStatus('DRAFT')}
								disabled={!!busyAction || selectedPage.status === 'DRAFT'}
								className="button-secondary px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
							>
								Mettre en brouillon
							</button>
							<button
								type="button"
								onClick={() => setPageStatus('PUBLISHED')}
								disabled={!!busyAction || selectedPage.status === 'PUBLISHED'}
								className="button-primary px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
							>
								Marquer comme publiee
							</button>
						</div>
					</section>

					<section className="panel p-4">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Checklist anti-oubli</p>
						<div className="mt-3 space-y-2 text-sm text-slate-700">
							{selectedChecklist.length === 0 && pageChecklist.length === 0 ? (
								<p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800">Tout est propre pour cette page.</p>
							) : null}
							{selectedChecklist.map((item) => (
								<div key={`selected-${item.id}`} className="flex items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
									<p>{item.message}</p>
									{item.targetId ? (
										<button
											type="button"
											onClick={() => focusField(item.targetId!)}
											className="rounded-lg border border-amber-300 px-2 py-1 text-xs font-semibold text-amber-800"
										>
											Corriger maintenant
										</button>
									) : null}
								</div>
							))}
							{pageChecklist.map((item) => (
								<p key={`page-${item.id}`} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">{item.message}</p>
							))}
						</div>
					</section>
				</div>
			</section>
		</div>
	);
}
