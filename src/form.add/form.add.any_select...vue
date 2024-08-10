var render = function render(){var _vm=this,_c=_vm._self._c;return (_vm.show && !_vm.hidden)?_c('div',[_c('v-select',{class:{ 'text-notice': !_vm.localVal && _vm.required },attrs:{"label":_vm.label,"items":_vm.items,"multiple":_vm.multiple,"disabled":_vm.disabled,"required":_vm.required,"rules":[_vm.required ? (v) => !!v || 'Can not be blank to continue!' : false],"placeholder":'none',"dense":""},model:{value:(_vm.localVal),callback:function ($$v) {_vm.localVal=$$v},expression:"localVal"}})],1):_vm._e()
}
var staticRenderFns = []

export { render, staticRenderFns }