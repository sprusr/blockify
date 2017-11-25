import Blockify from '@/script/blockify'

export default {
  install (Vue, options) {
    Vue.prototype.$blockify = new Blockify(options.spotifyToken)
  }
}
