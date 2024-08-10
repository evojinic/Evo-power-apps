
// IG   : { gType: 'F', retainer: 'G10', seal: 'T', sleeveM: 'G10', isoWasher: 'G10CH', retWasher: 'ZCH' }
const gasket = {
  value: 'IG', text: 'IsoGuard',
  maxPressure: 4500, maxFOD: 160, maxEOD: 160,
  overwrite: [
    { oKey: 'gType', val: 'F' },
    { oKey: 'retMat', val: 'G10' },
    // { oKey: 'seal', val: 'T' },
    { oKey: 'sleeveM', val: 'G10', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'isoWasher', val: 'G10CH', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'retWasher', val: 'ZCH', ifKey: 'product', ifVal: 'ik_kit' },
  ],
  f_apl: 'PW',
};

const retainers = [
  { value: 'G10',   text: 'GRE G10' },
  { value: 'PH',    text: 'Phenolic' },
  { value: 'G10PW', text: 'Potable Water G10', f_apl: 'PW' },
  { value: 'PWQ',   text: 'Potable Water G10 (0.25)', f_apl: 'PW' },
  { value: 'G11',   text: 'G11' },
  { value: 'G7',    text: 'G7' },
];

const seals = [
  { value: 'T',  text: 'PTFE' },
  { value: 'N',  text: 'Nitrile' },
  { value: 'V',  text: 'Viton' },
  { value: 'E',  text: 'Pure EPDM' },
  { value: 'E',  text: 'Pure EPDM (NSF 61 cert.)', f_apl: 'PW' },
  { value: 'TM', text: 'PTFE Matrix (WRAS cert.)', f_apl: 'PW' },
  { value: null, text: 'no seal' },
  { value: 'T1', text: 'PTFE (seal on one side)' },
  { value: 'N1', text: 'Nitrile (seal on one side)' },
  { value: 'V1', text: 'Viton (seal on one side)' },
];

const categories = [
  {
    value: 'gasket_IG',
    label: '', // label: 'Retainer and Seal Options for',
    conditions: [{ oKey: 'brand', val: 'IG' }],
  },
];

const options = [
  {
    oKey: 'retMat',
    category: 'gasket_IG', label: 'Retainer Core',
    type: 'select', default: 'G10', list: retainers,
    required: true,
    filterKeys: [{ fKey: 'f_apl', fReq: true  }],
  },
  {
    oKey: 'seal',
    category: 'gasket_IG', label: 'Seal',
    type: 'select', default: 'T', list: seals,
    required: true,
    filterKeys: [{ fKey: 'f_apl', lReq: true  }],
  },
  {
    oKey: 'kammPro',
    category: 'gasket_IG', label: 'Make it IsoKamm',
    type: 'checkbox', default: false,
  },
  {
    fKey: 'seal2',
    category: 'gasket_IG', label: 'Outer Seal',
    type: 'checkbox', default: false,
    conditions: [{ oKey: 'kammPro', val: false }],
  },
  {
    oKey: 'seal2',
    category: 'gasket_IG', label: 'Outer/Secondary Seal',
    type: 'select', default: '', list: seals,
    required: true,
    filterKeys: [{ fKey: 'f_apl', lReq: true  }],
    conditions: [{ fKey: 'seal2' }, { oKey: 'kammPro', val: false }],
    overwrite: [{ fKey: 'seal2', val: true }]
  },
];

module.exports = {
  categories,
  options,
  gasket,
};
