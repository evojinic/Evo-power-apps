
const productsList = [
  { value: 'pasteAny',  text: 'Manual PN Entry', f_product: 'PNE' },
  { value: 'ik_kit',    text: 'Full Kit', f_product: 'ISO' },
  { value: 'ik_gasket', text: 'Gasket Only', f_product: 'ISO', overwrite: [{ fKey: 'f_swSet', val: '' }] },
  { value: 'ik_swSet',  text: 'Sleeve & Washer Set', f_product: 'ISO' },
  { value: 'modular',   text: 'Pressio Modular Seal', f_product: 'ISO' },
  { value: 'bolt',      text: 'HOUS -- Bolt (BETA)', f_product: 'HUS' },
  { value: 'nut',       text: 'HOUS -- Nut (BETA)', f_product: 'HUS' },
  { value: 'husWasher', text: 'HOUS -- Washer (BETA)', f_product: 'HUS' },
  { value: 'gasket_soft', text: 'HOUS -- Soft (BETA)', f_product: 'HUS' },
  { value: 'gasket_kamm', text: 'HOUS -- Kamm Pro (BETA)', f_product: 'HUS' },
  { value: 'gasket_sw', text: 'HOUS -- Spiral Wound (BETA)', f_product: 'HUS' },
  { value: 'isoTube',   text: '-- Isolation Tubes', f_product: 'OTH' },
  { value: 'isoSleeve', text: '-- Isolation Sleeve', f_product: 'OTH' },
  { value: 'isoWasher', text: '-- Isolation Washer', f_product: 'OTH' },
  { value: 'retWasher', text: '-- Back Up Washer', f_product: 'OTH' },
  { value: 'other',     text: '-- Other Items', f_product: 'OTH' },
  { value: 'charge',    text: '$$ Charges', f_product: 'OTH' },
  { value: 'custom',    text: '** Custom Item', f_product: 'OTH' }
];

const categories = [
  {
    value: 'product',
    label: '',
  },
];

const options = [
  // {
  //   fKey: 'f_product',
  //   category: 'product', label: '',
  //   type: 'radio', default: '', list: [
  //     { value: '', text: 'List All' },
  //     { value: 'ISO', text: 'IsoTek' },
  //     { value: 'HUS', text: 'Lamons' },
  //     // { value: 'RAW', text: 'RAW' },
  //     { value: 'OTH', text: 'Other' },
  //     { value: 'PNE', text: 'Enter Part Number' },
  //   ],
  //   // required: true,
  // },
  {
    oKey: 'product',
    category: 'product', label: 'Product Type',
    type: 'select', default: '', list: productsList,
    required: true,
    filterKeys: [
      { fKey: 'f_product', fReq: true },
    ]
  },
];

module.exports = {
  categories,
  options,
};
