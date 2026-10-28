import React from 'react';
import { Printer, AlertCircle, Check, HelpCircle } from 'lucide-react';

interface PrintInstructionsCardProps {
  onPrintClick?: () => void;
  canPrint?: boolean;
}

export const PrintInstructionsCard: React.FC<PrintInstructionsCardProps> = () => {
  return (
    <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 text-xs font-mono text-amber-100 shadow-md">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 mt-0.5">
          <Printer className="w-5 h-5" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-amber-300 text-sm tracking-wide uppercase flex items-center gap-1.5">
              <span>EPSON LQ-310 Driver & Print Dialog Settings</span>
            </h3>
            <span className="text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded border border-amber-500/30">
              1-Page Strict
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
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Headers / Footers: OFF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
