
// const specDims = require('./specDims');

const categories = [
  {
    value: 'spec',
    label: 'Pipe Spec / Flange Dimensions',
  },
];

const pipeSpecOptions = [
  { value: 'ANSI B16.5', text: 'ANSI/ASME (inches)' },
  { value: 'API',        text: 'API (inches)' },
  { value: 'BS EN 1092-1:2007', text: 'DN-PN (mm)' },
  { value: 'AWWA',     text: 'AWWA (inches)' },
  { value: 'SEMPRA',   text: 'SEMPRA (inches)' },
  { value: 'JIS',      text: 'JIS (mm)' },
  { value: 'ENBRIDGE', text: 'ENBRIDGE', fVal: 'ANSI B16.5' },
  // { value: 'EEMUA', text: 'EEMUA' },
  { value: 'SEVAL', text: 'SEVAL' },
];

const specXX = [
  {
    category: 'spec',
    xxKey: 'flange1Face',
    label: 'Flange Face',
    type: 'select',
    list: [
      { value: '',    text: 'Show Both' },
      { value: 'RF',  text: 'Raised Face (RF)' },
      { value: 'RTJ', text: 'Ring Type Joint (RTJ)' },
      { value: 'FF',  text: 'Full Face (FF)' },
    ],
    conditions: [{ oKey: 'product', $in: ['ik_kit', 'ik_swSet'] }],
  },
  {
    category: 'spec',
    xxKey: 'spacerThk',
    label: 'Spacer Thickness',
    type: 'number', min: 0.02, max: 50, step: 0.01,
    conditions: [{ oKey: 'product', $in: ['ik_kit', 'ik_swSet'] }],
  },
  // {
  //   category: 'spec',
  //   xxKey: 'valveThk',
  //   label: 'Valve Thickness',
  //   type: 'number', min: 0.02, max: 50, step: 0.01,
  //   conditions: [{ oKey: 'product', $in: ['ik_kit', 'ik_swSet'] }],
  // },
  {
    category: 'spec',
    xxKey: 'gasket2Thk',
    label: '2nd Gasket Thickness',
    type: 'number', min: 0.02, max: 1, step: 0.01,
    conditions: [
      { oKey: 'product', $in: ['ik_kit', 'ik_swSet'] },
      { xxKey: 'valveThk', fReq: true },
      { xxKey: 'spacerThk', fReq: true }
    ],
  },
];

const options = [
  {
    oKey: 'spec',
    fKey: 'spec',
    category: 'spec', label: 'Pipe Spec',
    type: 'select', default: 'ANSI B16.5', list: pipeSpecOptions,
    required: true,
  },
  {
    fKey: 'multipleOverwrite',
    category: 'spec', label: 'Select Multiple Sizes',
    type: 'checkbox', default: false,
    conditions: [{ oKey: 'spec' }, { fKey: 'edit', val: false }],
  },
  {
    oKey: 'nSize',
    fKey: 'size',
    category: 'spec', label: 'Pipe Size (NPS)',
    type: 'nSize',
    required: true,
    multipleIf: [{ fKey: 'multipleOverwrite' }],
    conditions: [{ oKey: 'spec' }],
  },
  {
    oKey: 'pClass',
    fKey: 'pClass',
    category: 'spec', label: 'Pressure Class',
    type: 'pClass',
    required: true,
    conditions: [{ oKey: 'spec' }],
  },
  {
    oKey: 'bore',
    category: 'spec', label: 'Bore / Inner Dia.',
    type: 'bore',
    required: true,
    conditions: [{ oKey: 'product', $in: ['ik_kit', 'ik_gasket'] }, { oKey: 'spec' }, { oKey: 'nSize' }],
  },
  {
    oKey: 'customBore',
    category: 'spec', label: 'User Defined Bore',
    type: 'number', min: 0, step: 0.01,
    // :max="minID || flangeDims.flangeOD"
    required: true,
    conditions: [{ oKey: 'bore', val: 'User Defined' }],
    // rules: [
    //   (v) => (!minID || v <= (minID)) || 'ID is larger than BCD',
    //   (v) => (!flangeDims.flangeOD || v <= flangeDims.flangeOD) || 'ID is larger than Flange OD'
    // ]
  },
  // {
  //   oKey: 'dims',
  //   category: 'spec', label: 'Spec',
  //   type: 'select', list: specDims,
  //   required: true,
  //   filterKeys: [
  //     { fKey: 'spec', },
  //     { fKey: 'size', },
  //     { fKey: 'pClass', },
  //     { fKey: 'bolt', },
  //     { fKey: 'hd', },
  //     { fKey: 'holeQty', },
  //   ],
  // },
  {
    oKey: 'sempraSpec',
    category: 'spec', label: 'Sempra Spec',
    type: 'radio', list: [{ value: 'S8', text: '47-58' }, { value: 'S81', text: '47-58.1' }, { value: 'S82', text: '47-58.2' }],
    required: true,
    conditions: [{ oKey: 'spec', val: 'SEMPRA' }],
  },
  ...specXX
];

module.exports = {
  categories,
  options,
};

// lookUpSpec() {
//   if (this.selected.spec === 'ENBRIDGE') return 'ANSI B16.5';
//   return this.selected.spec;
// },

// specsList() { return this.specs.filter(spec => spec.spec === this.lookUpSpec); },
// specBoreList() { return this.bores.filter(bore => bore.spec === this.lookUpSpec); },

// nominalList() {
//   if (this.status.isPendingSpecs) return [{ text: 'loading', value: null }];
//   const uniqueNominals = this.specsList.reduce((list, spec) => {
//     if (typeof this.selected.pClass === 'string' && this.selected.pClass !== '' && this.selected.pClass !== null && this.selected.pClass !== spec.pClass) return list;
//     if (list.indexOf(spec.size) === -1) list.push(spec.size);
//     return list;
//   }, [])
//   // sort hight to low
//     .sort((a, b) => {
//       if (isNaN(a) && isNaN(a)) return parseInt(a.replace('DN', ''), 10) - parseInt(b.replace('DN', ''), 10);
//       return parseFloat(a) - parseFloat(b);
//     })
//   // turn into text value pair
//     .map(nom => {
//       let text = '';
//       if (this.lookUpSpec === 'ANSI B16.5') {
//         if (nom.indexOf('A') !== -1) text = nom.replace('A', ' srs A');
//         else if (nom.indexOf('B') !== -1) text = nom.replace('B', ' srs B');
//         else if (nom > 24) text = `${this.fraction(nom, false)} srs A & B (or no serries)`;
//         else text = this.fraction(nom, true);
//       }
//       else text = this.fraction(nom, true);

//       return {
//         text,
//         value: nom,
//       };
//     });

//   // console.log(uniqueNominals)
//   if (uniqueNominals.length > 0) return uniqueNominals;
//   return [{
//     text: 'error',
//     value: null,
//   }];
// },

// multipleSizes() {
//   if (typeof this.selected.nSize === 'string') return false;
//   if (this.selected.nSize.length > 1) return true;
//   return false;
// },

// refSize() {
//   if (typeof this.selected.nSize === 'string') return this.selected.nSize;
//   if (this.selected.nSize[0]) return this.selected.nSize[0];
//   return '';
// },

// pClassList() {
//   if (this.status.isPendingSpecs) return [{ text: 'loading', value: null }];
//   const pClasses = this.specsList.reduce((list, spec) => {
//     if (this.refSize !== '' && this.refSize !== spec.size) return list;
//     if (list.indexOf(spec.pClass) === -1) list.push(spec.pClass);
//     return list;
//   }, [])
//     .sort((a, b) => {
//       if (isNaN(a) && isNaN(a)) return parseInt(a.replace('PN', ''), 10) - parseInt(b.replace('PN', ''), 10);
//       return parseInt(a, 10) - parseInt(b, 10);
//     });
//   // console.log(pClasses)
//   pClasses.push({ text: 'clear class filter (show all sizes)', value: null });

//   if (pClasses.length > 0) {
//     if (this.lookUpSpec === 'AWWA') {
//       return this.AWWA.filter(pClass => {
//         if (pClasses.indexOf(pClass.value) !== -1) return true;
//         return false;
//       });
//     }
//     return pClasses;
//   }

//   return [{
//     text: 'error"',
//     value: null,
//   }];
// },

// boreList() {
//   let uniqueBores = ['User Defined'];
//   if (this.lookUpSpec === 'SEMPRA') {
//     if (this.selected.pClass <= 300) uniqueBores.push('SM');
//   }
//   else if (this.lookUpSpec === 'API') uniqueBores.push('API');
//   else if (this.lookUpSpec === 'BS EN 1092-1:2007') uniqueBores.push('BS');
//   else if (this.lookUpSpec === 'JIS') uniqueBores.push('JIS');
//   else if (this.lookUpSpec === 'SEVAL') uniqueBores.push('SV');
//   else {
//     uniqueBores = this.specBoreList.reduce((list, spec) => {
//       if (this.boreNoAorB !== '' && this.boreNoAorB !== spec.size) return list;
//       if (list.findIndex(bore => bore.value === spec.bore) === -1) {
//         let text = `${spec.bore} = ${spec.flangeID}"`;
//         if (this.multipleSizes) text = `${spec.bore}`;
//         list.push({
//           value: spec.bore,
//           text,
//           flangeID: spec.flangeID,
//         });
//       }
//       return list;
//     }, uniqueBores).sort((a, b) => a.flangeID - b.flangeID);
//   }

//   if (this.lookUpSpec === 'AWWA') {
//     let tFour = uniqueBores.find(bore => bore.value === 'T4');
//     if (tFour) {
//       uniqueBores.push({
//         value: 'T2',
//         text: `T2 = ${tFour.flangeID}"`,
//         flangeID: tFour.flangeID,
//       });
//       uniqueBores.push({
//         value: 'T3',
//         text: `T3 = ${tFour.flangeID}"`,
//         flangeID: tFour.flangeID,
//       });
//       uniqueBores.push({
//         value: 'T5',
//         text: `T5 = ${tFour.flangeID}"`,
//         flangeID: tFour.flangeID,
//       });
//     }
//   }

//   if (this.editIndexArr.length === 0 && !this.selected.bore) {
//     if (this.lookUpSpec === 'ANSI B16.5') this.selected.bore = 'STD'; // eslint-disable-line
//     else if (this.lookUpSpec === 'AWWA') this.selected.bore = 'T4'; // eslint-disable-line
//     else if (uniqueBores.length > 1) this.selected.bore = uniqueBores[1]; // eslint-disable-line
//     else if (uniqueBores.length = 1) this.selected.bore = uniqueBores[0]; // eslint-disable-line
//     else this.selected.bore = ''; // eslint-disable-line
//   }
//   if (uniqueBores.length > 0) return uniqueBores;
//   if (this.status.isPendingBores) return [{ text: 'loading', value: null }];
//   return [{
//     text: 'error',
//     value: '',
//   }];
// },
// flangeDims() {
//   if (this.multipleSizes) return {};
//   let dims = [];
//   if (this.specs && this.lookUpSpec !== '' && this.refSize !== '' && this.selected.pClass !== '') {
//     dims = this.specs.filter(spec =>
//       spec.spec === this.lookUpSpec &&
//       spec.size === this.refSize &&
//       spec.pClass === this.selected.pClass
//     );
//   }

//   if (dims.length > 0) {
//     if (this.dims.flangeID) {
//       dims[0].flangeID = this.dims.flangeID;
//     }
//     return dims[0];
//   }
//   return {};
// },

// minID() {
//   if (!this.flangeDims || !this.flangeDims.bcd || !this.flangeDims.hd) return '';
//   let minOffset = 0.25;
//   if (this.selected.brand === 'IG') minOffset = 0.55;
//   if (this.selected.brand === 'DF') minOffset = 0.75;
//   return this.flangeDims.bcd - this.flangeDims.hd - minOffset;
// }

// specChange(newVal) {
//   if (newVal === 'ENBRIDGE') this.selected.enbridge = true;
//   else delete this.selected.enbridge;
//   if (newVal !== 'SEMPRA') delete this.selected.sempraSpec;
// }

// setDims(newVal, oldVal) {
//   if (this.multiple) return false;
//   if (newVal === oldVal) return false;
//   this.$emit('setDims', this.flangeDims);
//   return true;
// }

// setFlangeID(newVal, oldVal) {
//   if (this.multiple) return false;
//   if (newVal === oldVal) return false;
//   if (this.selected.customBore) this.$emit('setFlangeID', this.selected.customBore);
//   let bores = [];
//   if (this.bores && this.lookUpSpec !== '' && this.selected.nSize !== '' && this.selected.bore !== '') {
//     bores = this.bores.filter(bore =>
//       bore.spec === this.lookUpSpec &&
//       bore.size === this.selected.nSize &&
//       bore.bore === this.selected.bore
//     );
//   }
//   if (bores.length > 0 && bores[0].flangeID) {
//     console.log('setting flange ID');
//     this.$emit('setFlangeID', bores[0].flangeID);
//   }
//   return true;
// }

// fraction(decimal, withQuotes = true) {
//   if (decimal.indexOf('M') !== -1) return decimal;
//   if (decimal.indexOf('DN') !== -1) return decimal;
//   const decimalSplit = decimal.split('.');
//   let com = 0;
//   const resolution = 16;
//   const quote = withQuotes ? '"' : '';
//   let rNum = false;
//   let whole = decimalSplit[0];
//   if (decimalSplit[0] <= 0) whole = false;
//   if (decimalSplit[1] && decimalSplit[1] > 0 && !isNaN(decimalSplit[1])) {
//     const decimals = parseFloat(`0.${decimalSplit[1]}`);
//     const numerator = parseInt(decimals * 10000, 10);
//     const denominator = 10000 / resolution;
//     const mod = numerator % denominator;
//     if (mod > 200) {
//       rNum = (numerator - (numerator % denominator)) / denominator + 1;
//     }
//     else {
//       rNum = (numerator - (numerator % denominator)) / denominator;
//     }
//     com = this.gcd_rec(rNum, resolution);
//     if (rNum === resolution) {
//       whole++;
//       rNum = false;
//     }
//   }
//   if (whole && rNum) {
//     return `${whole} - ${rNum / com}/${resolution / com}${quote}`;
//   } if (whole && !rNum) {
//     return whole + quote;
//   } if (com > 0) {
//     return `${rNum / com}/${resolution / com}${quote}`;
//   }
//   return decimal;
// },

// gcd_rec(a, b) {
//   if (b) {
//     return this.gcd_rec(b, a % b);
//   }
//   return Math.abs(a);
// },

// convertSizeFromStringToArray() {
//   if (this.multipleOverwrite) {
//     if (typeof this.selected.nSize === 'string' && this.selected.nSize) this.selected.nSize = [this.selected.nSize];
//     if (!this.selected.nSize) this.selected.nSize = [];
//     if (this.editIndexArr.length !== 0) this.multipleOverwrite = false;
//   }
//   else {
//     if (typeof this.selected.nSize !== 'string') this.selected.nSize = this.selected.nSize[0] || '';
//     if (!this.selected.nSize) this.selected.nSize = '';
//   }
// },
