var render = function render(){var _vm=this,_c=_vm._self._c;return _c('v-app',{attrs:{"id":"app"}},[_c('toolbar'),_c('div',{staticClass:"app-content"},[_c('router-view')],1),_c('transition',{attrs:{"name":"slide-fade"}},[(_vm.alert.message)?_c('div',{staticClass:"alert"},[_c('v-alert',{attrs:{"value":_vm.alert.message,"type":_vm.alert.type}},[(_vm.alert.title)?_c('h3',[_vm._v(" "+_vm._s(_vm.alert.title)+" ")]):_vm._e(),(_vm.alert.message)?_c('p',[_vm._v(" "+_vm._s(_vm.alert.message)+" ")]):_vm._e()])],1):_vm._e()])],1)
}
var staticRenderFns = []

export { render, staticRenderFns }