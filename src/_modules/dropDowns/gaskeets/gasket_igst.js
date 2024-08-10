
// IGST : { gType: 'F', retainer: 'PH', seal: 'N', mesh: '' }
const gasket = {
  value: 'IGST', text: 'Strainer',
  maxPressure: 2200, maxFOD: 48, maxEOD: 48,
  overwrite: [
    { oKey: 'gType', val: 'F' },
    { oKey: 'retMat', val: 'PH' },
    // { oKey: 'seal', val: 'N' },
    { oKey: 'mesh', val: '' },
  ],
};

const retainers = [
  { value: 'PH',   text: 'Phenolic (0.25)' },
  { value: 'CP',   text: 'Corrugated Profile Matrix', overwrite: [{ oKey: 'seal', val: '' }] },
  { value: 'G10',  text: 'GRE G10 (0.25)' },
  { value: 'L441', text: 'Lamons 441 (0.25)', overwrite: [{ oKey: 'seal', val: '' }] },
  { value: 'L104', text: 'Lamons 104 (0.25)', overwrite: [{ oKey: 'seal', val: '' }] },
];

const seals = [
  { value: 'T',  text: 'PTFE' },
  { value: 'N',  text: 'Nitrile' },
  { value: 'V',  text: 'Viton' },
  { value: 'E',  text: 'Pure EPDM' },
  // { value: null, text: 'no seal' },
];

const mesh = [
  { value: '20',  text: '20 gage' },
  { value: '40',  text: '40 gage' },
  { value: '60',  text: '60 gage' },
  { value: '100', text: '100 gage' },
];

const categories = [
  {
    value: 'gasket_IGST',
    label: '', // label: 'Retainer and Seal Options for',
    conditions: [{ oKey: 'brand', val: 'IGST' }],
  },
];

const options = [
  {
    oKey: 'retMat',
    category: 'gasket_IGST', label: 'Retainer Core',
    type: 'select', default: 'PH', list: retainers,
    required: true,
  },
  {
    oKey: 'seal',
    category: 'gasket_IGST', label: 'Seal',
    type: 'select', default: '', list: seals,
    required: true,
    conditions: [{ oKey: 'retMat', $in: ['PH', 'G10', 'G11'] }],
  },
  {
    oKey: 'mesh',
    category: 'gasket_IGST', label: 'Mesh',
    type: 'select', default: '', list: mesh,
    required: true,
  },
];

module.exports = {
  categories,
  options,
  gasket,
};
