
// DF   : { gType: 'F', facing: 'G10', retainer: 'S', seal: 'T', sleeveM: 'G10', isoWasher: 'G10CH', retWasher: 'ZCH' }
const gasket = {
  value: 'DF', text: 'Defender',
  maxPressure: 7000, maxFOD: 95.5, maxEOD: 95.5,
  overwrite: [
    { oKey: 'gType', val: 'F' },
    { oKey: 'facing', val: 'G10' },
    { oKey: 'retMat', val: 'S' },
    { oKey: 'seal', val: 'T' },
    { oKey: 'sleeveM', val: 'G10', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'isoWasher', val: 'G10CH', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'retWasher', val: 'ZCH', ifKey: 'product', ifVal: 'ik_kit' },
  ],
};

const facings = [
  { value: 'G10', text: 'GRE G10' },
  { value: 'G11', text: 'GRE G11' },
];

const retainers = [
  { value: 'S',  text: '316SS' },
  { value: 'I8', text: 'Alloy 800/Alloy 825 ' },
  { value: 'I6', text: 'Alloy 600/Alloy 625' },
  { value: 'SD', text: 'Super Duplex - 2507 (SD)' },
  { value: 'UD', text: 'Super Duplex - 2205 (UD)' },
];

const seals = [
  { value: 'T', text: 'Spring Energized PTFE', brands: ['DF', 'DFT', 'IGS'], inner: true },
  { value: '8', text: 'Inc. 825 Spring Energized PTFE', brands: ['DF', 'DFT', 'IGS'], inner: true },
  { value: 'V', text: 'Viton O-Ring', brands: ['DF', 'DFT', 'IGS'], inner: true },
  { value: 'T', text: 'Spring Energized PTFE', brands: ['DFT'], outer: true },
  { value: 'V', text: 'Viton O-Ring', brands: ['DFT'], outer: true },
  { value: null, text: 'no seal' },
];

const categories = [
  {
    value: 'gasket_DF',
    label: '', // label: 'Retainer and Seal Options for',
    conditions: [{ oKey: 'brand', val: 'DF' }],
  },
];

const options = [
  {
    oKey: 'ringMat',
    category: 'gasket_DF', label: 'Retainer Facing',
    type: 'select', default: 'G10', list: facings,
    required: true
  },
  {
    oKey: 'retMat',
    category: 'gasket_DF', label: 'Retainer Core',
    type: 'select', default: 'S', list: retainers,
    required: true
  },
  {
    oKey: 'seal',
    category: 'gasket_DF', label: 'Seal',
    type: 'select', default: 'T', list: seals,
    required: true
  },
  {
    fKey: 'outerSeal',
    category: 'gasket_DF', label: 'Add Outer Seal',
    type: 'checkbox', default: false,
    overwrite: [{ oKey: 'brand', val: 'DFT' }]
  },
  // {
  //   oKey: 'seal2',
  //   category: 'gasket_DF', label: 'Outer/Secondary Seal',
  //   type: 'select', default: 'V', list: seals,
  //   required: true
  //   condition: ['outerSealList.length'],
  // },
];

module.exports = {
  categories,
  options,
  gasket,
};
