
module.exports = {
  methods: {
    registerStoreModule(moduleName, storeModule) {
      const store = this.$store;
      if (!(store && store.state && store.state[moduleName])) {
        // console.log('register module', moduleName);
        store.registerModule(moduleName, storeModule);
      }
    },
  },
};
