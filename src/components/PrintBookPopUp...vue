var render = function render(){var _vm=this,_c=_vm._self._c;return _c('transition',{attrs:{"name":"fast-fade"}},[(_vm.show)?_c('div',{attrs:{"id":"pop-up"},on:{"click":function($event){if($event.target !== $event.currentTarget)return null;return _vm.close.apply(null, arguments)}}},[_c('contextNav',{staticClass:"pop-up-nav",attrs:{"buttons":_vm.buttons},on:{"pushToggle":_vm.toggleValue}}),(_vm.includeCopyPaste)?_c('QCopyPaste',{attrs:{"quote":_vm.quote,"user":_vm.user}}):_vm._e(),(_vm.includeBOM)?_c('verifyBOM',{attrs:{"user":_vm.user}}):_vm._e(),(_vm.includeINV)?_c('verifyMaterial',{attrs:{"user":_vm.user}}):_vm._e()],1):_vm._e()])
}
var staticRenderFns = []

export { render, staticRenderFns }