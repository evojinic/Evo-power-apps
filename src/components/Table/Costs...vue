var render = function render(){var _vm=this,_c=_vm._self._c;return _c('td',[_c('div',[_vm._v(" "+_vm._s(_vm.pOG ? _vm.numberFormat(_vm.pOG, 2) || '' : '')+" -OG ")]),_c('div',{class:{danger: _vm.greaterThan(_vm.pLN, _vm.pOG)}},[_vm._v(" "+_vm._s(_vm.pOG ? _vm.numberFormat(( 1 - _vm.pLN/_vm.pOG ) * 100, 0) || '' : '')+" % ")]),_c('div',{style:(_vm.closeColor(_vm.pLN, _vm.sl))},[_vm._v(" "+_vm._s(_vm.numberFormat(_vm.sl, 2))+" -SL ")]),_c('div',{style:(_vm.closeColor(_vm.pLN, _vm.pb))},[_vm._v(" "+_vm._s(_vm.numberFormat(_vm.pb, 2))+" -GA ")]),_c('div',{style:(_vm.closeColor(_vm.pLN, _vm.aMat))},[_vm._v(" "+_vm._s(_vm.numberFormat(_vm.aMat, 2))+" -MC ")])])
}
var staticRenderFns = []

export { render, staticRenderFns }