import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Printer,
  Grid,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Info,
} from 'lucide-react';
import { BILL } from '../layoutConfig';
import { ItemOffsets } from './BillView';

interface CalibrationPanelProps {
  globalOffsetX: number; // mm
  setGlobalOffsetX: (val: number) => void;
  globalOffsetY: number; // mm
  setGlobalOffsetY: (val: number) => void;
  originXOffsetCm: number; // cm
  setOriginXOffsetCm: (val: number) => void;
  itemOffsets: ItemOffsets;
  setItemOffsets: (offsets: ItemOffsets) => void;
  showGrid: boolean;
  setShowGrid: (val: boolean) => void;
  showTestMarks: boolean;
  setShowTestMarks: (val: boolean) => void;
  pageOrientation: 'landscape' | 'portrait';
  setPageOrientation: (val: 'landscape' | 'portrait') => void;
  onPrintTestSheet: () => void;
  onResetAll: () => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
}

export const CalibrationPanel: React.FC<CalibrationPanelProps> = ({
  globalOffsetX,
  setGlobalOffsetX,
  globalOffsetY,
  setGlobalOffsetY,
  originXOffsetCm,
  setOriginXOffsetCm,
  itemOffsets,
  setItemOffsets,
  showGrid,
  setShowGrid,
  showTestMarks,
  setShowTestMarks,
  pageOrientation,
  setPageOrientation,
  onPrintTestSheet,
  onResetAll,
  selectedItemId,
  setSelectedItemId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleItemOffsetChange = (itemId: string, axis: 'dx' | 'dy', deltaStr: string) => {
    const val = parseFloat(deltaStr);
    const newOffsets = { ...itemOffsets };
    const current = newOffsets[itemId] || { dx: 0, dy: 0 };
    newOffsets[itemId] = {
      ...current,
      [axis]: isNaN(val) ? 0 : Math.round(val * 10) / 10,
    };
    setItemOffsets(newOffsets);
  };

  const handleNudgeItem = (itemId: string, axis: 'dx' | 'dy', amount: number) => {
    const current = itemOffsets[itemId] || { dx: 0, dy: 0 };
    const newVal = Math.round((current[axis] + amount) * 10) / 10;
    const newOffsets = {
      ...itemOffsets,
      [itemId]: {
        ...current,
        [axis]: newVal,
      },
    };
    setItemOffsets(newOffsets);
  };

  const handleResetSingleItem = (itemId: string) => {
    const newOffsets = { ...itemOffsets };
    delete newOffsets[itemId];
    setItemOffsets(newOffsets);
  };

  // Filter items
  const filteredItems = BILL.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.text && item.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.field && item.field.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'header') return ['title', 'addr', 'tel'].includes(item.id);
    if (activeCategory === 'cust-prod')
      return ['custLbl', 'custVal', 'prodLbl', 'prodVal', 'vehEcho', 'vehLbl', 'vehVal'].includes(
        item.id
      );
    if (activeCategory === 'w1') return item.id.startsWith('w1');
    if (activeCategory === 'w2') return item.id.startsWith('w2');
    if (activeCategory === 'net') return item.id.startsWith('net');

    return true;
  });

  const modifiedItemsCount = Object.keys(itemOffsets).filter(
    (k) => (itemOffsets[k]?.dx || 0) !== 0 || (itemOffsets[k]?.dy || 0) !== 0
  ).length;

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl text-stone-100">
      {/* Header */}
      <div
        className="px-4 py-3 bg-stone-850 border-b border-stone-800 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold font-mono text-stone-200 uppercase tracking-wider">
            Printer Calibration & Alignment
          </h2>
          {(globalOffsetX !== 0 || globalOffsetY !== 0 || modifiedItemsCount > 0) && (
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Active Offsets ({modifiedItemsCount} items)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-stone-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-5 text-xs font-mono">
          {/* Quick Actions & Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pb-4 border-b border-stone-800">
            {/* Show Grid */}
            <label className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-800/80 border border-stone-700/60 hover:bg-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="rounded border-stone-600 text-amber-500 focus:ring-amber-500 bg-stone-900"
              />
              <Grid className="w-4 h-4 text-stone-400" />
              <span className="text-stone-300 font-medium">Show 1 cm Grid (Screen)</span>
            </label>

            {/* Show Test Marks in Preview */}
            <label className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-800/80 border border-stone-700/60 hover:bg-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={showTestMarks}
                onChange={(e) => setShowTestMarks(e.target.checked)}
                className="rounded border-stone-600 text-amber-500 focus:ring-amber-500 bg-stone-900"
              />
              <Sparkles className="w-4 h-4 text-stone-400" />
              <span className="text-stone-300 font-medium">Preview Rulers / Marks</span>
            </label>

            {/* Print Test Sheet Button */}
            <button
              type="button"
              onClick={onPrintTestSheet}
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 active:bg-amber-500/30 font-bold transition cursor-pointer"
              title="Prints sample bill with 1cm ruler ticks and (0,0) crossmark for window light overlay"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Test Sheet</span>
            </button>

            {/* Reset All Button */}
            <button
              type="button"
              onClick={onResetAll}
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-stone-800 border border-stone-700 hover:bg-red-950/40 hover:border-red-700 text-stone-400 hover:text-red-300 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Offsets</span>
            </button>
          </div>

          {/* Print Orientation & Feed Direction */}
          <div className="bg-stone-950/80 p-3.5 rounded-lg border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-300">PRINT ORIENTATION / LAYOUT MODE</span>
                <span className="text-[10px] text-stone-400">
                  (Changes physical printing direction)
                </span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-bold uppercase">
                Active: {pageOrientation.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPageOrientation('landscape')}
                className={`p-3 rounded-lg border text-left transition flex flex-col gap-1 cursor-pointer ${
                  pageOrientation === 'landscape'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-100 ring-1 ring-amber-500'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs flex items-center gap-1.5 text-white">
                    <span>LANDSCAPE (Horizontal)</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-normal">
                      Recommended
                    </span>
                  </span>
                  {pageOrientation === 'landscape' && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <p className="text-[10px] text-stone-300 leading-normal">
                  Prints horizontally across the platen between the left and right sprocket holes. Text runs parallel to the tear-off perforations.
                </p>
                <span className="text-[9px] text-amber-400/80 font-mono">
                  @page &#123; size: 21.5cm 14cm landscape; &#125;
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPageOrientation('portrait')}
                className={`p-3 rounded-lg border text-left transition flex flex-col gap-1 cursor-pointer ${
                  pageOrientation === 'portrait'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-100 ring-1 ring-amber-500'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">PORTRAIT (Vertical)</span>
                  {pageOrientation === 'portrait' && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <p className="text-[10px] text-stone-300 leading-normal">
                  Prints vertically along the feed direction. Use only if your Windows print driver already forces internal 90° rotation.
                </p>
                <span className="text-[9px] text-stone-400 font-mono">
                  @page &#123; size: 14cm 21.5cm portrait; &#125;
                </span>
              </button>
            </div>
          </div>

          {/* Global Hardware Offsets */}
          <div className="bg-stone-950/60 p-3.5 rounded-lg border border-stone-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-200">GLOBAL HARDWARE OFFSETS</span>
                <span className="text-[10px] text-stone-400">
                  (Applied to all elements on printed bill & preview)
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Stored in LocalStorage
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Global X Offset */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-stone-400 text-[11px]">
                  <span>Global X Offset (Left / Right)</span>
                  <span className="text-amber-400 font-bold">{globalOffsetX > 0 ? `+${globalOffsetX.toFixed(1)}` : globalOffsetX.toFixed(1)} mm</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setGlobalOffsetX(Math.round((globalOffsetX - 1) * 10) / 10)}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-xs"
                    title="-1.0 mm"
                  >
                    -1.0
                  </button>
                  <button
                    type="button"
                    onClick={() => setGlobalOffsetX(Math.round((globalOffsetX - 0.1) * 10) / 10)}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-xs"
                    title="-0.1 mm"
                  >
                    -0.1
                  </button>
                  <input
                    type="number"
                    step="0.1"
                    value={globalOffsetX}
                    onChange={(e) => setGlobalOffsetX(parseFloat(e.target.value) || 0)}
                    className="w-full text-center py-1 bg-stone-900 border border-stone-700 rounded text-amber-300 text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setGlobalOffsetX(Math.round((globalOffsetX + 0.1) * 10) / 10)}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-xs"
                    title="+0.1 mm"
                  >
                    +0.1
                  </button>
                  <button
                    type="button"
                    onClick={() => setGlobalOffsetX(Math.round((globalOffsetX + 1) * 10) / 10)}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-xs"
                    title="+1.0 mm"
                  >
                    +1.0
                  </button>
                </div>
              </div>

              {/* Global Y Offset */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-stone-400 text-[11px]">
                  <span>Global Y Offset (Top / Bottom)</span>
                  <span className="text-amber-400 font-bold">{globalOffsetY > 0 ? `+${globalOffsetY.toFixed(1)}` : globalOffsetY.toFixed(1)} mm</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setGlobalOffsetY(Math.round((globalOffsetY - 1) * 10) / 10)}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-xs"
                    title="-1.0 mm"
                  >
                    -1.0
                  </button>
                  <button
                    type="button"
                    onClick={() => setGlobalOffsetY(Math.round((globalOffsetY - 0.1) * 10) / 10)}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-xs"
                    title="-0.1 mm"
                  >
                    -0.1
                  </button>
                  <input
                    type="number"
                    step="0.1"
                    value={globalOffsetY}
                    onChange={(e) => setGlobalOffsetY(parseFloat(e.target.value) || 0)}
                    className="w-full text-center py-1 bg-stone-900 border border-stone-700 rounded text-amber-300 text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setGlobalOffsetY(Math.round((globalOffsetY + 0.1) * 10) / 10)}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-xs"
                    title="+0.1 mm"
                  >
                    +0.1
                  </button>
                  <button
                    type="button"
                    onClick={() => setGlobalOffsetY(Math.round((globalOffsetY + 1) * 10) / 10)}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-xs"
                    title="+1.0 mm"
                  >
                    +1.0
                  </button>
                </div>
              </div>

              {/* Sprocket-hole Origin Offset (ORIGIN_X_OFFSET_CM) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-stone-400 text-[11px]">
                  <span>Sprocket Margin (ORIGIN_X_OFFSET)</span>
                  <span className="text-cyan-400 font-bold">{originXOffsetCm.toFixed(2)} cm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="5"
                    value={originXOffsetCm}
                    onChange={(e) => setOriginXOffsetCm(parseFloat(e.target.value) || 0)}
                    className="w-full py-1 px-2.5 bg-stone-900 border border-stone-700 rounded text-cyan-300 text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setOriginXOffsetCm(0)}
                    className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-[11px]"
                    title="Set to default 0 cm"
                  >
                    0 cm
                  </button>
                  <button
                    type="button"
                    onClick={() => setOriginXOffsetCm(1.3)}
                    className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-[11px]"
                    title="Set to 1.3 cm (standard 9.5in continuous strip width)"
                  >
                    1.3 cm
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Per-Item Fine-Tuning Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-200">PER-ITEM FINE-TUNING TABLE</span>
                <span className="text-[10px] text-stone-500">
                  (Adjust specific fields to match pre-printed station form)
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 flex-wrap">
                {[
                  { id: 'all', label: 'All (32)' },
                  { id: 'header', label: 'Header' },
                  { id: 'cust-prod', label: 'Cust/Prod' },
                  { id: 'w1', label: '1st Wt' },
                  { id: 'w2', label: '2nd Wt' },
                  { id: 'net', label: 'Net Wt' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search items by ID, text, or field name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Table Container */}
            <div className="max-h-72 overflow-y-auto border border-stone-800 rounded-lg bg-stone-950">
              <table className="w-full text-left border-collapse">
                <thead className="bg-stone-900 sticky top-0 text-[10px] text-stone-400 border-b border-stone-800 z-10">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Item ID</th>
                    <th className="py-2 px-3 font-semibold">Default (X, Y)</th>
                    <th className="py-2 px-3 font-semibold">Content</th>
                    <th className="py-2 px-3 font-semibold text-center">dX (mm)</th>
                    <th className="py-2 px-3 font-semibold text-center">dY (mm)</th>
                    <th className="py-2 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-850 text-[11px]">
                  {filteredItems.map((item) => {
                    const currentOffset = itemOffsets[item.id] || { dx: 0, dy: 0 };
                    const isModified = currentOffset.dx !== 0 || currentOffset.dy !== 0;
                    const isSelected = selectedItemId === item.id;

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-stone-900/60 transition-colors ${
                          isSelected ? 'bg-amber-500/10' : ''
                        } ${isModified ? 'text-amber-200' : 'text-stone-300'}`}
                        onClick={() => setSelectedItemId(item.id)}
                      >
                        <td className="py-2 px-3 font-mono font-bold text-stone-200">
                          <div className="flex items-center gap-1.5">
                            <span className={isSelected ? 'text-amber-400' : ''}>{item.id}</span>
                            {item.cls === 'title' && (
                              <span className="text-[9px] px-1 py-0.2 bg-blue-900/50 text-blue-300 rounded">
                                title
                              </span>
                            )}
                            {item.cls === 'net' && (
                              <span className="text-[9px] px-1 py-0.2 bg-purple-900/50 text-purple-300 rounded">
                                net
                              </span>
                            )}
                            {item.align === 'right' && (
                              <span className="text-[9px] px-1 py-0.2 bg-emerald-900/50 text-emerald-300 rounded">
                                right
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-2 px-3 font-mono text-stone-400">
                          {item.x.toFixed(2)} cm, {item.y.toFixed(2)} cm
                        </td>

                        <td className="py-2 px-3 font-mono text-stone-400 max-w-[180px] truncate">
                          {item.text || `field:${item.field}`}
                        </td>

                        {/* dX control */}
                        <td className="py-1.5 px-2">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNudgeItem(item.id, 'dx', -0.5);
                              }}
                              className="w-5 h-5 flex items-center justify-center bg-stone-850 hover:bg-stone-700 text-stone-400 rounded text-[10px]"
                              title="-0.5mm"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              step="0.1"
                              value={currentOffset.dx}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                handleItemOffsetChange(item.id, 'dx', e.target.value)
                              }
                              className={`w-14 text-center py-0.5 rounded text-[11px] font-mono border ${
                                currentOffset.dx !== 0
                                  ? 'bg-amber-950/40 border-amber-600/60 text-amber-300'
                                  : 'bg-stone-900 border-stone-800 text-stone-300'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNudgeItem(item.id, 'dx', 0.5);
                              }}
                              className="w-5 h-5 flex items-center justify-center bg-stone-850 hover:bg-stone-700 text-stone-400 rounded text-[10px]"
                              title="+0.5mm"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* dY control */}
                        <td className="py-1.5 px-2">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNudgeItem(item.id, 'dy', -0.5);
                              }}
                              className="w-5 h-5 flex items-center justify-center bg-stone-850 hover:bg-stone-700 text-stone-400 rounded text-[10px]"
                              title="-0.5mm"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              step="0.1"
                              value={currentOffset.dy}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                handleItemOffsetChange(item.id, 'dy', e.target.value)
                              }
                              className={`w-14 text-center py-0.5 rounded text-[11px] font-mono border ${
                                currentOffset.dy !== 0
                                  ? 'bg-amber-950/40 border-amber-600/60 text-amber-300'
                                  : 'bg-stone-900 border-stone-800 text-stone-300'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNudgeItem(item.id, 'dy', 0.5);
                              }}
                              className="w-5 h-5 flex items-center justify-center bg-stone-850 hover:bg-stone-700 text-stone-400 rounded text-[10px]"
                              title="+0.5mm"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Reset Single Item */}
                        <td className="py-2 px-3 text-right">
                          {isModified && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResetSingleItem(item.id);
                              }}
                              className="text-[10px] text-stone-500 hover:text-amber-400 underline decoration-dotted"
                            >
                              Reset
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-stone-400" />
                Click any row to highlight the element on the live preview canvas.
              </span>
              <span>Showing {filteredItems.length} of {BILL.length} layout elements</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
