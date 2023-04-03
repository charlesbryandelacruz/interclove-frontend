<template>
  <div id="app">
    <v-app-bar
    app
    color="primary"
  >
    <div class="d-flex align-center">
      <nav>
        <router-link to="/">
          <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="interclove_logo.png"
            transition="scale-transition"
            width="50"
          />
        </router-link>
      </nav>
    </div>
    <v-spacer></v-spacer>
    <router-link to="/Login">
      <h3>Login</h3>
    </router-link>
  </v-app-bar>
  <v-main>
    <router-view/>
  </v-main>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
