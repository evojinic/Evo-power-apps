
const categories = [
  {
    value: 'job',
    label: 'Job Information',
    conditions: [{ oKey: 'dueDate' }],
  },
];

const options = [
  {
    oKey: 'job',
    category: 'job', label: 'Job Number',
    type: 'text',
    // required: true,
  },
  // {
  //   oKey: 'comments',
  //   category: 'job', label: 'Line Comments',
  //   type: 'textarea',
  // },
  {
    oKey: 'dueDate',
    category: 'job', label: 'Due Date',
    type: 'date',
    required: true,
  },
  {
    oKey: 'dueTime',
    category: 'job', label: 'Due Time',
    type: 'time',
    required: true,
    disabled: true,
  }
];

module.exports = {
  categories,
  options,
};
