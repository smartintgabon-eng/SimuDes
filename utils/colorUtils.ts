
export const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace('#', '');
  if (hex.length < 6) return '#ffffff';
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export const isValidHex = (hex: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(hex);
};

export const COLOR_PALETTE = [
  { name: 'Bleu Royal', hex: '#3b82f6' },
  { name: 'Rouge Enfer', hex: '#ef4444' },
  { name: 'Émeraude', hex: '#10b981' },
  { name: 'Ambre', hex: '#f59e0b' },
  { name: 'Violet Néon', hex: '#8b5cf6' },
  { name: 'Rose Flash', hex: '#ec4899' },
  { name: 'Nuit Profonde', hex: '#1e293b' },
  { name: 'Charbon', hex: '#111827' },
  { name: 'Or Pur', hex: '#ffd700' },
  { name: 'Cyan Cybernétique', hex: '#06b6d4' }
];

export const getHexSuggestions = (input: string) => {
  if (!input.startsWith('#')) return [];
  const query = input.toLowerCase();
  return COLOR_PALETTE.filter(p => p.hex.toLowerCase().startsWith(query) || p.name.toLowerCase().includes(query.replace('#', ''))).slice(0, 5);
};
