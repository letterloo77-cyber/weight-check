import React from 'react';
import {
  BILL,
  BillFormData,
  BillItem,
  formatDateDDMMYY,
  formatTime12Hour,
  formatWeight,
  ORIGIN_X_OFFSET_CM,
} from '../layoutConfig';

export interface ItemOffsets {
  [itemId: string]: {
    dx: number; // in mm
    dy: number; // in mm
  };
}

interface BillViewProps {
  formData: BillFormData;
  globalOffsetX: number; // mm
  globalOffsetY: number; // mm
  originXOffsetCm?: number; // cm
  itemOffsets: ItemOffsets;
  showGrid?: boolean; // screen-only grid
  showTestMarks?: boolean; // test sheet ruler and marks
  orientation?: '0' | '90' | '180' | '270';
  previewRotated?: boolean;
  selectedItemId?: string | null;
  onSelectItem?: (itemId: string) => void;
}

export const BillView: React.FC<BillViewProps> = ({
  formData,
  globalOffsetX,
  globalOffsetY,
  originXOffsetCm = ORIGIN_X_OFFSET_CM,
  itemOffsets,
  showGrid = false,
  showTestMarks = false,
  orientation = '90',
  previewRotated = false,
  selectedItemId,
  onSelectItem,
}) => {
  // Compute calculated values
  const w1Num = parseFloat(String(formData.w1Wt).replace(/[^0-9.-]/g, ''));
  const w2Num = parseFloat(String(formData.w2Wt).replace(/[^0-9.-]/g, ''));
  const hasValidWeights = !isNaN(w1Num) && !isNaN(w2Num);
  const netWeightNum = hasValidWeights ? w1Num - w2Num : null;

  const getFieldValue = (field?: BillItem['field']): string => {
    if (!field) return '';
    switch (field) {
      case 'customer':
        return (formData.customer || '').toUpperCase();
      case 'product':
        return (formData.product || '').toUpperCase();
      case 'vehicle':
        return (formData.vehicle || '').toUpperCase();
      case 'w1Date':
        return formatDateDDMMYY(formData.w1Date);
      case 'w1Time':
        return formatTime12Hour(formData.w1Time);
      case 'w1Cons':
        return (formData.w1Cons || '').toUpperCase();
      case 'w1Wt':
        return formatWeight(formData.w1Wt);
      case 'w2Date':
        return formatDateDDMMYY(formData.w2Date);
      case 'w2Time':
        return formatTime12Hour(formData.w2Time);
      case 'w2Cons':
        return (formData.w2Cons || '').toUpperCase();
      case 'w2Wt':
        return formatWeight(formData.w2Wt);
      case 'net':
        if (netWeightNum !== null && netWeightNum >= 0) {
          return `${Math.round(netWeightNum)} kg`;
        }
        return '';
      default:
        return '';
    }
  };

  return (
    <div
      id="bill"
      className={`relative select-none print-rot-${orientation} ${
        showTestMarks ? 'test-sheet-mode' : ''
      }`}
      style={{
        width: '21.5cm',
        height: '14cm',
        backgroundColor: 'transparent',
        transform: previewRotated
          ? orientation === '90'
            ? 'translate(14cm, 0) rotate(90deg)'
            : orientation === '180'
            ? 'translate(21.5cm, 14cm) rotate(180deg)'
            : orientation === '270'
            ? 'translate(0, 21.5cm) rotate(270deg)'
            : 'none'
          : undefined,
        transformOrigin: previewRotated ? 'top left' : undefined,
      }}
    >
      {/* 1cm Screen-only calibration grid */}
      {showGrid && (
        <div
          className="screen-only absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(20, 110, 220, 0.18) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(20, 110, 220, 0.18) 1px, transparent 1px),
              linear-gradient(to right, rgba(20, 110, 220, 0.35) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(20, 110, 220, 0.35) 1px, transparent 1px)
            `,
            backgroundSize: '0.5cm 0.5cm, 0.5cm 0.5cm, 1cm 1cm, 1cm 1cm',
          }}
        >
          {/* Edge guides */}
          <div className="absolute top-0 left-0 right-0 h-4 border-b border-blue-400/30 flex text-[9px] text-blue-600 font-mono">
            {Array.from({ length: 22 }, (_, i) => (
              <span
                key={`gh-${i}`}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${i}cm` }}
              >
                {i > 0 ? `${i}` : ''}
              </span>
            ))}
          </div>
          <div className="absolute top-0 bottom-0 left-0 w-4 border-r border-blue-400/30 text-[9px] text-blue-600 font-mono">
            {Array.from({ length: 15 }, (_, i) => (
              <span
                key={`gv-${i}`}
                className="absolute transform -translate-y-1/2"
                style={{ top: `${i}cm` }}
              >
                {i > 0 ? `${i}` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Test sheet ruler ticks and origin cross (Printed during test sheet) */}
      <div className="test-mark absolute inset-0 pointer-events-none z-10">
        {/* Origin (0,0) Cross */}
        <div
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: '1cm',
            height: '1cm',
          }}
        >
          {/* Horizontal crosshair */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '0.8cm',
              height: '0.5pt',
              backgroundColor: '#000',
            }}
          />
          {/* Vertical crosshair */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '0.5pt',
              height: '0.8cm',
              backgroundColor: '#000',
            }}
          />
          <span
            className="absolute text-[8pt] font-mono font-bold"
            style={{ left: '0.15cm', top: '0.15cm' }}
          >
            (0,0)
          </span>
        </div>

        {/* 1cm Ruler ticks along TOP edge (1 to 21 cm) */}
        {Array.from({ length: 21 }, (_, i) => {
          const cm = i + 1;
          return (
            <div
              key={`tick-top-${cm}`}
              className="absolute"
              style={{
                left: `${cm}cm`,
                top: 0,
                lineHeight: 1,
              }}
            >
              <div
                style={{
                  width: '0.5pt',
                  height: cm % 5 === 0 ? '0.4cm' : '0.25cm',
                  backgroundColor: '#000',
                }}
              />
              <span
                className="font-mono text-[7pt] block transform -translate-x-1/2"
                style={{ marginTop: '1px' }}
              >
                {cm}
              </span>
            </div>
          );
        })}

        {/* 1cm Ruler ticks along LEFT edge (1 to 13 cm) */}
        {Array.from({ length: 13 }, (_, i) => {
          const cm = i + 1;
          return (
            <div
              key={`tick-left-${cm}`}
              className="absolute"
              style={{
                left: 0,
                top: `${cm}cm`,
                display: 'flex',
                alignItems: 'center',
                lineHeight: 1,
              }}
            >
              <div
                style={{
                  height: '0.5pt',
                  width: cm % 5 === 0 ? '0.4cm' : '0.25cm',
                  backgroundColor: '#000',
                }}
              />
              <span className="font-mono text-[7pt] ml-1">{cm}</span>
            </div>
          );
        })}

        {/* Perforation line indicators */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '0.5pt',
            borderRight: '1px dashed #666',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '0.5pt',
            borderBottom: '1px dashed #666',
          }}
        />
      </div>

      {/* Bill Items from layout config */}
      {BILL.map((item) => {
        // Check optional field condition
        if (item.optional === 'echoVehicle' && !formData.echoVehicle) {
          return null;
        }

        const displayText = item.text !== undefined ? item.text : getFieldValue(item.field);
        const itemOffset = itemOffsets[item.id] || { dx: 0, dy: 0 };
        const totalOffsetXmm = globalOffsetX + itemOffset.dx;
        const totalOffsetYmm = globalOffsetY + itemOffset.dy;

        // Positioning formulas:
        // Left-aligned: left: calc(Xcm + globalOffsetX + itemDx + ORIGIN_X_OFFSET_CM)
        // Right-aligned: right: calc(21.5cm - Xcm - globalOffsetX - itemDx - ORIGIN_X_OFFSET_CM)
        // Vertical: top: calc(Ycm - 0.195em + globalOffsetY + itemDy)
        const isRightAlign = item.align === 'right';

        const style: React.CSSProperties = {
          position: 'absolute',
          whiteSpace: 'pre',
          lineHeight: 1,
          fontFamily: '"Courier New", Courier, monospace',
          top: `calc(${item.y}cm - 0.195em + ${totalOffsetYmm}mm)`,
        };

        if (isRightAlign) {
          style.right = `calc(21.5cm - (${item.x + originXOffsetCm}cm + ${totalOffsetXmm}mm))`;
        } else {
          style.left = `calc(${item.x + originXOffsetCm}cm + ${totalOffsetXmm}mm)`;
        }

        const isSelected = selectedItemId === item.id;

        return (
          <div
            key={item.id}
            id={`item-${item.id}`}
            onClick={() => onSelectItem?.(item.id)}
            className={`item ${item.cls} ${
              isSelected
                ? 'outline-2 outline-dashed outline-amber-500 bg-amber-500/10 cursor-pointer'
                : onSelectItem
                ? 'hover:outline-1 hover:outline-dashed hover:outline-blue-400/60 cursor-pointer'
                : ''
            }`}
            style={style}
            title={`${item.id} [X:${item.x}cm, Y:${item.y}cm] ${
              itemOffset.dx || itemOffset.dy
                ? `(dx:${itemOffset.dx}mm, dy:${itemOffset.dy}mm)`
                : ''
            }`}
          >
            {displayText}
          </div>
        );
      })}
    </div>
  );
};
