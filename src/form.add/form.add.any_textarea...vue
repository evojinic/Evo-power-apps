var render = function render(){var _vm=this,_c=_vm._self._c;return (_vm.show && !_vm.hidden)?_c('div',[_c('v-textarea',{class:{ 'text-notice': !_vm.localVal && _vm.required },attrs:{"disabled":_vm.disabled,"label":_vm.label,"rows":_vm.rows,"dense":"","required":_vm.required,"rules":[_vm.required ? (v) => !!v || 'Can not be blank to continue!' : false]},model:{value:(_vm.localVal),callback:function ($$v) {_vm.localVal=$$v},expression:"localVal"}})],1):_vm._e()
}
var staticRenderFns = []

export { render, staticRenderFns }