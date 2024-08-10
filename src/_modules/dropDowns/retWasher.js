
const specBoltSize = require('./specBoltSize');

const list = [
  { value: 'ZCH', text: 'Zinc Plated Steel', purchased: true, manufactured: false, psOnly: true, },
  { value: 'Z', text: 'Zinc Plated Steel Domestic', purchased: true, manufactured: true, psOnly: false, },
  { value: 'BHC', text: 'Coated Harden Steel', purchased: true, manufactured: false, },
  { value: 'C316L', text: 'Coated 316 Stainless', purchased: true, manufactured: true, },
  // { value: 'BHC', text: 'Harden Coated', purchased: true, manufactured: false },
  { value: 'S304', text: '304 Stainless', purchased: true, manufactured: true, },
  { value: '316L', text: '316 Stainless', purchased: true, manufactured: true, },
  { value: 'I625', text: 'Inconel 625', purchased: true, manufactured: true, },
  { value: 'I825', text: 'Inconel 825', purchased: true, manufactured: true, },
  { value: 'SD2507', text: 'Super Duplex 2507', purchased: true, manufactured: true, },
  { value: 'UD2205', text: 'Super Duplex 2205', purchased: true, manufactured: true, },
  // { value: 'NA', text: 'No Back Up Washers', purchased: false, manufactured: false, }
];

const origin = [
  { value: 'PW', text: 'Purchased' },
  { value: 'MW', text: 'Manufactured' },
];

const categories = [
  ...specBoltSize.categories,
  {
    value: 'retWasher',
    label: 'Back Up Washer',
  },
];

const options = [
  ...specBoltSize.options,
  {
    oKey: 'brand',
    category: 'retWasher', label: 'Source',
    type: 'select', default: 'PW', list: origin,
    required: true,
  },
  {
    oKey: 'retMat',
    category: 'retWasher', label: 'Back Up Washer Material',
    type: 'select', default: 'G10CH', list,
    required: true,
  },
];

module.exports = {
  list,
  categories,
  options,
};
