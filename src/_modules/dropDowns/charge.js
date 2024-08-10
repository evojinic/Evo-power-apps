
const chargeList = [
  { value: 'IKC02', text: 'CRATING CHARGE', },
  { value: 'ENGINEERING SERVICES', text: 'ENGINEERING SERVICES', },
  { value: 'IKC01', text: 'EXPEDITING CHARGE', },
  { value: 'IKC03', text: 'MISCELLANEOUS', },
  { value: 'XSHIP', text: 'SHIPPING INSTRUCTIONS', },
  { value: 'OLC03', text: 'OTHER - SET UP', },
  { value: 'OLC04', text: 'OTHER - CERTIFICATE OF COMPLIANCE', },
  { value: 'OLC06', text: 'OTHER - MATERIAL TEST REPORTS', }
];

const categories = [
  {
    value: 'chargeItem',
    label: 'Charge / Fee',
  },
];

const options = [
  {
    oKey: 'pn',
    category: 'chargeItem', label: 'Part Number',
    type: 'select', default: '',
    list: chargeList,
    required: true,
    useTextValue: 'desc',
  },
  {
    oKey: 'desc',
    category: 'chargeItem', label: 'Part Description',
    type: 'text', default: '',
    disabled: true,
    hidden: true,
  },
  {
    oKey: 'up',
    category: 'chargeItem', label: 'Charge / Fee Price Each',
    type: 'number', min: 0, prefix: '$',
    required: true,
  },
];

module.exports = {
  categories,
  options,
};
