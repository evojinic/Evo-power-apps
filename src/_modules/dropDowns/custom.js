
const categories = [
  {
    value: 'cusItem',
    label: 'Custom Item',
  },
];

const options = [
  {
    oKey: 'pn',
    category: 'cusItem', label: 'Part Number',
    type: 'text', default: '',
    required: true,
  },
  {
    oKey: 'desc',
    category: 'cusItem', label: 'Part Description',
    type: 'text', default: '',
    required: true,
  },
  {
    oKey: 'up',
    category: 'cusItem', label: 'Price Each / Unit Price',
    type: 'number', min: 0, prefix: '$',
    required: true,
  },
];

module.exports = {
  categories,
  options,
};
