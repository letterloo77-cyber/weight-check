import React from 'react';
import { Printer, AlertTriangle, Check, ShieldCheck, RefreshCw } from 'lucide-react';

interface PrintInstructionsCardProps {
  pageOrientation?: 'landscape' | 'portrait';
  onToggleOrientation?: () => void;
}

export const PrintInstructionsCard: React.FC<PrintInstructionsCardProps> = ({
  pageOrientation = 'landscape',
  onToggleOrientation,
}) => {
  return (
    <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 text-xs font-mono text-amber-100 shadow-md space-y-3">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 mt-0.5">
          <Printer className="w-5 h-5" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-amber-300 text-sm tracking-wide uppercase flex items-center gap-1.5">
              <span>EPSON LQ-310 Print Dialog Settings</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded border border-amber-500/30 font-bold uppercase">
                Active: {pageOrientation.toUpperCase()}
              </span>
              {onToggleOrientation && (
                <button
                  type="button"
                  onClick={onToggleOrientation}
                  className="text-[10px] px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded cursor-pointer transition flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Switch to {pageOrientation === 'landscape' ? 'Portrait' : 'Landscape'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Exact required note */}
          <div className="p-2.5 bg-stone-900/90 border border-amber-500/30 rounded-lg text-stone-200 text-[11px] leading-relaxed">
            <span className="text-amber-400 font-bold block mb-1">Print Dialog Configuration:</span>
            <span className="select-all font-semibold text-white">
              &quot;In the print dialog choose EPSON LQ-310, paper size 21.5 x 14 cm (custom), margins None, scale 100%, headers/footers off, black & white, Draft or normal quality.&quot;
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] text-stone-300">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Paper: 21.5 x 14.0 cm</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Layout: <strong className="text-amber-300 uppercase">{pageOrientation}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scale: Exactly 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-bold">Headers/Footers: OFF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orientation & Headers Notice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <div className="flex items-start gap-2 p-2 bg-stone-900/80 border border-amber-500/30 rounded-lg text-[10.5px] text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block">ORIENTATION SWITCH:</strong>
            If your printout comes out vertically along the sprocket holes, ensure <strong className="text-amber-300">Landscape</strong> is selected in Chrome&apos;s print dialog under &quot;Layout&quot;.
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 bg-stone-900/80 border border-stone-700 rounded-lg text-[10.5px] text-stone-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block">CLEAN SPROCKET MARGINS:</strong>
            In Chrome print dialog &rarr; <em>More settings</em> &rarr; uncheck <em>&quot;Headers and footers&quot;</em> so no date or title prints on the pin strips.
          </div>
        </div>
      </div>
    </div>
  );
};
