
// DFS  : { gType: 'F', facing: 'G11', retainer: 'S6', seal: 'T', seal2: 'M', sleeveM: 'G10', isoWasher: 'M', retWasher: 'ZCH' }
const gasket = {
  value: 'DFS', text: 'Defender Fire Safe',
  maxPressure: 10000, maxFOD: 47.8, maxEOD: 48,
  overwrite: [
    { oKey: 'gType', val: 'F' },
    { oKey: 'facing', val: 'G11' },
    { oKey: 'retMat', val: 'S6' },
    { oKey: 'seal', val: 'T' },
    { oKey: 'seal2', val: 'M' },
    { oKey: 'sleeveM', val: 'G10', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'isoWasher', val: 'M', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'retWasher', val: 'ZCH', ifKey: 'product', ifVal: 'ik_kit' },
  ],
  kamm: true,
  f_apl: 'FS',
};

const facings = [
  { value: 'G10', text: 'GRE G10' },
  { value: 'G11', text: 'GRE G11' },
  { value: 'L110', text: 'Lamons PTFE Matrix 110' },
];

const retainers = [
  { value: 'S6', text: '316SS' },
  { value: 'I8', text: 'Alloy 800/Alloy 825 ' },
  { value: 'I6', text: 'Alloy 600/Alloy 625' },
  { value: 'SD', text: 'Super Duplex - 2507 (SD)' },
  { value: 'UD', text: 'Super Duplex - 2205 (UD)' },
  { value: 'N0', text: 'Monel 400' },
];

const sealInner = [
  { value: 'T', text: 'Lamons PTFE Matrix 110' },
];

const sealOuter = [
  { value: 'M', text: 'Mica', f_apl: 'FS'  },
  // { value: 'T', text: 'PTFE Only ( !not fire safe! )' },
];

const categories = [
  {
    value: 'gasket_DFS',
    label: '', // label: 'Retainer and Seal Options for',
    conditions: [{ oKey: 'brand', val: 'DFS' }],
  },
];

const options = [
  {
    oKey: 'ringMat',
    category: 'gasket_DFS', label: 'Retainer Facing',
    type: 'select', default: 'G11', list: facings,
    required: true
  },
  {
    oKey: 'retMat',
    category: 'gasket_DFS', label: 'Retainer Core',
    type: 'select', default: 'S6', list: retainers,
    required: true
  },
  {
    oKey: 'seal',
    category: 'gasket_DFS', label: 'Primary/Inner Seal',
    type: 'select', default: 'T', list: sealInner,
    required: true
  },
  {
    oKey: 'seal2',
    category: 'gasket_DFS', label: 'Outer/Secondary Seal',
    type: 'select', default: 'M', list: sealOuter,
    required: true,
    filterKeys: [{ fKey: 'f_apl', fReq: true }],
    conditions: [{ fKey: 'nonFS', val: false }],
  },
  {
    oKey: 'kammPro',
    category: 'gasket_DFS', label: 'Kamm Profile',
    type: 'checkbox', default: true,
    required: true,
    disabled: true,
  },
  {
    fKey: 'nonFS',
    category: 'gasket_DFS', label: 'PTFE Only !! NOT FIRE SAFE !!',
    type: 'checkbox', default: false,
    overwrite: [{ fKey: 'f_apl', val: '' }, { oKey: 'seal2', val: '' }]
  },
];

module.exports = {
  categories,
  options,
  gasket,
};
