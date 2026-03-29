"use client";

import { useMemo, useState } from 'react';

import { ColorField } from '@/components/color-field';

interface ThemeEditorProps {
  initialTheme: {
    primaryColor: string;
    accentColor: string;
    surfaceColor: string;
    textColor: string;
    mutedColor: string;
    borderRadius: string;
  };
}

const PRESET_PALETTES = [
  {
    name: 'Nature douce',
    values: {
      primaryColor: '#1f4d4b',
      accentColor: '#d0683d',
      surfaceColor: '#f6f1e8',
      textColor: '#141826',
      mutedColor: '#64748b',
    },
  },
  {
    name: 'Soleil clair',
    values: {
      primaryColor: '#245f73',
      accentColor: '#f59e0b',
      surfaceColor: '#fffbeb',
      textColor: '#0f172a',
      mutedColor: '#475569',
    },
  },
  {
    name: 'Studio modern',
    values: {
      primaryColor: '#1d3557',
      accentColor: '#e76f51',
      surfaceColor: '#f1faee',
      textColor: '#1f2937',
      mutedColor: '#6b7280',
    },
  },
];

export function ThemeEditor({ initialTheme }: ThemeEditorProps) {
  const [theme, setTheme] = useState(initialTheme);

  const previewStyle = useMemo(
    () => ({
      backgroundColor: theme.surfaceColor,
      color: theme.textColor,
      borderRadius: theme.borderRadius,
    }),
    [theme],
  );

  function update(key: keyof typeof theme, value: string) {
    setTheme((current) => ({ ...current, [key]: value }));
  }

  return (
    <form action="/api/admin/theme-settings" method="post" className="panel p-6">
      <h3 className="text-xl font-semibold text-ink">Couleurs et style</h3>
      <p className="mt-2 text-sm text-slate-600">Choisis des couleurs claires et vois le rendu en direct.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESET_PALETTES.map((palette) => (
          <button
            key={palette.name}
            type="button"
            onClick={() => setTheme((current) => ({ ...current, ...palette.values }))}
            className="button-secondary px-4 py-2 text-xs"
          >
            {palette.name}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ColorField
          id="primaryColor"
          name="primaryColor"
          label="Couleur principale des boutons"
          help="Utilisee pour les boutons importants."
          value={theme.primaryColor}
          onChange={(value) => update('primaryColor', value)}
        />
        <ColorField
          id="accentColor"
          name="accentColor"
          label="Couleur des titres accentues"
          help="Utilisee pour mettre en avant un mot ou un titre."
          value={theme.accentColor}
          onChange={(value) => update('accentColor', value)}
        />
        <ColorField
          id="textColor"
          name="textColor"
          label="Couleur du texte principal"
          help="Texte principal lisible dans les sections."
          value={theme.textColor}
          onChange={(value) => update('textColor', value)}
        />
        <ColorField
          id="mutedColor"
          name="mutedColor"
          label="Couleur du texte secondaire"
          help="Texte d aide, descriptions courtes, infos secondaires."
          value={theme.mutedColor}
          onChange={(value) => update('mutedColor', value)}
        />
        <ColorField
          id="surfaceColor"
          name="surfaceColor"
          label="Couleur du fond principal"
          help="Fond general du site."
          value={theme.surfaceColor}
          onChange={(value) => update('surfaceColor', value)}
        />
      </div>

      <input type="hidden" name="borderRadius" value={theme.borderRadius} />

      <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-ink">Exemple visuel instantane</p>
        <div className="mt-4 border border-slate-200 p-4" style={previewStyle}>
          <h4 className="text-lg font-semibold" style={{ color: theme.accentColor }}>Titre accentue</h4>
          <p className="mt-2 text-sm" style={{ color: theme.textColor }}>Texte principal du site.</p>
          <p className="mt-1 text-sm" style={{ color: theme.mutedColor }}>Texte secondaire pour les details.</p>
          <button type="button" className="mt-3 rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: theme.primaryColor }}>
            Bouton principal
          </button>
        </div>
      </div>

      <button type="submit" className="button-primary mt-5">Enregistrer les couleurs et le style</button>
    </form>
  );
}
