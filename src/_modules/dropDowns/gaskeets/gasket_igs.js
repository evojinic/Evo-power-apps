
// IGS  : { gType: 'F', retainer: 'G10', seal: 'T', sleeveM: 'G10', isoWasher: 'G10CH', retWasher: 'ZCH' }
const gasket = {
  value: 'IGS', text: 'IsoGuard Spring',
  maxPressure: 2200, maxFOD: 48, maxEOD: 48,
  overwrite: [
    { oKey: 'gType', val: 'F' },
    { oKey: 'retMat', val: 'G10' },
    { oKey: 'seal', val: 'T' },
    { oKey: 'sleeveM', val: 'G10', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'isoWasher', val: 'G10CH', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'retWasher', val: 'ZCH', ifKey: 'product', ifVal: 'ik_kit' },
  ],
};

const retainers = [
  { value: 'G10', text: 'GRE G10' },
  { value: 'PH',  text: 'Phenolic' },
  { value: 'G11', text: 'G11' },
  { value: 'G7',  text: 'G7' },
];

const seals = [
  { value: 'T', text: 'Spring Energized PTFE' },
  { value: '8', text: 'Inc. 825 Spring Energized PTFE' },
  { value: 'V', text: 'Viton O-Ring' },
  { value: 'N', text: 'Nitrile O-Ring' },
];

const categories = [
  {
    value: 'gasket_IGS',
    label: '', // label: 'Retainer and Seal Options for',
    conditions: [{ oKey: 'brand', val: 'IGS' }],
  },
];

const options = [
  {
    oKey: 'retMat',
    category: 'gasket_IGS', label: 'Retainer Core',
    type: 'select', default: 'G10', list: retainers,
    required: true
  },
  {
    oKey: 'seal',
    category: 'gasket_IGS', label: 'Seal',
    type: 'select', default: 'T', list: seals,
    required: true
  },
];

module.exports = {
  categories,
  options,
  gasket,
};
