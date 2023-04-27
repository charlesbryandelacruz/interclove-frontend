<template>
    <v-app>
        <v-row>
            <v-col class="text-left" cols="3">
                <ListComponentVue :listItems="items" @selectedItem="selectItem" :listTitle="'Items'"></ListComponentVue>
            </v-col>
            <v-col class="text-left px-2 mt-2" cols="9">
                    <v-card-title>
                        <v-row>
                            <v-col>Supplier Details</v-col>
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
                            <v-text-field  :readonly="isDisabled"  v-model="selected_item.supplier_name" dense outlined hide-details label="Supplier Name"> </v-text-field>
                        </v-col>
                        <v-col cols="8">
                            <v-text-field  :readonly="isDisabled"  v-model="selected_item.address" dense outlined hide-details label="Address"> </v-text-field>
                        </v-col>
                    </v-row>
                    <h3 class="mt-4">Products  
                        <v-btn v-if="!isDisabled" icon small color="red" @click="removeLine('p')"><v-icon>mdi-minus</v-icon></v-btn> 
                        <v-btn v-if="!isDisabled" icon small color="primary" @click="addLine('p')"><v-icon>mdi-plus</v-icon></v-btn> 
                    </h3>  
                    <v-divider class="mb-2"></v-divider>
                    <v-row v-for="(supplier,i) in selected_item.supplier_products" :key="i" class="ma-1 pa-0">
                        <v-col class="pa-0 ma-0">
                            <v-autocomplete 
                                v-model="supplier.product_id" 
                                class="px-1"
                                dense 
                                outlined 
                                hide-details 
                                label="Product" 
                                item-text="name"
                                item-value="id"
                                :items="product_selection"
                                :readonly="isDisabled" 
                            > 
                            </v-autocomplete>
                        </v-col>
                        <v-col class="pa-0 ma-0">
                            <v-autocomplete
                                v-model="supplier.payment_type_id" 
                                class="px-1"
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
                        <v-col class="pa-0 ma-0">
                            <v-text-field  class="px-1" :readonly="isDisabled" v-model="supplier.terms" dense outlined hide-details label="Terms"> </v-text-field>
                        </v-col>
                    </v-row> 
                    <h3 class="mt-4">Contacts  
                        <v-btn v-if="!isDisabled" icon small color="red" @click="removeLine('c')"><v-icon>mdi-minus</v-icon></v-btn> 
                        <v-btn v-if="!isDisabled" icon small color="primary" @click="addLine('c')"><v-icon>mdi-plus</v-icon></v-btn> 
                    </h3>   
                    <v-divider class="mb-2"></v-divider>
                    <v-row v-for="(supplier,i) in selected_item.contacts" :key="i" class="ma-1 pa-0">
                        <v-col class="pa-0 ma-0">
                            <v-text-field class="px-1" :readonly="isDisabled" v-model="supplier.contact_person" dense outlined hide-details label="Name"> </v-text-field>
                        </v-col>
                        <v-col class="pa-0 ma-0">
                            <v-text-field class="px-1" :readonly="isDisabled" v-model="supplier.contact_position" dense outlined hide-details label="Position"> </v-text-field>
                        </v-col>
                        <v-col class="pa-0 ma-0">
                            <v-text-field class="px-1" :readonly="isDisabled" v-model="supplier.contact_number" dense outlined hide-details label="Contact"> </v-text-field>
                        </v-col>
                    </v-row> 
                    <h3 class="mt-4">Transactions</h3>
                    <v-divider class="mb-2"></v-divider>
                    <v-row>
                        <v-col>
                            <v-data-table 
                                dense
                                :headers="pricingTable.headers"
                                :items="pricingTable.items"
                                >
                                <template v-slot:[`item.si_price`]="{ item }">
                                    {{ item.si_price | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.si_price_1`]="{ item }">
                                    {{ item.si_price - (item.si_price * .10) | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.si_price_2`]="{ item }">
                                    {{( item.si_price - item.si_price * .15) | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.si_price_3`]="{ item }">
                                    {{ item.si_price - (item.si_price * .20) | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.dr_price`]="{ item }">
                                    {{ item.dr_price | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.dr_price_1`]="{ item }">
                                    {{ item.dr_price - (item.dr_price * .10) | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.dr_price_2`]="{ item }">
                                    {{( item.dr_price - item.dr_price * .15) | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.dr_price_3`]="{ item }">
                                    {{ item.dr_price - (item.dr_price * .20) | currency('₱ ',2) }}
                                </template>
                            </v-data-table>
                        </v-col>
                      
                    </v-row>
                    </v-card-text>
            </v-col>
        </v-row>
        <AddSuppliersDialog :addDialog="addDialog" @closeDialog="closeDialog()" @refreshData="getAll()" :product_selection="product_selection" :payment_type_selection="payment_type_selection"></AddSuppliersDialog>
    </v-app>
  
</template>

<script>
import Swal from 'sweetalert2';
import AddSuppliersDialog from '../../dialog/AddSuppliersDialog.vue';
import ListComponentVue from '@/views/main/ListComponent.vue';
import axios from 'axios';
export default {
    name: 'PosLaravelVueSupplierComponent',

    data() {
        return {
            addDialog:false,
            items:[],
            addDialog:false,
            selected_item:{
                supplier_name:'',
                address:'',
                contacts:[
                    {
                        contact_person: '',
                        contact_position:'',
                        contact_number:'',
                    }
                ],
                supplier_products:[
                    {
                        product_id:0,
                        payment_type_id:0,
                        terms:'',
                    }
                ],
                id:0
            },
            isDisabled:true,
            product_selection:[],
            payment_type_selection:[],
            pricingTable:{
            headers:[
                { text: 'Date', value: 'transaction_date' },
                { text: 'Type', value: 'transaction_type' },
                { text: 'Customer/Supplier', value: 'customer_supplier' },
                { text: 'Add/Subtract', value: 'add' },
                { text: 'Quantity', value: 'quantity' },
                { text: 'Total Amount', value: 'total_amount' },
            ],
            items:[]
        }
        };
    },

    mounted() {
        this.getAll();
        this.getAllItem();
        this.getAllPaymentTypes();
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
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-suppliers`).then(response=>{
                this.items = response.data
            })
        },
        saveCustomer(){
            if(!this.isDisabled){
                let payload = {
                    suppliers:this.selected_item
                }
                axios.post(`${process.env.VUE_APP_HOST_API}/api/update-supplier`,payload).then(response=>{
                    Swal.fire(response.data,'','success')
                    this.getAll();
                })
            }
        },
        getAllItem(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-item`).then(response=>{
                this.product_selection = response.data
            })
        },
        getAllPaymentTypes(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-payment-types`).then(response=>{
                this.payment_type_selection = response.data
            })
        },
        addLine(type){
            if(type == 'c'){
                this.selected_item.contacts.push({
                    contact_person:'',
                    contact_position:'',
                    contact_number:'',
                })
            }
            else if(type == 'p'){
                this.selected_item.supplier_products.push({
                    product_id:0,
                    payment_type_id:0,
                    terms:'',
                })
            }
        },
        removeLine(type){
            if(type == 'c') this.selected_item.contacts.pop()
            else if(type == 'p') this.selected_item.supplier_products.pop()
            
        },
    },
    components:{
        AddSuppliersDialog,
        ListComponentVue
    }
};
</script>

<style lang="scss" scoped>

</style>