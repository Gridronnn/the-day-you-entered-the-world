import React, { useState } from 'react';
import { Info, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { SourceCitation } from '../../types/history';

interface Props {
  source?: SourceCitation;
  sourceName?: string;
  sourceUrl?: string;
  dataType?: string;
  methodology?: string;
  title?: string;
}

export const SourceMethodologyPopover: React.FC<Props> = ({
  source,
  sourceName,
  sourceUrl,
  dataType,
  methodology,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const name = source?.name || sourceName || 'Verifiable Historical Archive';
  const url = source?.url || sourceUrl;
  const type = source?.dataType || dataType || 'historical_record';
  const method = source?.methodology || methodology || 'Date- and coordinate-specific historical reconstruction.';

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-neutral-600 hover:text-black bg-white hover:bg-[#FFE600] px-2 py-0.5 border border-black/30 hover:border-black rounded-md shadow-neo-xs transition-all cursor-pointer"
        title="View data source & methodology"
      >
        <Info className="w-3.5 h-3.5 text-black" />
        <span>ⓘ Source & method</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#FFFDF0] border-3 border-black rounded-2xl shadow-neo-lg p-5 space-y-3.5 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span className="font-heading font-black text-sm text-black uppercase">
                  {title || 'Source & Methodology'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 bg-white hover:bg-[#FF453A] hover:text-white border-2 border-black rounded-lg flex items-center justify-center shadow-neo-xs transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-heading">
              <div>
                <span className="text-neutral-500 uppercase text-[10px] font-black block">Data Type:</span>
                <span className="inline-block px-2 py-0.5 mt-0.5 bg-[#FFE600] border border-black rounded font-black text-black uppercase text-[10px]">
                  {type.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <span className="text-neutral-500 uppercase text-[10px] font-black block">Primary Source:</span>
                <span className="font-bold text-black">{name}</span>
              </div>

              <div>
                <span className="text-neutral-500 uppercase text-[10px] font-black block">Methodology & Basis:</span>
                <p className="text-neutral-700 leading-relaxed mt-0.5">{method}</p>
              </div>

              {url && (
                <div className="pt-1">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 underline"
                  >
                    <span>Visit Official Archive Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-[#FFE600] hover:bg-[#CCFF00] text-black font-heading font-black text-xs uppercase tracking-wider border-2 border-black rounded-lg shadow-neo-xs transition-all cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
