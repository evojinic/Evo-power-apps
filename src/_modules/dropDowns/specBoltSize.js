
// const specs = require('/spec');

const nomList = [
  { value: '0.5',   text: '1/2"', },
  { value: '0.625', text: '5/8"', },
  { value: '0.75',  text: '3/4"', },
  { value: '0.875', text: '7/8"', },
  { value: '1',     text: '1"', },
  { value: '1.125', text: '1 - 1/8"', },
  { value: '1.25',  text: '1 - 1/4"', },
  { value: '1.375', text: '1 - 3/8"', },
  { value: '1.5',   text: '1 - 1/2"', },
  { value: '1.625', text: '1 - 5/8"', },
  { value: '1.75',  text: '1 - 3/4"', },
  { value: '1.875', text: '1 - 7/8"', },
  { value: '2',     text: '2"', },
  { value: '2.25',  text: '2 - 1/4"', },
  { value: '2.5',   text: '2 - 1/2"', },
  { value: '2.75',  text: '2 - 3/4"', },
  { value: '3',     text: '3"', },
  { value: '3.75',  text: '3 - 1/4"', },
  { value: '3.5',   text: '3 - 1/2"', },
  { value: '3.75',  text: '3 - 3/4"', },
  { value: '4',     text: '4"', },
  { value: 'M10',   text: 'M10', sleeveOnly: true },
  { value: 'M12',   text: 'M12', sleeveOnly: true },
  { value: 'M16',   text: 'M16', sleeveOnly: true },
  { value: 'M20',   text: 'M20', sleeveOnly: true },
  { value: 'M24',   text: 'M24', sleeveOnly: true },
  { value: 'M27',   text: 'M27', sleeveOnly: true },
  { value: 'M30',   text: 'M30', sleeveOnly: true },
  { value: 'M33',   text: 'M33', sleeveOnly: true },
  { value: 'M36',   text: 'M36', sleeveOnly: true },
  { value: 'M39',   text: 'M39', sleeveOnly: true },
  { value: 'M45',   text: 'M45', sleeveOnly: true },
  { value: 'M52',   text: 'M52', sleeveOnly: true },
];

// if (this.selected.product === 'isoSleeve' || this.selected.product === 'isoTube') {
//   nomList = nomList.concat([
//     'M10',
//     'M12',
//     'M16',
//     'M20',
//     'M24',
//     'M27',
//     'M30',
//     'M33',
//     'M36',
//     'M39',
//     'M45',
//     'M52',
//   ]);
// }

const categories = [
  {
    value: 'spec',
    label: 'Bolt Size',
  },
  // {
  //   value: 'spec',
  //   label: 'Pipe Spec / Flange Dimensions',
  // },
];

const needsBoltSize = { oKey: 'product', $in: ['isoTube', 'isoSleeve', 'isoWasher', 'retWasher'] };

const options = [
  // {
  //   fKey: 'f_boltSize',
  //   category: 'spec', label: 'Bolt Size',
  //   type: 'radio', default: '', list: [{ value: '', text: 'Known' }, { value: 'help', text: 'Help me' }],
  //   conditions: [needsBoltSize],
  // },
  {
    oKey: 'boltSize',
    category: 'spec', label: 'Bolt Size',
    type: 'select', default: '', list: nomList,
    required: true,
    conditions: [needsBoltSize],
  },
];

module.exports = {
  categories,
  options,
};
