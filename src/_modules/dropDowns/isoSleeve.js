
const specBoltSize = require('./specBoltSize');

const list = [
  { value: 'G10', text: 'GRE G10' },
  { value: 'G11', text: 'GRE G11' },
  { value: 'M', text: 'MYLAR' },
  { value: 'P', text: 'POLY' },
  { value: 'MM', text: 'MICA' },
  { value: 'N', text: 'NOMEX' },
  // { value: 'G7', text: 'G7', retMat: ['G7'] },
];

const categories = [
  ...specBoltSize.categories,
  {
    value: 'isoSleeve',
    label: 'Isolation Cut Sleeve',
  },
];

const options = [
  ...specBoltSize.options,
  {
    oKey: 'brand',
    category: 'isoSleeve', label: 'Brand',
    type: 'text', default: 'CutSleeve',
    required: true,
    hidden: true,
  },
  {
    oKey: 'sleeveM',
    category: 'isoSleeve', label: 'Iso Sleeve Material',
    type: 'select', default: 'G10CH', list,
    required: true,
  },
  {
    oKey: 'sleeveL',
    category: 'isoSleeve', label: 'Iso Sleeve Length',
    type: 'number', default: '', min: 0.25, max: 72, step: 0.0625, suffix: 'in',
    required: true,
  },
];

module.exports = {
  list,
  categories,
  options,
};
