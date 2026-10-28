/**
 * EPSON LQ-310 Dot-Matrix Continuous Form Layout Configuration
 * Dimensions: 21.5 cm wide x 14.0 cm tall (landscape continuous feed form)
 */

// If the Epson driver's paper size includes the sprocket-hole strips
// (e.g. 9.5 in = 24.13 cm wide), set this to the strip width, about 1.3 cm.
export const ORIGIN_X_OFFSET_CM = 0;

export interface BillItem {
  id: string;
  text?: string;
  field?:
    | 'customer'
    | 'product'
    | 'vehicle'
    | 'w1Date'
    | 'w1Time'
    | 'w1Cons'
    | 'w1Wt'
    | 'w2Date'
    | 'w2Time'
    | 'w2Cons'
    | 'w2Wt'
    | 'net';
  x: number; // in cm from left perforation line
  y: number; // in cm from top edge to top of capital letters
  cls: 'title' | 'normal' | 'net';
  align?: 'right' | 'left';
  optional?: 'echoVehicle';
}

export const BILL: BillItem[] = [
  // HEADER (left edge 2.6cm)
  { id: 'title', text: 'KMK FOOD PRODUCTS', x: 2.6, y: 0.85, cls: 'title' },
  { id: 'addr', text: 'KAWDUMUNNA,DAMBADENIYA.', x: 2.6, y: 1.3, cls: 'normal' },
  { id: 'tel', text: 'TEL 037 2266519 037 4941516', x: 2.6, y: 1.7, cls: 'normal' },
  // CUSTOMER / PRODUCT (right block)
  { id: 'custLbl', text: 'CUST,NAME :', x: 10.5, y: 2.05, cls: 'normal' },
  { id: 'custVal', field: 'customer', x: 14.2, y: 2.05, cls: 'normal' },
  { id: 'prodLbl', text: 'PRODUCT :', x: 10.5, y: 2.95, cls: 'normal' },
  { id: 'prodVal', field: 'product', x: 14.2, y: 2.95, cls: 'normal' },
  // VEHICLE
  { id: 'vehEcho', field: 'vehicle', x: 6.8, y: 2.45, cls: 'normal', optional: 'echoVehicle' },
  { id: 'vehLbl', text: 'VEHICLE', x: 2.6, y: 3.7, cls: 'normal' },
  { id: 'vehVal', field: 'vehicle', x: 6.55, y: 3.7, cls: 'normal' },
  // 1ST WEIGHT
  { id: 'w1Title', text: '1ST WEIGHT', x: 2.6, y: 5.35, cls: 'normal' },
  { id: 'w1Prod', text: 'PRODUCT', x: 2.6, y: 6.2, cls: 'normal' },
  { id: 'w1hDate', text: 'DATE', x: 4.4, y: 6.7, cls: 'normal' },
  { id: 'w1hTime', text: 'TIME', x: 8.5, y: 6.7, cls: 'normal' },
  { id: 'w1hCons', text: 'CONSEC NUM', x: 12.45, y: 6.7, cls: 'normal' },
  { id: 'w1hWt', text: 'WEIGHT', x: 18.5, y: 6.7, cls: 'normal' }, // right end of the word = 20.0cm (1.5cm from the right perforation line)
  { id: 'w1Date', field: 'w1Date', x: 4.45, y: 7.45, cls: 'normal' },
  { id: 'w1Time', field: 'w1Time', x: 8.5, y: 7.45, cls: 'normal' },
  { id: 'w1Cons', field: 'w1Cons', x: 12.5, y: 7.45, cls: 'normal' },
  { id: 'w1Wt', field: 'w1Wt', x: 20.1, y: 7.45, cls: 'normal', align: 'right' },
  // 2ND WEIGHT (printed slightly further right than the 1st block, on purpose)
  { id: 'w2Title', text: '2ND  WEIGHT', x: 2.6, y: 7.95, cls: 'normal' },
  { id: 'w2hDate', text: 'DATE', x: 4.5, y: 8.5, cls: 'normal' },
  { id: 'w2hTime', text: 'TIME', x: 8.6, y: 8.5, cls: 'normal' },
  { id: 'w2hCons', text: 'CONSEC NUM', x: 12.6, y: 8.5, cls: 'normal' },
  { id: 'w2hWt', text: 'WEIGHT', x: 18.75, y: 8.5, cls: 'normal' },
  { id: 'w2Date', field: 'w2Date', x: 4.55, y: 9.35, cls: 'normal' },
  { id: 'w2Time', field: 'w2Time', x: 8.65, y: 9.35, cls: 'normal' },
  { id: 'w2Cons', field: 'w2Cons', x: 12.65, y: 9.35, cls: 'normal' },
  { id: 'w2Wt', field: 'w2Wt', x: 20.3, y: 9.35, cls: 'normal', align: 'right' },
  { id: 'w2Prod', text: 'PRODUCT', x: 2.6, y: 10.55, cls: 'normal' },
  // NET WEIGHT (double width, bold)
  { id: 'netLbl', text: 'NET  WEIGHT', x: 2.4, y: 11.35, cls: 'net' },
  { id: 'netVal', field: 'net', x: 12.1, y: 11.35, cls: 'net' }, // e.g. "3450 kg", left aligned
];

export interface BillFormData {
  customer: string;
  product: string;
  vehicle: string;
  w1Date: string; // YYYY-MM-DD
  w1Time: string; // HH:MM
  w1Cons: string;
  w1Wt: string;
  w2Date: string; // YYYY-MM-DD
  w2Time: string; // HH:MM
  w2Cons: string;
  w2Wt: string;
  echoVehicle: boolean;
}

export const SAMPLE_DATA: BillFormData = {
  customer: 'AMARAKOON',
  product: 'N/D',
  vehicle: '43-4650',
  w1Date: '2026-10-27',
  w1Time: '12:13',
  w1Cons: '074225',
  w1Wt: '6340',
  w2Date: '2026-10-27',
  w2Time: '12:39',
  w2Cons: '074227',
  w2Wt: '2890',
  echoVehicle: true,
};

export const INITIAL_FORM_DATA: BillFormData = {
  customer: '',
  product: '',
  vehicle: '',
  w1Date: new Date().toISOString().slice(0, 10),
  w1Time: new Date().toTimeString().slice(0, 5),
  w1Cons: '',
  w1Wt: '',
  w2Date: new Date().toISOString().slice(0, 10),
  w2Time: new Date().toTimeString().slice(0, 5),
  w2Cons: '',
  w2Wt: '',
  echoVehicle: true,
};

/**
 * Format date to DD-MM-YY (e.g., 2026-10-27 -> 27-10-26)
 */
export function formatDateDDMMYY(val: string): string {
  if (!val) return '';
  const parts = val.trim().split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year.slice(-2)}`;
  }
  return val.toUpperCase();
}

/**
 * Format time to 12-hour AM/PM (e.g., 12:13 -> 12:13 PM, 09:05 -> 09:05 AM)
 */
export function formatTime12Hour(timeStr: string): string {
  if (!timeStr) return '';
  const trimmed = timeStr.trim().toUpperCase();
  if (/^\d{1,2}:\d{2}\s*(AM|PM)$/.test(trimmed)) {
    return trimmed;
  }
  const parts = trimmed.split(':');
  if (parts.length >= 2) {
    let hour = parseInt(parts[0], 10);
    const minute = parts[1].slice(0, 2);
    if (isNaN(hour)) return trimmed;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
    return `${hourStr}:${minute} ${ampm}`;
  }
  return trimmed;
}

/**
 * Format weight as whole number + " kg"
 */
export function formatWeight(wt: string | number): string {
  if (wt === '' || wt === null || wt === undefined) return '';
  const cleaned = String(wt).replace(/[^0-9.-]/g, '').trim();
  if (!cleaned) return '';
  const num = Math.round(Number(cleaned));
  if (isNaN(num)) return '';
  return `${num} kg`;
}
