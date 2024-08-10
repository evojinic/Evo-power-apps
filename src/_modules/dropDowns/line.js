
const categories = [
  {
    value: 'torqueXX',
    label: 'Torque',
    conditions: [{ fKey: 'showADV' }, { oKey: 'product', $in: ['ik_kit', 'ik_gasket'] }]
  },
  {
    value: 'brandingXX',
    label: 'Branding',
    conditions: [{ fKey: 'showADV' }, { oKey: 'product' }],
  },
  {
    value: 'otherXX',
    label: 'Additional Marking / Text',
    conditions: [{ fKey: 'showADV' }, { oKey: 'product' }],
  },
  {
    value: 'line',
    label: 'Line Options',
    conditions: [{ oKey: 'product' }],
  },
];

const options = [
  {
    oKey: 'qty',
    category: 'line', label: 'Line Qty',
    type: 'number', default: 1, min: 1, step: 1,
    required: true,
    conditions: [{ oKey: 'product' }],
  },
  {
    fKey: 'showADV',
    category: 'line', label: 'Show Advance Options',
    type: 'checkbox'
  },
  // ...lineXX
  {
    xxKey: 'kValue',
    category: 'torqueXX', label: 'Bolt Friction Factor',
    type: 'number', default: 0.19, min: 0.10, max: 0.24, step: 0.01,
    conditions: [{ oKey: 'product', $in: ['ik_kit', 'ik_gasket'] }]
  },
  {
    xxKey: 'B_type',
    category: 'torqueXX', label: 'Bolt Type',
    type: 'select', list: [
      { value: 'B5', text: 'B5' },
      { value: 'B7', text: 'B7' },
      { value: 'B8', text: 'B8 class 1' },
      { value: 'B8M', text: 'B8M class 1' },
      { value: 'B82', text: 'B8 class 2' },
      { value: 'B8M2', text: 'B8M class 2' },
      { value: 'A307', text: 'A307B 36ksi' },
    ],
    conditions: [{ oKey: 'product', $in: ['ik_kit', 'ik_gasket'] }]
  },
  {
    xxKey: 'unbranded',
    category: 'brandingXX', label: 'unbranded (no LAMONS or BRAND)',
    type: 'checkbox', default: true,
    hidden: true,
  },
  {
    xxKey: 'noUSA',
    category: 'brandingXX', label: 'no made in USA call out',
    type: 'checkbox', default: true,
    hidden: true,
  },
  {
    xxKey: 'noPN',
    category: 'brandingXX', label: 'no part number(s)',
    type: 'checkbox', default: true,
    hidden: true,
  },
  // {
  //   xxKey: 'branding',
  //   category: 'brandingXX', label: 'Custom Branding',
  //   type: 'string',
  //   disabled: true,
  // },
  {
    xxKey: 'labelPerGasket',
    category: 'otherXX', label: 'Label for each gasket',
    type: 'checkbox', default: true,
    hidden: true,
    conditions: [{ oKey: 'product', $in: ['ik_gasket'] }]
  },
  {
    xxKey: 'label',
    category: 'otherXX', label: 'On the Label',
    type: 'textarea', rows: 3,
  },
  {
    xxKey: 'laser',
    category: 'otherXX', label: 'On the Gasket',
    type: 'textarea', rows: 3,
    conditions: [{ oKey: 'product', $in: ['ik_kit', 'ik_gasket'] }]
  },
];

module.exports = {
  categories,
  options,
};
