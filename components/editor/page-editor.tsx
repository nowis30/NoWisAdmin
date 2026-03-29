"use client";

import { useEffect, useMemo, useState } from 'react';

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

interface ChecklistItem {
	id: string;
	message: string;
	targetId?: string;
}

function getBlockValue(section: EditorSection, key: string) {
	return section.blocks.find((block) => block.key === key)?.value ?? '';
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
		backgroundColor: getBlockValue(section, BLOCK_STYLE_BG) || '#f8fafc',
		textColor: getBlockValue(section, BLOCK_STYLE_TEXT) || '#141826',
		contentWidth: (getBlockValue(section, BLOCK_STYLE_WIDTH) as SectionFormState['contentWidth']) || 'normal',
		verticalSpacing: (getBlockValue(section, BLOCK_STYLE_SPACING) as SectionFormState['verticalSpacing']) || 'normal',
		isActive: section.isActive,
		extraFields: getExtraFieldValues(section),
	};
}

interface PageEditorProps {
	initialPages: EditorPage[];
	mediaAssets: EditorMediaAsset[];
	suggestedMediaId?: string;
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

export function PageEditor({ initialPages, mediaAssets, suggestedMediaId }: PageEditorProps) {
	const [pages, setPages] = useState(initialPages);
	const [selectedPageId, setSelectedPageId] = useState(initialPages[0]?.id ?? '');
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
		backgroundColor: '#f8fafc',
		textColor: '#141826',
		contentWidth: 'normal',
		verticalSpacing: 'normal',
		isActive: true,
		extraFields: {},
	});
	const [isSaving, setIsSaving] = useState(false);
	const [saveMessage, setSaveMessage] = useState('');
	const [builderMessage, setBuilderMessage] = useState('');
	const [busyAction, setBusyAction] = useState<string | null>(null);
	const [isPublishing, setIsPublishing] = useState(false);
	const [libraryQuery, setLibraryQuery] = useState('');
	const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
	const [previewMode, setPreviewMode] = useState<'editing' | 'final'>('editing');
	const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);

	useEffect(() => {
		if (!selectedPage || !selectedSection) {
			return;
		}

		const latestSection = selectedPage.sections.find((section) => section.id === selectedSection.id);
		if (latestSection) {
			setForm(buildSectionForm(latestSection));
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

	async function saveSection() {
		if (!selectedSection) {
			return;
		}

		setIsSaving(true);
		setSaveMessage('Enregistrement en cours...');

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
							blocks: section.blocks.map((block) => {
								if (block.key === BLOCK_STYLE_BG) {
									return { ...block, value: form.backgroundColor };
								}

								if (block.key === BLOCK_STYLE_TEXT) {
									return { ...block, value: form.textColor };
								}

								if (block.key === BLOCK_STYLE_WIDTH) {
									return { ...block, value: form.contentWidth };
								}

								if (block.key === BLOCK_STYLE_SPACING) {
									return { ...block, value: form.verticalSpacing };
								}

								if (Object.prototype.hasOwnProperty.call(form.extraFields, block.key)) {
									return { ...block, value: form.extraFields[block.key] };
								}

								return block;
							}),
						};
					}),
				})),
			);

			setSaveMessage('Section enregistree.');
		} catch {
			setSaveMessage('Une erreur est survenue. Verifie les champs puis reessaie.');
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
	const activeSections = selectedPage.sections.filter((section) => section.isActive);
	const livePreviewMode = previewMode === 'final' ? 'final' : 'page';

	return (
		<div className="space-y-6">
			<section className="panel p-6">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Page Builder</p>
						<h3 className="mt-1 text-2xl font-semibold text-ink">{selectedPage.title}</h3>
						<p className="mt-2 text-sm text-slate-600">{selectedPage.description || 'Compose ta page section par section, puis publie.'}</p>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<span className={`rounded-full px-3 py-1 text-xs font-semibold ${selectedPage.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
							{statusLabel(selectedPage.status)}
						</span>
						{hasUnsavedChanges ? (
							<span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">Modifs non enregistrees</span>
						) : null}
						<button type="button" onClick={saveSection} disabled={isSaving || !!busyAction} className="button-secondary px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50">
							Sauver cette section
						</button>
						<button type="button" onClick={publishNow} disabled={isPublishing || !!busyAction} className="button-primary px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50">
							Publier
						</button>
					</div>
				</div>

				<div className="mt-4 flex flex-wrap gap-2">
					{pages.map((page) => (
						<button
							key={page.id}
							type="button"
							onClick={() => pickPage(page.id)}
							className={`rounded-full px-4 py-2 text-sm font-semibold ${
								page.id === selectedPage.id ? 'bg-pine text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
							}`}
						>
							{page.title}
						</button>
					))}
				</div>

				{(builderMessage || saveMessage) && (
					<p className="mt-3 text-xs text-slate-600">{builderMessage || saveMessage}</p>
				)}
			</section>

			{suggestedMediaId ? (
				<section className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
					Photo choisie. Clique sur "Retoucher" puis selectionne cette photo dans "Photo de cette zone".
				</section>
			) : null}

			<section className="grid gap-6 lg:grid-cols-[minmax(320px,0.9fr)_minmax(580px,1.4fr)_minmax(360px,1fr)] xl:grid-cols-[minmax(340px,0.95fr)_minmax(680px,1.5fr)_minmax(380px,1fr)]">
				<div className="panel flex min-h-[72vh] flex-col p-4">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Structure</p>
					<h4 className="mt-1 text-lg font-semibold text-ink">Sections de la page</h4>

					<div className="mt-4 space-y-3 overflow-y-auto pr-1">
						{selectedPage.sections.map((section, index) => (
							<SectionCard
								key={section.id}
								section={section}
								index={index}
								active={section.id === selectedSection.id}
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
								onDragStart={() => setDraggedSectionId(section.id)}
								onDragEnd={() => setDraggedSectionId(null)}
								onDropOnCard={() => reorderByDrag(section.id)}
								onDragOverCard={(event) => event.preventDefault()}
								disableMoveUp={index === 0}
								disableMoveDown={index === selectedPage.sections.length - 1}
								disableDelete={selectedPage.sections.length <= 1}
								busy={!!busyAction}
							/>
						))}
					</div>

					<div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-3">
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
									className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:border-pine hover:text-pine disabled:cursor-not-allowed disabled:opacity-50"
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
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Apercu page</p>
							<p className="mt-1 text-sm text-slate-600">
								{previewMode === 'final'
									? 'Rendu final sans repere d editeur.'
									: 'Mode edition avec controle visuel.'}
							</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<button
								type="button"
								onClick={() => setPreviewMode('editing')}
								className={`rounded-full px-3 py-1 text-xs font-semibold ${previewMode === 'editing' ? 'bg-pine text-white' : 'bg-slate-100 text-slate-700'}`}
							>
								Edition
							</button>
							<button
								type="button"
								onClick={() => setPreviewMode('final')}
								className={`rounded-full px-3 py-1 text-xs font-semibold ${previewMode === 'final' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'}`}
							>
								Apercu final
							</button>
						</div>
					</div>

					<section className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Structure rapide</p>
						<p className="mt-1 text-xs text-slate-600">Section active: {selectedSection.title || selectedSection.name}</p>
						<div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
							<button
								type="button"
								onClick={() => runBuilderAction('move-section', { sectionId: selectedSection.id, direction: 'up' }, 'Section deplacee vers le haut.')}
								disabled={!!busyAction || selectedPage.sections.findIndex((item) => item.id === selectedSection.id) === 0}
								className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
							>
								Monter
							</button>
							<button
								type="button"
								onClick={() => runBuilderAction('move-section', { sectionId: selectedSection.id, direction: 'down' }, 'Section deplacee vers le bas.')}
								disabled={
									!!busyAction ||
									selectedPage.sections.findIndex((item) => item.id === selectedSection.id) === selectedPage.sections.length - 1
								}
								className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
							>
								Descendre
							</button>
							<button
								type="button"
								onClick={() => runBuilderAction('duplicate-section', { sectionId: selectedSection.id }, 'Section dupliquee.')}
								disabled={!!busyAction}
								className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
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
								className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
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
								className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
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
						{activeSections.map((section) => {
							const previewForm = section.id === selectedSection.id ? form : buildSectionForm(section);
							return <LivePreview key={section.id} section={section} form={previewForm} mediaAssets={mediaAssets} mode={livePreviewMode} />;
						})}
						{activeSections.length === 0 ? (
							<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
								Aucune section visible. Active au moins une section pour voir la page.
							</div>
						) : null}
					</div>
				</div>

				<div className="space-y-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-1">
					<SectionEditor
						section={selectedSection}
						sectionModel={selectedModel}
						form={form}
						mediaAssets={mediaAssets}
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
						onSave={saveSection}
						isSaving={isSaving}
						saveMessage={saveMessage}
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
