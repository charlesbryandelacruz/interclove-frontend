<template>
  <v-app id="inspire">
    <v-app-bar app dense>
      <router-link to="/home">Home</router-link>
    </v-app-bar>
    <v-navigation-drawer
      color="#E0E0E0"
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      app
      ripple
      expand-on-hover
    >
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title>
            <div v-if="mini">
              <v-img src="interclove_logo.png"></v-img>
            </div>
            <div v-else>
              Interclove Co
            </div>
          </v-list-item-title>
          <v-btn
            icon
            @click.stop="mini = !mini"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
  
        <v-divider></v-divider>
  
        <v-list dense link nav rounded>
          <v-list-group
            dense
            v-for="item in items"
            :key="item.title"
            v-model="item.active"
            :prepend-icon="item.action"
            no-action      
            active-class="primary white--text"    
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>
    
            <v-list-item
              class="ml-4"
              dense
              v-for="child in item.items"
              :key="child.title"
              color="secondary"
              link
            >
            <router-link :to="child.link">
              <v-list-item-content>
                <v-list-item-title color="white">{{child.title}}</v-list-item-title>
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
          action: 'mdi-cash-register',
          items: [
            { title: 'List of Invoices',link:'/invoices' },
            { title: 'List of Collection',link:'/products' },
          ],
          title: 'Receivables',
        },
        {
          action: 'mdi-cash-multiple',
          items: [
            { title: 'List of Purchases',link:'/products' },
            { title: 'List of Payments',link:'/products' },
            { title: 'Expenses',link:'/products' },
          ],
          title: 'Payables',
        },
        {
          action: 'mdi-warehouse',
          items: [
            { title: 'List of Products',link:'/products' },
            { title: 'Price List',link:'/price-list' },
            { title: 'Invetory Adjustment',link:'/products' },
            { title: 'Inventory Tracking',link:'/products' }
          ],
          title: 'Inventory',
        },
        {
          action: 'mdi-account-switch',
          items: [
            { title: 'List of Customers',link:'/products' },
            { title: 'List of Supploers',link:'/products' },
            { title: 'List of Agents/Salesman',link:'/products' },
            { title: 'List of Employees',link:'/products' },
          ],
          title: 'Partners',
        },
        {
          action: 'mdi-cog',
          items: [
            { title: 'Users',link:'/products' },
            { title: 'Company Info',link:'/products' },
          ],
          title: 'System',
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

<style>
html{
  overflow: hidden;
}
</style>
