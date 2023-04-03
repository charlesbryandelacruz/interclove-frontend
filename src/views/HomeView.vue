<template>
	<v-app>
			<v-container fluid>
				<v-row>
					<v-col cols="4">
						<v-card>
							Summary

						</v-card>
					</v-col>
					<v-col cols="8">
						<v-card class="ma-0 pa-0">
							<v-row class="px-4">
								<v-col>
									<v-card class="button_cards" >
										Receivables
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards">
										Invoices
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards">
										Collections
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards">
										
									</v-card>
								</v-col>

								<v-col >
									<v-card class="button_cards">
										
									</v-card>
								</v-col>
							</v-row>
							<v-row class="px-4">
								<v-col>
									<v-card class="button_cards">
										Payables
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards">
										Purchases
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards">
										Payment
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards">
										Expenses
									</v-card>
								</v-col>
								
								<v-col >
									<v-card class="button_cards">
										
									</v-card>
								</v-col>
							</v-row>
							<v-row class="px-4">
								<v-col>
									<v-card class="button_cards">
										Inventory
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards" @click="redirectTo('products')">
										Products
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards">
										Price List
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards">
										Inventory Adjustment
									</v-card>
								</v-col>
								
								<v-col >
									<v-card class="button_cards">
										Inventory Tracking
									</v-card>
								</v-col>
							</v-row>
							<v-row class="px-4">
								<v-col>
									<v-card class="button_cards">
										Partners
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards">
										Customers
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards">
										Suppliers
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards">
										Agents/Salesman
									</v-card>
								</v-col>
								
								<v-col >
									<v-card class="button_cards">
										Employee Data
									</v-card>
								</v-col>
							</v-row>
							<v-row class="px-4">
								<v-col>
									<v-card class="button_cards">
										System
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards">
										Users
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards">
										Company Info
									</v-card>
								</v-col>
								<v-col >
									<v-card class="button_cards">
									
									</v-card>
								</v-col>
								
								<v-col >
									<v-card class="button_cards">
										
									</v-card>
								</v-col>
							</v-row>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
			
	</v-app>
	</template>

<script>
// @ is an alias to /src
import Swal from 'sweetalert2';

export default {
  name: 'HomeView',
  data(){
	return {
		addDialog:false	
	}
  },
  components: {
	
  },
  methods:{
	redirectTo(){
		this.$router.push('/products')
	},
  }
}
</script>
<style>
.button_cards{
	height:80px;
	align-items: center;
	justify-content: center;
	display: flex;
	margin: 2px;
}

</style>
