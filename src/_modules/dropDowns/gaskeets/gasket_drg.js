
// DRG  : { gType: 'F', retainer: 'S6', seal: '2', seal2: '4' }
const gasket = {
  value: 'DRG', text: 'Defender Rescue Gasket',
  maxPressure: 7000, maxFOD: 47.8, maxEOD: 48,
  overwrite: [
    { oKey: 'gType', val: 'F' },
    { oKey: 'retMat', val: 'S6' },
    { oKey: 'seal', val: '2' },
    { oKey: 'seal2', val: '4' },
    { fKey: 'f_swSet', val: '' },
  ],
  kamm: true,
};

const retainers = [
  { value: 'S6', text: '316SS' },
  { value: 'CS', text: 'Carbon Steel' },
  { value: 'N0', text: 'Monel 400' },
];

const sealInner = [
  { value: '2',  text: 'Expanded PTFE' },
];

const sealOuter = [
  { value: '4',  text: 'Lamons 104' },
  { value: 'GX', text: 'Graphite' },
];

const categories = [
  {
    value: 'gasket_drg',
    label: '', // label: 'Retainer and Seal Options for',
    conditions: [{ oKey: 'brand', val: 'DRG' }],
  },
];

const options = [
  {
    oKey: 'retMat',
    category: 'gasket_drg', label: 'Retainer Core',
    type: 'select', default: 'S6', list: retainers,
    required: true
  },
  {
    oKey: 'seal',
    category: 'gasket_drg', label: 'Primary/Inner Seal',
    type: 'select', default: '2', list: sealInner,
    required: true
  },
  {
    oKey: 'seal2',
    category: 'gasket_drg', label: 'Outer/Secondary Seal',
    type: 'select', default: '', list: sealOuter,
    required: true
  },
  {
    oKey: 'kammPro',
    category: 'gasket_drg', label: 'Kamm Profile',
    type: 'checkbox', default: true,
    required: true,
    disabled: true,
  }
];

module.exports = {
  categories,
  options,
  gasket,
};
