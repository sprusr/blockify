<template>
  <nav class="menu-bar">
    <div class="container">
      <div class="title">
        <h1><router-link to="/">Blockify</router-link></h1>
      </div>
      <ul class="nav">
        <li><a href="https://github.com/sprusr/blockify">GitHub</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'menu-bar',
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.menu-bar {
  height: 60px;
  line-height: 60px;
  background-color: $highlight-color;
  color: $text-color-light;
}

.container {
  width: 100%;
  max-width: $page-width;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.title {
  display: inline-block;
  padding: 0 10px;
}

.nav {
  list-style: none;
  margin: 0;
  padding: 0;

  a {
    display: inline-block;
    padding: 0 10px;
  }

  li {
    display: inline-block;
    margin: 0;
  }
}
</style>
