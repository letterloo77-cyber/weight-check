import React from 'react';
import { Printer, AlertTriangle, Check, ShieldCheck } from 'lucide-react';

export const PrintInstructionsCard: React.FC = () => {
  return (
    <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 text-xs font-mono text-amber-100 shadow-md space-y-3">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 mt-0.5">
          <Printer className="w-5 h-5" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-amber-300 text-sm tracking-wide uppercase flex items-center gap-1.5">
              <span>EPSON LQ-310 Driver & Print Dialog Settings</span>
            </h3>
            <span className="text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded border border-amber-500/30">
              1-Page Strict • 90° Right Rotated
            </span>
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
              <span>Margins: None (0 mm)</span>
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

      {/* High-visibility alert to remove timestamps and URL from sprocket holes */}
      <div className="flex items-start gap-2.5 p-2.5 bg-red-950/40 border border-red-500/50 rounded-lg text-red-200 text-[11px] leading-normal">
        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-red-300">ELIMINATE MARGIN TEXT & TIMESTAMPS: </span>
          <span>
            In Chrome print dialog, expand <strong className="text-white">More settings</strong> and uncheck <strong className="text-white">&quot;Headers and footers&quot;</strong>. This prevents browser titles, dates (e.g. 10/28/26), and URLs from printing along the sprocket holes.
          </span>
        </div>
      </div>
    </div>
  );
};
