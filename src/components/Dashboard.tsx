import React, { useState, useEffect } from 'react';
import {
  Scale,
  Printer,
  RotateCcw,
  LogOut,
  Calendar,
  Clock,
  Truck,
  Hash,
  AlertTriangle,
  FileText,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import {
  BillFormData,
  INITIAL_FORM_DATA,
  SAMPLE_DATA,
  ORIGIN_X_OFFSET_CM,
  formatDateDDMMYY,
  formatTime12Hour,
  formatWeight,
} from '../layoutConfig';
import { BillView, ItemOffsets } from './BillView';
import { CalibrationPanel } from './CalibrationPanel';
import { PrintInstructionsCard } from './PrintInstructionsCard';

interface DashboardProps {
  onLogout: () => void;
}

const LOCAL_STORAGE_KEYS = {
  GLOBAL_X: 'epson_lq310_calibration_global_x',
  GLOBAL_Y: 'epson_lq310_calibration_global_y',
  ORIGIN_X_OFFSET: 'epson_lq310_origin_x_offset_cm',
  ITEM_OFFSETS: 'epson_lq310_item_offsets',
  PAGE_ORIENTATION: 'epson_lq310_page_orientation',
};

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  // Form state: NEVER stored in localStorage
  const [formData, setFormData] = useState<BillFormData>(INITIAL_FORM_DATA);

  // Calibration state: Allowed in localStorage
  const [globalOffsetX, setGlobalOffsetX] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.GLOBAL_X);
      return saved !== null ? parseFloat(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [globalOffsetY, setGlobalOffsetY] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.GLOBAL_Y);
      return saved !== null ? parseFloat(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [originXOffsetCm, setOriginXOffsetCm] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORIGIN_X_OFFSET);
      return saved !== null ? parseFloat(saved) : ORIGIN_X_OFFSET_CM;
    } catch {
      return ORIGIN_X_OFFSET_CM;
    }
  });

  const [itemOffsets, setItemOffsets] = useState<ItemOffsets>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ITEM_OFFSETS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Page Orientation: 'landscape' (Horizontal) by default, or 'portrait' (Vertical)
  const [pageOrientation, setPageOrientation] = useState<'landscape' | 'portrait'>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PAGE_ORIENTATION);
      if (saved === 'landscape' || saved === 'portrait') {
        return saved;
      }
      return 'landscape';
    } catch {
      return 'landscape';
    }
  });

  // UI Preview States
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showTestMarks, setShowTestMarks] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(0.9);
  const [activeTab, setActiveTab] = useState<'form' | 'calibration'>('form');

  // Sync calibration to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.GLOBAL_X, String(globalOffsetX));
    } catch {
      // ignore
    }
  }, [globalOffsetX]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.GLOBAL_Y, String(globalOffsetY));
    } catch {
      // ignore
    }
  }, [globalOffsetY]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORIGIN_X_OFFSET, String(originXOffsetCm));
    } catch {
      // ignore
    }
  }, [originXOffsetCm]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ITEM_OFFSETS, JSON.stringify(itemOffsets));
    } catch {
      // ignore
    }
  }, [itemOffsets]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PAGE_ORIENTATION, pageOrientation);
    } catch {
      // ignore
    }
  }, [pageOrientation]);

  // Strip page title during printing to prevent browser headers
  useEffect(() => {
    let savedTitle = '';
    const handleBeforePrint = () => {
      savedTitle = document.title;
      document.title = ' ';
    };
    const handleAfterPrint = () => {
      document.title = savedTitle || 'EPSON LQ-310 Weighbridge Bill Printer';
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  // Form field updater (auto uppercase for text)
  const updateField = (key: keyof BillFormData, val: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [key]: typeof val === 'string' ? val.toUpperCase() : val,
    }));
  };

  // Calculations
  const w1Val = parseFloat(String(formData.w1Wt).replace(/[^0-9.-]/g, ''));
  const w2Val = parseFloat(String(formData.w2Wt).replace(/[^0-9.-]/g, ''));
  const hasW1 = !isNaN(w1Val) && formData.w1Wt !== '';
  const hasW2 = !isNaN(w2Val) && formData.w2Wt !== '';
  const hasBothWeights = hasW1 && hasW2;
  const netWeight = hasBothWeights ? w1Val - w2Val : null;
  const isNetNegative = netWeight !== null && netWeight < 0;

  // Form completion check
  const isFormComplete =
    formData.customer.trim() !== '' &&
    formData.product.trim() !== '' &&
    formData.vehicle.trim() !== '' &&
    formData.w1Date.trim() !== '' &&
    formData.w1Time.trim() !== '' &&
    formData.w1Cons.trim() !== '' &&
    hasW1 &&
    formData.w2Date.trim() !== '' &&
    formData.w2Time.trim() !== '' &&
    formData.w2Cons.trim() !== '' &&
    hasW2 &&
    !isNetNegative;

  // Print Bill handler
  const handlePrintBill = () => {
    if (!isFormComplete) return;
    setShowTestMarks(false);
    const savedTitle = document.title;
    document.title = ' ';
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = savedTitle || 'EPSON LQ-310 Weighbridge Bill Printer';
      }, 800);
    }, 60);
  };

  // Print Test Sheet handler
  const handlePrintTestSheet = () => {
    setShowTestMarks(true);
    // If form is empty, load sample data so they have a visible layout to lay over against the window
    if (!formData.customer) {
      setFormData(SAMPLE_DATA);
    }
    const savedTitle = document.title;
    document.title = ' ';
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = savedTitle || 'EPSON LQ-310 Weighbridge Bill Printer';
      }, 800);
    }, 150);
  };

  // Reset calibration
  const handleResetAllCalibration = () => {
    if (window.confirm('Reset all calibration offsets (global and per-item) to 0?')) {
      setGlobalOffsetX(0);
      setGlobalOffsetY(0);
      setOriginXOffsetCm(ORIGIN_X_OFFSET_CM);
      setItemOffsets({});
      setPageOrientation('landscape');
      localStorage.removeItem(LOCAL_STORAGE_KEYS.GLOBAL_X);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.GLOBAL_Y);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ORIGIN_X_OFFSET);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ITEM_OFFSETS);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.PAGE_ORIENTATION);
    }
  };

  const handleLoadSample = () => {
    setFormData(SAMPLE_DATA);
  };

  const handleClearForm = () => {
    setFormData(INITIAL_FORM_DATA);
  };

  const dynamicPageSize =
    pageOrientation === 'landscape'
      ? '21.5cm 14cm landscape'
      : '14cm 21.5cm portrait';

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Dynamic @page sizing rule to eliminate headers and set orientation */}
      <style>
        {`
          @page {
            size: ${dynamicPageSize};
            margin: 0mm !important;
          }
        `}
      </style>
      {/* Top Navigation Bar (Screen Only) */}
      <header className="screen-only bg-stone-900 border-b border-stone-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold font-mono text-white tracking-wide">
                EPSON LQ-310 WEIGHBRIDGE
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                READY
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-mono">
              21.5 x 14.0 cm Continuous Feed Dot-Matrix Layout (10 CPI / 0.1 mm precision)
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Print Layout Switcher */}
          <div className="flex items-center gap-1 bg-stone-850 p-1 rounded-lg border border-stone-700">
            <span className="text-[10px] text-stone-400 px-1 font-mono">Layout:</span>
            <button
              type="button"
              onClick={() => setPageOrientation('landscape')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer transition flex items-center gap-1 ${
                pageOrientation === 'landscape'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
              title="Landscape: Horizontal across platen between sprocket holes (Recommended)"
            >
              <span>▱ Landscape (Horizontal)</span>
            </button>
            <button
              type="button"
              onClick={() => setPageOrientation('portrait')}
              className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer transition flex items-center gap-1 ${
                pageOrientation === 'portrait'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
              title="Portrait: Vertical along feed direction"
            >
              <span>▯ Portrait (Vertical)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 text-xs font-mono rounded-lg border border-stone-700 cursor-pointer transition"
            title="Load reference test bill: AMARAKOON, 43-4650, 6340 kg / 2890 kg"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Sample Data</span>
          </button>

          <button
            type="button"
            onClick={handlePrintTestSheet}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono rounded-lg cursor-pointer transition font-medium"
            title="Prints 1cm ruler tick marks and (0,0) origin cross for window light alignment"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Test Sheet</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-red-950/60 border border-stone-800 hover:border-red-800/80 text-stone-400 hover:text-red-300 text-xs font-mono rounded-lg cursor-pointer transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-[1750px] mx-auto w-full">
        {/* Left Column: Form & Calibration (5 cols) */}
        <div className="screen-only xl:col-span-5 space-y-5">
          {/* Print Instructions Banner */}
          <PrintInstructionsCard
            pageOrientation={pageOrientation}
            onToggleOrientation={() =>
              setPageOrientation((p) => (p === 'landscape' ? 'portrait' : 'landscape'))
            }
          />

          {/* Tab Switcher: Form vs Calibration */}
          <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-800">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Weighbridge Entry Form</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('calibration')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'calibration'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Calibration Tools</span>
              {(globalOffsetX !== 0 || globalOffsetY !== 0 || Object.keys(itemOffsets).length > 0) && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          </div>

          {/* Tab 1: Operator Entry Form */}
          {activeTab === 'form' ? (
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <h2 className="text-sm font-bold font-mono text-stone-200 uppercase tracking-wider flex items-center gap-2">
                  <span>BILL DATA ENTRY</span>
                </h2>
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="text-[11px] text-stone-500 hover:text-stone-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>

              {/* General Vehicle & Customer Details */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono text-stone-400 mb-1">
                    CUSTOMER NAME (CUST,NAME)
                  </label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => updateField('customer', e.target.value)}
                    placeholder="e.g. AMARAKOON"
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-400 mb-1">
                      PRODUCT
                    </label>
                    <input
                      type="text"
                      value={formData.product}
                      onChange={(e) => updateField('product', e.target.value)}
                      placeholder="e.g. N/D"
                      className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-400 mb-1">
                      VEHICLE NUMBER
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={formData.vehicle}
                        onChange={(e) => updateField('vehicle', e.target.value)}
                        placeholder="e.g. 43-4650"
                        className="w-full pl-9 pr-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Echo Checkbox */}
                <div className="pt-1">
                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-stone-850 border border-stone-800 hover:bg-stone-800/80 cursor-pointer text-xs font-mono text-stone-300">
                    <input
                      type="checkbox"
                      checked={formData.echoVehicle}
                      onChange={(e) => updateField('echoVehicle', e.target.checked)}
                      className="rounded border-stone-600 text-amber-500 focus:ring-amber-500 bg-stone-900 w-4 h-4 cursor-pointer"
                    />
                    <span>Print vehicle number on the extra top line</span>
                  </label>
                </div>
              </div>

              {/* 1st Weight Block */}
              <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    <span>1ST WEIGHT (GROSS / INITIAL)</span>
                  </span>
                  <span className="text-[10px] text-stone-400">Row 1 (Y: 5.35-7.45cm)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono text-stone-400 mb-1">DATE</label>
                    <input
                      type="date"
                      value={formData.w1Date}
                      onChange={(e) => updateField('w1Date', e.target.value)}
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-500"
                    />
                    <div className="text-[9px] text-stone-500 font-mono mt-0.5">
                      {formatDateDDMMYY(formData.w1Date) || 'DD-MM-YY'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-stone-400 mb-1">TIME</label>
                    <input
                      type="time"
                      value={formData.w1Time}
                      onChange={(e) => updateField('w1Time', e.target.value)}
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-500"
                    />
                    <div className="text-[9px] text-stone-500 font-mono mt-0.5">
                      {formatTime12Hour(formData.w1Time) || '12:00 PM'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-stone-400 mb-1">
                      CONSEC NUM
                    </label>
                    <input
                      type="text"
                      value={formData.w1Cons}
                      onChange={(e) => updateField('w1Cons', e.target.value)}
                      placeholder="074225"
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded text-xs text-stone-200 font-mono uppercase focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-amber-300 font-bold mb-1">
                      WEIGHT (KG)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={formData.w1Wt}
                      onChange={(e) => updateField('w1Wt', e.target.value)}
                      placeholder="6340"
                      className="w-full px-2 py-1.5 bg-stone-900 border border-amber-600/50 rounded text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400 text-right"
                    />
                    <div className="text-[9px] text-amber-500/80 font-mono mt-0.5 text-right">
                      {formatWeight(formData.w1Wt) || '0 kg'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2nd Weight Block */}
              <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    <span>2ND WEIGHT (TARE / FINAL)</span>
                  </span>
                  <span className="text-[10px] text-stone-400">Row 2 (Y: 7.95-9.35cm)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono text-stone-400 mb-1">DATE</label>
                    <input
                      type="date"
                      value={formData.w2Date}
                      onChange={(e) => updateField('w2Date', e.target.value)}
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded text-xs text-stone-200 font-mono focus:outline-none focus:border-cyan-500"
                    />
                    <div className="text-[9px] text-stone-500 font-mono mt-0.5">
                      {formatDateDDMMYY(formData.w2Date) || 'DD-MM-YY'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-stone-400 mb-1">TIME</label>
                    <input
                      type="time"
                      value={formData.w2Time}
                      onChange={(e) => updateField('w2Time', e.target.value)}
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded text-xs text-stone-200 font-mono focus:outline-none focus:border-cyan-500"
                    />
                    <div className="text-[9px] text-stone-500 font-mono mt-0.5">
                      {formatTime12Hour(formData.w2Time) || '12:00 PM'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-stone-400 mb-1">
                      CONSEC NUM
                    </label>
                    <input
                      type="text"
                      value={formData.w2Cons}
                      onChange={(e) => updateField('w2Cons', e.target.value)}
                      placeholder="074227"
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-700 rounded text-xs text-stone-200 font-mono uppercase focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-cyan-300 font-bold mb-1">
                      WEIGHT (KG)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={formData.w2Wt}
                      onChange={(e) => updateField('w2Wt', e.target.value)}
                      placeholder="2890"
                      className="w-full px-2 py-1.5 bg-stone-900 border border-cyan-600/50 rounded text-xs text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-400 text-right"
                    />
                    <div className="text-[9px] text-cyan-500/80 font-mono mt-0.5 text-right">
                      {formatWeight(formData.w2Wt) || '0 kg'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Weight Display & Status */}
              <div className="p-4 rounded-xl border bg-stone-950/80 border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-stone-400">
                    CALCULATED NET WEIGHT (1ST - 2ND)
                  </span>
                  <span className="text-[10px] font-mono text-stone-500">Auto-calculated</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-mono font-extrabold text-white">
                    {netWeight !== null && !isNetNegative ? (
                      <span className="text-emerald-400">{Math.round(netWeight)} kg</span>
                    ) : (
                      <span className="text-stone-600">-- kg</span>
                    )}
                  </span>
                  {netWeight !== null && !isNetNegative && (
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                      VALID
                    </span>
                  )}
                </div>

                {/* Validation Warnings */}
                {(!hasW1 || !hasW2) && (
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90 pt-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Enter both 1st Weight and 2nd Weight to calculate Net Weight.</span>
                  </div>
                )}

                {isNetNegative && (
                  <div className="flex items-center gap-2 text-xs font-mono text-red-400 pt-1 bg-red-950/50 p-2 rounded border border-red-800/60">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>
                      WARNING: Net Weight is negative ({Math.round(netWeight!)} kg). 1st Weight must
                      be greater than or equal to 2nd Weight.
                    </span>
                  </div>
                )}
              </div>

              {/* Print Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePrintBill}
                  disabled={!isFormComplete}
                  className={`w-full py-3.5 px-4 rounded-xl font-mono font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-xl transition-all ${
                    isFormComplete
                      ? 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 shadow-amber-500/20 cursor-pointer'
                      : 'bg-stone-800 text-stone-500 border border-stone-700/60 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Printer className="w-5 h-5" />
                  <span>PRINT WEIGHBRIDGE BILL</span>
                </button>

                {!isFormComplete && (
                  <p className="text-[11px] text-stone-500 font-mono text-center mt-2">
                    {isNetNegative
                      ? 'Print disabled: Net Weight cannot be negative.'
                      : 'Print disabled: Fill Customer, Product, Vehicle, and all 1st & 2nd Weight fields.'}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Tab 2: Calibration Tools */
            <CalibrationPanel
              globalOffsetX={globalOffsetX}
              setGlobalOffsetX={setGlobalOffsetX}
              globalOffsetY={globalOffsetY}
              setGlobalOffsetY={setGlobalOffsetY}
              originXOffsetCm={originXOffsetCm}
              setOriginXOffsetCm={setOriginXOffsetCm}
              itemOffsets={itemOffsets}
              setItemOffsets={setItemOffsets}
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              showTestMarks={showTestMarks}
              setShowTestMarks={setShowTestMarks}
              pageOrientation={pageOrientation}
              setPageOrientation={setPageOrientation}
              onPrintTestSheet={handlePrintTestSheet}
              onResetAll={handleResetAllCalibration}
              selectedItemId={selectedItemId}
              setSelectedItemId={setSelectedItemId}
            />
          )}
        </div>

        {/* Right Column: Live Bill Preview (7 cols) */}
        <div className="xl:col-span-7 flex flex-col space-y-3">
          {/* Preview Controls Bar (Screen Only) */}
          <div className="screen-only bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2 font-mono text-xs text-stone-300">
              <span className="font-bold text-amber-400">LIVE PREVIEW</span>
              <span className="text-stone-600">|</span>
              <span className="text-[11px] text-stone-400">
                {pageOrientation === 'landscape' ? '21.5 cm x 14.0 cm (Landscape)' : '14.0 cm x 21.5 cm (Portrait)'}
              </span>
              <span className="text-stone-600">|</span>
              <span className="text-[11px] text-stone-400">
                Offsets: X:{globalOffsetX >= 0 ? `+${globalOffsetX}` : globalOffsetX}mm, Y:
                {globalOffsetY >= 0 ? `+${globalOffsetY}` : globalOffsetY}mm
              </span>
            </div>

            {/* Zoom / Scale Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewZoom((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10))}
                className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-xs cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono text-stone-300 w-12 text-center">
                {Math.round(previewZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setPreviewZoom((z) => Math.min(1.5, Math.round((z + 0.1) * 10) / 10))}
                className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-xs cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewZoom(0.85)}
                className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-[11px] font-mono cursor-pointer"
                title="Reset zoom to Fit"
              >
                Fit
              </button>
              <button
                type="button"
                onClick={() => setPreviewZoom(1.0)}
                className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 text-[11px] font-mono cursor-pointer"
                title="True 100% 1:1 physical size"
              >
                100%
              </button>
            </div>
          </div>

          {/* Interactive Preview Canvas Container */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 sm:p-6 overflow-auto shadow-2xl flex items-center justify-center min-h-[580px]">
            {/* The scaled sheet wrapper for screen display */}
            <div
              className="transition-transform duration-100 ease-out origin-top-left"
              style={{
                transform: `scale(${previewZoom})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Paper representation: continuous form with side sprocket perforations visually for operator convenience */}
              <div
                className="relative bg-white text-black shadow-2xl rounded-sm border border-stone-300 select-none"
                style={{
                  width: pageOrientation === 'landscape' ? '21.5cm' : '14cm',
                  height: pageOrientation === 'landscape' ? '14cm' : '21.5cm',
                  boxShadow: '0 20px 45px rgba(0,0,0,0.6)',
                }}
              >
                {/* Sprocket hole visual guide on left & right (Screen-only aesthetic) */}
                <div className="screen-only absolute -left-6 top-0 bottom-0 w-6 flex flex-col justify-around items-center opacity-40 pointer-events-none">
                  {Array.from({ length: 11 }, (_, i) => (
                    <div
                      key={`lh-${i}`}
                      className="w-2.5 h-2.5 rounded-full border border-stone-500 bg-stone-300"
                    />
                  ))}
                </div>
                <div className="screen-only absolute -right-6 top-0 bottom-0 w-6 flex flex-col justify-around items-center opacity-40 pointer-events-none">
                  {Array.from({ length: 11 }, (_, i) => (
                    <div
                      key={`rh-${i}`}
                      className="w-2.5 h-2.5 rounded-full border border-stone-500 bg-stone-300"
                    />
                  ))}
                </div>

                {/* Perforation guide lines */}
                <div className="screen-only absolute -top-3 left-0 right-0 h-3 flex items-center justify-center text-[9px] font-mono text-stone-500">
                  --- Top Perforation Line ({pageOrientation === 'landscape' ? '21.5 cm' : '14.0 cm'}) ---
                </div>
                <div className="screen-only absolute -bottom-3 left-0 right-0 h-3 flex items-center justify-center text-[9px] font-mono text-stone-500">
                  --- Bottom Perforation Line ({pageOrientation === 'landscape' ? '21.5 cm' : '14.0 cm'}) ---
                </div>

                {/* The actual #bill DOM element that gets printed */}
                <BillView
                  formData={formData}
                  globalOffsetX={globalOffsetX}
                  globalOffsetY={globalOffsetY}
                  originXOffsetCm={originXOffsetCm}
                  itemOffsets={itemOffsets}
                  showGrid={showGrid}
                  showTestMarks={showTestMarks}
                  selectedItemId={selectedItemId}
                  onSelectItem={(id) => {
                    setSelectedItemId(id);
                    setActiveTab('calibration');
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick Inspector bar */}
          {selectedItemId && (
            <div className="screen-only bg-stone-900 border border-amber-500/40 rounded-lg p-3 text-xs font-mono flex items-center justify-between text-stone-300">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">Selected Element:</span>
                <span className="text-white font-bold">{selectedItemId}</span>
                <span className="text-stone-500">
                  (dx:{itemOffsets[selectedItemId]?.dx || 0}mm, dy:
                  {itemOffsets[selectedItemId]?.dy || 0}mm)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItemId(null)}
                className="text-stone-400 hover:text-white underline decoration-dotted"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
