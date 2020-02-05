// .default意思
// .vue是单文件组件,内部有export default xxx 的内容
// 通过common.js的导入动作导入es6模块化内容
// require().default是固定用法
module.exports = file => require('@/module-' + file + '.vue').default // vue-loader at least v13.0.0+
