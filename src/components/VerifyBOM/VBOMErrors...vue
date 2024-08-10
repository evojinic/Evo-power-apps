var render = function render(){var _vm=this,_c=_vm._self._c;return _c('table',[_vm._m(0),_vm._l((_vm.vrBom.errors),function(vrError,index){return _c('tr',{key:index},[_c('td',[_vm._v(_vm._s(vrError.partNum))]),_c('td',[_vm._v(_vm._s(vrError.type))]),_c('td',[_vm._v(_vm._s(vrError.exp))])])}),(_vm.error)?_c('tr',[_c('td',{attrs:{"colspan":"4"}},[_vm._v(" "+_vm._s(_vm.error)+" ")])]):_vm._e(),(_vm.vrBom && _vm.vrBom.error)?_c('tr',[_c('td',{attrs:{"colspan":"4"}},[_vm._v(" "+_vm._s(_vm.vrBom.error[0])+" ")])]):_vm._e()],2)
}
var staticRenderFns = [function (){var _vm=this,_c=_vm._self._c;return _c('tr',[_c('th',[_vm._v("Part Num")]),_c('th',[_vm._v("from")]),_c('th',[_vm._v("exp")]),_c('th',[_vm._v("link")])])
}]

export { render, staticRenderFns }