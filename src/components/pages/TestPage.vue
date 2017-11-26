<template>
  <div class="center">
    <h1>Blockchain jukebox</h1>
    <p>When you add a song, it is published to the blockchain, ensuring that the bar is held accountable for making sure they actually play it.</p>
    <p>Also features <i>banning</i> songs, which makes them more expensive to request.</p>
    <p>Fully democracised pub jukebox.</p>
    <input type="text" v-model="songID">

    <button type="button" @click="request">Request Song</button>
  </div>
</template>

<script>
import typeahead from 'vuejs-typeahead'

export default {
  name: 'test-page',
  data () {
    return {
      songID: '',
      items: [],
      selected: null
    }
  },
  components: {
    typeahead
  },
  methods: {
    request () {
      this.$blockify.requestSong(this.songID).then(() => {
        console.log('requested')
      })
      this.$blockify.on('songAdded', event => {
        console.log(event)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.center {
  text-align: center;
}
button {
  @include nice-button(rgb(190, 74, 0), rgb(255, 255, 255));
}
</style>
