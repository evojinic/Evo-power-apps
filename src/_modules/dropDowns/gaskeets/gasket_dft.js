
// DFT  : { gType: 'F', facing: 'G10', retainer: 'S', seal: 'T', seal2: 'V', sleeveM: 'G10', isoWasher: 'G10CH', retWasher: 'ZCH' }
const gasket = {
  value: 'DFT', text: 'Defender Tandem',
  maxPressure: 10000, maxFOD: 95.5, maxEOD: 95.5,
  overwrite: [
    { oKey: 'gType', val: 'F' },
    { oKey: 'facing', val: 'G10' },
    { oKey: 'retMat', val: 'S' },
    { oKey: 'seal', val: 'T' },
    { oKey: 'seal2', val: 'V' },
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

const sealsInner = [
  { value: 'T', text: 'Spring Energized PTFE' },
  { value: '8', text: 'Inc. 825 Spring Energized PTFE' },
  { value: 'V', text: 'Viton O-Ring' },
];

const sealsOuter = [
  { value: 'T', text: 'Spring Energized PTFE' },
  { value: 'V', text: 'Viton O-Ring' },
];

const categories = [
  {
    value: 'gasket_DFT',
    label: '', // label: 'Retainer and Seal Options for',
    conditions: [{ oKey: 'brand', val: 'DFT' }],
  },
];

const options = [
  {
    oKey: 'ringMat',
    category: 'gasket_DFT', label: 'Retainer Facing',
    type: 'select', default: 'G10', list: facings,
    required: true
  },
  {
    oKey: 'retMat',
    category: 'gasket_DFT', label: 'Retainer Core',
    type: 'select', default: 'S', list: retainers,
    required: true
  },
  {
    oKey: 'seal',
    category: 'gasket_DFT', label: 'Seal',
    type: 'select', default: 'T', list: sealsInner,
    required: true
  },
  {
    fKey: 'seal2',
    category: 'gasket_DFT', label: 'Remove Outer Seal',
    type: 'checkbox', default: true,
    overwrite: [{ oKey: 'brand', val: 'DF' }, { oKey: 'seal2', val: '' }]
  },
  {
    oKey: 'seal2',
    category: 'gasket_DFT', label: 'Outer/Secondary Seal',
    type: 'select', default: 'V', list: sealsOuter,
    required: true,
    // condition: ['outerSealList.length'],
  },
];

module.exports = {
  categories,
  options,
  gasket,
};
