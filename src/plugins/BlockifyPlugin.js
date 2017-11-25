import Blockify from '@/script/blockify'

export default {
  install (Vue, options) {
    Vue.prototype.$bf = new Blockify()
  }
}
