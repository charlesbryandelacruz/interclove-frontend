<template>
    <v-app>
        <v-row>
            <v-col class="text-left" cols="3">
                <ListComponentVue :listItems="items" @selectedItem="selectItem" :listTitle="'Items'"></ListComponentVue>
            </v-col>
            <v-col class="text-left px-2 mt-2" cols="9">
                    <v-card-title>
                        <v-row>
                            <v-col>Customer Details</v-col>
                            <v-spacer></v-spacer>
                            <v-col class="text-right">
                                <v-btn 
                                    v-if="!isDisabled"
                                    small
                                    class="mr-2" 
                                    color="grey text--white"
                                    @click="isDisabled = !isDisabled"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn 
                                    small
                                    class="mr-2" 
                                    :color="!!isDisabled ? 'secondary' : 'green'" 
                                    @click="saveCustomer(); isDisabled = !isDisabled"
                                >
                                    {{ !!isDisabled ? 'Edit' : 'Save'}}
                                </v-btn>
                               
                                <v-btn 
                                    v-if="isDisabled"
                                    small
                                    color="primary" 
                                    @click="showAddEditDialog">
                                        <v-icon>mdi-plus</v-icon>
                                        Add
                                </v-btn>
                            </v-col>
                        </v-row>
        
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <h3 class="mt-2">Details</h3>
                    <v-divider class="mb-2"></v-divider>
                    <v-row>
                        <v-col cols="4">
                            <v-text-field  :readonly="isDisabled"  v-model="selected_item.company_name" dense outlined hide-details label="Company Name"> </v-text-field>
                        </v-col>
                        <v-col cols="8">
                            <v-text-field  :readonly="isDisabled"  v-model="selected_item.address" dense outlined hide-details label="Address"> </v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-autocomplete 
                                v-model="selected_item.pricing_id" 
                                dense 
                                outlined 
                                hide-details 
                                label="Pricing" 
                                item-text="code"
                                item-value="id"
                                :items="pricing_selection"
                                :readonly="isDisabled" 
                            > 
                        </v-autocomplete>
                        </v-col>
                        <v-col cols="4">
                            <v-autocomplete
                                v-model="selected_item.payment_type_id" 
                                dense 
                                outlined 
                                hide-details 
                                label="Payment Type" 
                                item-text="name"
                                item-value="id"
                                :items="payment_type_selection"
                                :readonly="isDisabled" 
                                > 
                            </v-autocomplete>
                        </v-col>
                        <v-col>
                            <v-autocomplete 
                                :readonly="isDisabled"
                                v-model="selected_item.salesman_id" 
                                dense 
                                outlined 
                                hide-details 
                                label="Salesman" 
                                :items="salesman_selection" 
                                item-text="name"
                                item-value="id"
                                > 
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="8">
                            <v-text-field  :readonly="isDisabled"  v-model="selected_item.credit_limit" dense outlined hide-details label="Credit Limit"> </v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field  :readonly="isDisabled"  v-model="selected_item.terms" dense outlined hide-details label="Terms"> </v-text-field>
                        </v-col>
                    </v-row>
                    <h3 class="mt-4">Contacts  
                        <v-btn v-if="!isDisabled" icon small color="red" @click="removeLine()"><v-icon>mdi-minus</v-icon></v-btn> 
                        <v-btn v-if="!isDisabled" icon small color="primary" @click="addLine()"><v-icon>mdi-plus</v-icon></v-btn> 
                    </h3>   
                    <v-divider class="mb-2"></v-divider>
                    <v-row>
                        <v-col class="text-center">
                            <h3>Name</h3>
                        </v-col>
                        <v-col class="text-center" >
                            <h3>Position</h3>
                        </v-col>
                        <v-col class="text-center" >
                            <h3>Contact</h3>
                        </v-col>
                    </v-row>
                    <v-row v-for="(customer,i) in selected_item.contacts" :key="i" class="ma-1 pa-0">
                        <v-col class="pa-0 ma-0">
                            <v-text-field class="px-1" :readonly="isDisabled" v-model="customer.contact_person" dense outlined hide-details placeholder="Name"> </v-text-field>
                        </v-col>
                        <v-col class="pa-0 ma-0">
                            <v-text-field class="px-1" :readonly="isDisabled" v-model="customer.contact_position" dense outlined hide-details placeholder="Position"> </v-text-field>
                        </v-col>
                        <v-col class="pa-0 ma-0">
                            <v-text-field class="px-1" :readonly="isDisabled" v-model="customer.contact_number" dense outlined hide-details placeholder="Contact"> </v-text-field>
                        </v-col>
                    </v-row> 
                    <h3 class="mt-4">Transactions</h3>
                    <v-divider class="mb-2"></v-divider>
                    <v-row>
                        <v-col>
                            <v-data-table 
                                dense
                                :headers="transaction.headers"
                                :items="selected_item.invoices"
                                >
                                <template v-slot:[`item.invoice_num`]="{ item }">
                                    {{ item.invoice_num }}
                                </template>
                                <template v-slot:[`item.paid_amount`]="{ item }">
                                    {{ item.paid_amount | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.quotation_num`]="{ item }">
                                    {{ item.quotation_num }}
                                </template>
                                <template v-slot:[`item.salesman_text`]="{ item }">
                                    {{ item.salesman_text  }}
                                </template>
                                <template v-slot:[`item.total_amount`]="{ item }">
                                    {{ item.total_amount | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.balance_amount`]="{ item }">
                                    {{ item.balance_amount | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.invoice_date`]="{ item }">
                                    {{ item.invoice_date }}
                                </template>

                            </v-data-table>
                        </v-col>
                      
                    </v-row>
                    </v-card-text>
            </v-col>
        </v-row>
        <AddCustomersDialog :addDialog="addDialog" @closeDialog="closeDialog()" @refreshData="getAll()" :pricing_selection="pricing_selection" :payment_type_selection="payment_type_selection"></AddCustomersDialog>
    </v-app>
  
</template>

<script>
import Swal from 'sweetalert2';
import AddCustomersDialog from '../../dialog/AddCustomersDialog.vue';
import ListComponentVue from '@/views/main/ListComponent.vue';
import axios from 'axios';
export default {
    name: 'PosLaravelVueProductComponent',

    data() {
        return {
            addDialog:false,
            items:[],
            addDialog:false,
            selected_item:{
                company_name:'',
                address:'',
                pricing_id:0,
                terms:'',
                payment_type_id:0,
                contacts:[
                    {
                        contact_person: '',
                        contact_position:'',
                        contact_number:'',
                    }
                ],
                id:0,
                invoices:[],
                credit_limit:0
            },
            isDisabled:true,
            pricing_selection:[],
            payment_type_selection:[],
            salesman_selection:[],
            transaction:{
                headers:[
                    { text: 'SI #', value: 'invoice_num' },
                    { text: 'Date', value: 'invoice_date' },
                    { text: 'Salesman', value: 'salesman_text' },
                    { text: 'Total Amount', value: 'total_amount',align:'right' },
                    { text: 'Balance Amount', value: 'balance_amount',align:'right' },
                    { text: 'Paid Amount', value: 'paid_amount',align:'right' },
                ],
                items:[]
            }
        };
    },

    mounted() {
        this.getAll();
        this.getAllPricing();
        this.getAllPaymentTypes();
        this.getAllSalesman();
    },

    methods: {
        selectItem(item){
            this.selected_item = item
        },
        closeDialog(){
            this.addDialog = false
        },
        showAddEditDialog(){
            this.addDialog = true
        },
        cancelItem(){
            Swal.fire({
            icon: 'warning',
            title: 'Are you sure you want to disable item?.',
            text: '',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
            reverseButtons:true
            })
            .then((result) => {
                if (result.isConfirmed) {
                // Retry logic goes here
                }
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
        },
        getAll(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-customers`).then(response=>{
                this.items = response.data
            })
        },
        saveCustomer(){
            if(!this.isDisabled){
                let payload = {
                    customers:this.selected_item
                }
                axios.post(`${process.env.VUE_APP_HOST_API}/api/update-customer`,payload).then(response=>{
                    Swal.fire(response.data,'','success')
                    this.getAll();
                })
            }
        },
        getAllPricing(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-discounts`).then(response=>{
                this.pricing_selection = response.data
            })
        },
        getAllPaymentTypes(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-payment-types`).then(response=>{
                this.payment_type_selection = response.data
            })
        },
        addLine(){
            this.selected_item.contacts.push({
                contact_person:'',
                contact_position:'',
                contact_number:'',
            })
        },
        removeLine(){
            this.selected_item.contacts.pop()
        },
        getAllSalesman(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-salesmans`).then(response=>{
                this.salesman_selection = response.data
            })
        },
    },
    components:{
        AddCustomersDialog,
        ListComponentVue
    }
};
</script>

<style lang="scss" scoped>

</style>