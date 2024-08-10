
const chargeList = [
  { value: 'L-NM-91-8OZ',  text: '8oz Dose Packet k=0.19 Lubricant' },
  { value: 'L-NM-91-30ML', text: '30ML Can k=0.19 Lubricant' }
];

const categories = [
  {
    value: 'otherItem',
    label: 'Raw Material',
  },
];

const options = [
  {
    oKey: 'other',
    category: 'otherItem', label: 'Other Items',
    type: 'select', default: '', list: chargeList,
    required: true,
    useTextValue: 'desc',
  },
  {
    oKey: 'desc',
    category: 'chargeItem', label: 'Part Description',
    type: 'text', default: '',
    hidden: true,
    disabled: true,
  },
];

module.exports = {
  categories,
  options,
};
