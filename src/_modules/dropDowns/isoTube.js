
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
    value: 'isoTube',
    label: 'Isolation Tube',
  },
];

const options = [
  ...specBoltSize.options,
  {
    oKey: 'brand',
    category: 'isoTube', label: 'Brand',
    type: 'text', default: 'PT',
    required: true,
    hidden: true,
  },
  {
    oKey: 'sleeveM',
    category: 'isoTube', label: 'Iso Tube Material',
    type: 'select', default: 'G10CH', list,
    required: true,
  },
];

module.exports = {
  categories,
  options,
};
