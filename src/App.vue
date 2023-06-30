<template>
  <v-app id="inspire">
    <v-app-bar app dense v-if="$router.currentRoute.name != 'login'">
      <v-row>
        <v-col class="mt-5">
          <router-link to="/home">Home</router-link>
        </v-col>
        <v-col class="text-right mr-4" cols="1">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
                <v-list-item class="pa-0 ma-0 py-1">
                    <v-avatar size="34" color="gold" class="pa-0 ma-2">
                        <v-img src="interclove_logo.png">
                        </v-img>
                    </v-avatar>
                    
                    <span class="text-caption"> <h3>{{ name }}</h3> </span>
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                </v-list-item>
            </template>
            <v-list dense>
                <!-- <v-list-item link>
                    <v-icon size="16">mdi-account</v-icon>
                    <v-list-item-title> My Profile </v-list-item-title>
                </v-list-item> -->
                <!-- <v-list-item link @click="changePassword">
                    <v-icon size="16">mdi-lock</v-icon>
                    <v-list-item-title> Change Password </v-list-item-title>
                </v-list-item> -->
                <v-list-item link @click="logout()">
                    <v-icon size="16">mdi-logout</v-icon>
                    <v-list-item-title> Logout </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-navigation-drawer
      v-if="$router.currentRoute.name != 'login'"
      color="#E0E0E0"
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      app
      ripple
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
      admin: [
        {
          action: 'mdi-cash-register',
          items: [
            { title: 'List of Quotation',link:'/quotation-list'},
            { title: 'List of Invoices',link:'/invoice-list' },
            { title: 'List of Collection',link:'/collection-list' },
          ],
          title: 'Receivables',
        },
        {
          action: 'mdi-cash-multiple',
          items: [
            { title: 'List of Purchase Orders',link:'/purchase-order-list' },
            { title: 'List of Purchases',link:'/purchase-list' },
            { title: 'List of Payments',link:'/payment-list' },
            { title: 'Expenses',link:'/expense-list' },
            { title: 'Petty Cash',link:'/petty-cash' },
          ],
          title: 'Payables',
        },
        {
          action: 'mdi-warehouse',
          items: [
            { title: 'List of Products',link:'/products' },
            { title: 'Price List',link:'/price-list' },
            { title: 'Invetory Adjustment',link:'/inventory-adjustment' },
            // { title: 'Inventory Tracking',link:'/' }
          ],
          title: 'Inventory',
        },
        {
          action: 'mdi-account-switch',
          items: [
            { title: 'List of Customers',link:'/customers' },
            { title: 'List of Suppliers',link:'/suppliers' },
            { title: 'List of Agents/Salesman',link:'/salesmans' },
            // { title: 'List of Employees',link:'/' },
          ],
          title: 'Partners',
        },
        {
          action: 'mdi-cog',
          items: [
            { title: 'Users',link:'/users-list' },
            // { title: 'Company Info',link:'/' },
          ],
          title: 'System',
        },
        {
          action: 'mdi-file-multiple',
          items: [
            { title: 'Sales Report',link:'/sales-report' },
            { title: 'Collection Report',link:'/collection-report' },
            { title: 'Purchase Report',link:'/purchase-report' },
            { title: 'Payment Report',link:'/payment-report' },
            { title: 'Expense Report',link:'/expense-report' },
            { title: 'Inventory Report',link:'/inventory-report' },
            { title: 'Financial Report',link:'/financial-report' },
          ],
          title: 'Reports',
        },
        
      ],
      not_admin: [
        {
          action: 'mdi-cash-register',
          items: [
            { title: 'List of Quotation',link:'/quotation-list'},
            { title: 'List of Invoices',link:'/invoice-list' },
            { title: 'List of Collection',link:'/collection-list' },
          ],
          title: 'Receivables',
        },
        {
          action: 'mdi-cash-multiple',
          items: [
            { title: 'List of Purchase Orders',link:'/purchase-order-list' },
            { title: 'List of Purchases',link:'/purchase-list' },
            { title: 'List of Payments',link:'/payment-list' },
            { title: 'Expenses',link:'/expense-list' },
            { title: 'Petty Cash',link:'/petty-cash' },
          ],
          title: 'Payables',
        },
        {
          action: 'mdi-warehouse',
          items: [
            { title: 'List of Products',link:'/products' },
            { title: 'Price List',link:'/price-list' },
            { title: 'Invetory Adjustment',link:'/inventory-adjustment' },
            { title: 'Inventory Tracking',link:'/' }
          ],
          title: 'Inventory',
        },
        {
          action: 'mdi-file-multiple',
          items: [
            { title: 'Sales Report',link:'/sales-report' },
            { title: 'Collection Report',link:'/collection-report' },
            { title: 'Purchase Report',link:'/purchase-report' },
            { title: 'Payment Report',link:'/payment-report' },
            { title: 'Expense Report',link:'/expense-report' },
            { title: 'Inventory Report',link:'/inventory-report' },
            { title: 'Financial Report',link:'/financial-report' },
          ],
          title: 'Reports',
        },
      ],
        mini: true,
    };
  },
  mounted(){
  },
  methods: {
    openGithub() {
      // window.open('https://github.com/disjfa/vuetify-sidebar-template');
    },
    logout(){
      localStorage.removeItem('user_info');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_id');
      this.name = '';
      this.$router.push('/login')
    }
  },
  computed:{
    name(){
      return localStorage.getItem('user_name')
    },
    position(){
      return localStorage.getItem('position')
    },
    items(){
      if(this.position == "Admin"){
        return this.admin;
      }
      return this.not_admin;
    }
  }
};
</script>

<style>

</style>
