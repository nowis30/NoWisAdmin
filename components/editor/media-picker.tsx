import Image from 'next/image';

import type { EditorMediaAsset } from '@/components/editor/types';

interface MediaPickerProps {
  assets: EditorMediaAsset[];
  selectedImageId: string;
  onSelect: (imageId: string) => void;
}

export function MediaPicker({ assets, selectedImageId, onSelect }: MediaPickerProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-ink">Photo de cette zone</p>
      <p className="text-xs text-slate-500">Choisis la photo a afficher ici.</p>

      <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
        <button
          type="button"
          onClick={() => onSelect('')}
          className={`w-full rounded-2xl border px-3 py-2 text-left text-sm ${
            !selectedImageId ? 'border-pine bg-white' : 'border-slate-200 bg-slate-50'
          }`}
        >
          Aucune photo
        </button>

        {assets.map((asset) => (
          <button
            key={asset.id}
            type="button"
            onClick={() => onSelect(asset.id)}
            className={`w-full rounded-2xl border p-2 text-left ${
              selectedImageId === asset.id ? 'border-pine bg-white' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white">
                <Image src={asset.url} alt={asset.altText || asset.originalName} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{asset.originalName}</p>
                <p className="truncate text-xs text-slate-500">{asset.usedInSections[0] || 'Pas encore utilisee'}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
