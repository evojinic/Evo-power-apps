var render = function render(){var _vm=this,_c=_vm._self._c;return (_vm.isLoading)?_c('div',{staticClass:"f-card"},[_c('ga-spinner')],1):_c('div',_vm._l((_vm.categories),function(category){return _c('div',{key:category.value,staticClass:"f-card"},[(category.label)?_c('div',{staticClass:"f-card-title"},[_vm._v(_vm._s(category.label.toUpperCase()))]):_vm._e(),_vm._l((_vm.optionListFor(category.value)),function(option){return _c('DFInput',{key:option.oKey,attrs:{"gaInput":option}})})],2)}),0)
}
var staticRenderFns = []

export { render, staticRenderFns }