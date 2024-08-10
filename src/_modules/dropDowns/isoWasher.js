
const specBoltSize = require('./specBoltSize');

const list = [
  { value: 'G10CH', text: 'G10', purchased: true, manufactured: true },
  { value: 'G10D', text: 'G10 Domestic', purchased: true, manufactured: true },
  { value: 'G11', text: 'G11', purchased: true, manufactured: true },
  { value: 'CPH', text: 'PHENOLIC', purchased: true, manufactured: true },
  { value: 'M', text: 'MICA', purchased: true, manufactured: true, f_apl: 'FS' },
  // { value: 'MC', text: 'Coated MICA', purchased: true, manufactured: true, f_apl: 'FS' },
  { value: 'BHC', text: 'Coated Harden Steel', purchased: true, manufactured: false, f_apl: 'FS' },
  { value: 'C316L', text: 'Coated 316 Stainless', purchased: true, manufactured: true, f_apl: 'FS' },
  // { value: 'BHC', text: 'Harden Coated', purchased: true, manufactured: true, },
  { value: 'G3', text: 'G3', purchased: true, manufactured: true },
  // { value: 'G7', text: 'G7', purchased: true, manufactured: true, },
  // { value: 'NA', text: 'No Iso. Washers', purchased: false, manufactured: false }
];

const origin = [
  { value: 'PW', text: 'Purchased' },
  { value: 'MW', text: 'Manufactured' },
];

const categories = [
  ...specBoltSize.categories,
  {
    value: 'isoWasher',
    label: 'Isolation Washer',
  },
];

const options = [
  ...specBoltSize.options,
  {
    oKey: 'brand',
    category: 'isoWasher', label: 'Source',
    type: 'select', default: 'PW', list: origin,
    required: true,
  },
  {
    oKey: 'retMat',
    category: 'isoWasher', label: 'Iso Washer Material',
    type: 'select', default: 'G10CH', list,
    required: true,
  },
];

module.exports = {
  list,
  categories,
  options,
};
