<template>
  <v-app id="inspire">
    <v-app-bar app dense>
      <router-link to="/home">Home</router-link>
    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      app
      expand-on-hover
    >
        <v-divider></v-divider>
        <v-list-item class="">
          <v-list-item-title>INTERCLOVE</v-list-item-title>
          <v-btn
            icon
            @click.stop="mini = !mini"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
  
        <v-divider></v-divider>
  
        <v-list dense>
          <v-list-group
          dense
            v-for="item in items"
            :key="item.title"
            v-model="item.active"
            :prepend-icon="item.action"
            no-action
            
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>
    
            <v-list-item
              class="ml-4"
              dense
              link
              v-for="child in item.items"
              :key="child.title"
            >
            <router-link :to="child.link">
              <v-list-item-content>
                <v-list-item-title>{{child.title}}</v-list-item-title>
              </v-list-item-content>
            </router-link>
            </v-list-item>
          </v-list-group>
        </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script type="text/babel">
export default {
  data() {
    return {
      drawer: true,
      items: [
        {
          action: 'mdi-ticket',
          items: [{ title: 'Products Lists',link:'/products' }],
          title: 'Products',
        },
      ],
        mini: true,
    };
  },
  methods: {
    openGithub() {
      // window.open('https://github.com/disjfa/vuetify-sidebar-template');
    },
  },
};
</script>

<style lang="stylus">
</style>
