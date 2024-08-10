
// KI   : { gType: 'F', retainer: 'S6', seal: 'Q', sleeveM: 'G10', isoWasher: 'M', retWasher: 'ZCH' }
const gasket = {
  value: 'KI', text: 'Kamm Pro Isolation',
  maxPressure: 10000, maxFOD: 47.8, maxEOD: 48,
  overwrite: [
    { oKey: 'gType', val: 'F' },
    { oKey: 'retMat', val: 'S6' },
    { oKey: 'seal', val: 'q' },
    { oKey: 'sleeveM', val: 'G10', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'isoWasher', val: 'M', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'retWasher', val: 'ZCH', ifKey: 'product', ifVal: 'ik_kit' },
  ],
  kamm: true,
};

const retainers = [
  { value: 'S6', text: '316SS' },
  { value: 'I8', text: 'Alloy 800/Alloy 825 ' },
  { value: 'I6', text: 'Alloy 600/Alloy 625' },
  { value: 'SD', text: 'Super Duplex - 2507 (SD)' },
  { value: 'UD', text: 'Super Duplex - 2205 (UD)' },
  { value: 'N0', text: 'Monel 400' },
];

const sealInner = [
  { value: 'N', text: 'Nitrile' },
  { value: 'V', text: 'Viton' },
  { value: 'E', text: 'Pure EPDM' },
  { value: 'Q', text: 'KLINGER® Quantum' },
  { value: 'T', text: 'Lamons PTFE Matrix 110' },
  // { value: 'TP', text: 'THERMa-PUR®' },
];

const categories = [
  {
    value: 'gasket_KI',
    label: '', // label: 'Retainer and Seal Options for',
    conditions: [{ oKey: 'brand', val: 'KI' }],
  },
];

const options = [
  {
    oKey: 'retMat',
    category: 'gasket_KI', label: 'Retainer Core',
    type: 'select', default: 'S6', list: retainers,
    required: true
  },
  {
    oKey: 'seal',
    category: 'gasket_KI', label: 'Seal',
    type: 'select', default: 'Q', list: sealInner,
    required: true
  },
  // {
  //   oKey: 'seal2',
  //   category: 'gasket_KI', label: 'Outer/Secondary Seal',
  //   type: 'select', list: sealOuter,
  //   required: true
  // },
  {
    oKey: 'kammPro',
    category: 'gasket_KI', label: 'Kamm Profile',
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
