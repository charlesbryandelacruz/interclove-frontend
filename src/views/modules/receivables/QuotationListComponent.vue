<template>
    <v-app>
        <v-row>
            <v-col class="text-left" cols="3">
                <ListComponentVue :listItems="items" @selectedItem="selectItem" :listTitle="'Items'"></ListComponentVue>
            </v-col>
            <v-col class="text-left px-2 mt-2" cols="9">
                    <v-card-text>
                        <v-row>
                            <v-col cols="5">
                                <v-row>
                                    <v-col>
                                        <v-autocomplete 
                                            readonly
                                            v-model="selected_item.customer_id" 
                                            dense 
                                            outlined 
                                            hide-details 
                                            label="Customer" 
                                            :items="customer_selection" 
                                            item-text="name"
                                            item-value="id"
                                            return-object
                                            @change="getAddress()"> 
                                        </v-autocomplete>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-text-field  v-model="selected_item.address" readonly dense outlined hide-details label="Address"> </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="4">
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field v-model="selected_item.invoice_num" readonly dense outlined hide-details label="Invoice #"> </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field v-model="selected_item.terms" readonly dense outlined hide-details label="Terms"> </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-text-field readonly v-model="selected_item.invoice_date" dense outlined hide-details label="Invoice Date"> </v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-autocomplete 
                                            readonly
                                            v-model="selected_item.salesman_id" 
                                            dense 
                                            outlined 
                                            hide-details 
                                            label="Salesman" 
                                            :items="customer_selection" 
                                            item-text="name"
                                            item-value="id"
                                            @change="getAddress()"> 
                                        </v-autocomplete>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <!-- <v-text-field readonly v-model="selected_item.po_num" dense outlined hide-details label="PO #"> </v-text-field> -->
                                    </v-col>
                                    <v-col cols="6">
                                        <!-- <v-text-field readonly v-model="selected_item.sales_account_id" dense outlined hide-details label="GL Sales Account"> </v-text-field> -->
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="3">
                                <v-textarea
                                readonly
                                row="3"
                                outlined
                                label="Remarks"
                                v-model="selected_item.remarks"
                                >
                                </v-textarea>
                            </v-col>
                        </v-row>
                        <v-card class="mt-2">
                            <v-row>
                                <v-col>
                                    <v-card-title>
                                        <h5>  
                                            Products
                                        </h5> 
                                    </v-card-title>
                                    <v-divider class="mb-2"></v-divider>
                                    <v-row  v-for="(item,i) in selected_item.invoice_items" :key="i" class="ma-1 pa-0">
                                        <v-col class="pa-0 ma-0">
                                            <v-autocomplete 
                                                readonly
                                                v-model="item.item_id" 
                                                dense 
                                                outlined 
                                                hide-details 
                                                label="Item" 
                                                :items="item_selection" 
                                                item-text="name"
                                                item-value="id"
                                                @change="getItemDetails(i)"> 
                                            </v-autocomplete>
                                        </v-col>
                                        <v-col class="pa-0 ma-0">
                                            <v-text-field class="mx-1"  reverse v-model="item.quantity" dense outlined hide-details label="Quantity" type="number" @blur="computeAmount(i)"> </v-text-field>
                                        </v-col>
                                        <v-col class="pa-0 ma-0">
                                            <v-text-field class="mx-1" reverse v-model="item.unit_price" readonly dense outlined hide-details label="Unit Price" background-color="grey"> </v-text-field>
                                        </v-col>
                                        <v-col class="pa-0 ma-0">
                                            <v-text-field class="mx-1" reverse v-model="item.uom" readonly dense outlined hide-details label="Unit" background-color="grey"> </v-text-field>
                                        </v-col>
                                        <v-col class="pa-0 ma-0">
                                            <v-text-field class="mx-1" reverse v-model="item.total_price" readonly dense outlined hide-details label="Total Price"> </v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                            </v-row>
                        </v-card>
                        <v-row class="mt-5">
                            <v-spacer></v-spacer>
                            <v-col class="text-right">
                                <h3>Total: {{selected_item.total_amount | currency('₱ ',2) }}</h3>
                            </v-col>
                        </v-row>
                    </v-card-text>
            </v-col>
        </v-row>
        <!-- <AddCustomersDialog :addDialog="addDialog" @closeDialog="closeDialog()" @refreshData="getAll()" :pricing_selection="pricing_selection" :payment_type_selection="payment_type_selection"></AddCustomersDialog> -->
    </v-app>
  
</template>

<script>
import AddCustomersDialog from '../../dialog/AddCustomersDialog.vue';
import ListComponentVue from '@/views/main/ListComponent.vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment'
import ShareFunctionsComponent from '@/views/main/ShareFunctionsComponent.vue';
export default {
    name: 'PosLaravelVueProductComponent',
    mixins:[ShareFunctionsComponent],
    data() {
        return {
            items:[],
            customer_selection:[],
            salesman_selection:[],
            item_selection:[],
            selected_item:{
                customer_object:'',
                invoice_num:'',
                address:'',
                customer_id:'',
                invoice_date:moment().format('YYYY-MM-DD'),
                po_num:'',
                terms:'',
                salesman_id:0,
                sales_account_id:0,
                remarks:'',
                invoice_items:[
                    {
                        item_id:0,
                        quantity:0,
                        unit_price:0,
                        uom:'',
                        total_price:0,
                    }
                ],
                total_amount:0
            }   
        };
    },

    mounted() {
        this.getAll();
        this.getAllCustomers()
        this.getAllItems()
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
        getAllCustomers(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-customers`).then(response=>{
                this.customer_selection = response.data
            })
        },
        getAddress(){
            this.selected_item.address = this.selected_item.customer_object.address;
            this.selected_item.customer_id = this.selected_item.customer_object.id;
            this.selected_item.terms = this.selected_item.customer_object.terms;
        },
        getAllItems(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-item`).then(response=>{
                this.item_selection = response.data
            })
        },
        getItemDetails(i){
            let item = _.find(this.item_selection, ['id', this.selected_item.invoice_items[i].item_id])
            this.selected_item.invoice_items[i].uom = item.uom;
            this.selected_item.invoice_items[i].unit_price = item.item_prices.si_price;
        },
        computeAmount(i){
            let total_price = this.selected_item.invoice_items[i].unit_price * this.selected_item.invoice_items[i].quantity
            this.selected_item.invoice_items[i].total_price = total_price
        },
        addLine(){
            this.selected_item.invoice_items.push({
                item_id:0,
                quantity:0,
                unit_price:0,
                uom:'',
                total_price:0,
            })
        },
        removeLine(){
            this.selected_item.invoice_items.pop()
        },
        getAll(){
            let payload = {
                is_quotation:1,
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-invoices`,payload).then(response=>{
                response.data.forEach(e=>{
                    e.name = e.q_name
                })
                this.items = response.data
            })
        },
        
    },
    components:{
        AddCustomersDialog,
        ListComponentVue
    },
    watch:{
        'selected_item.invoice_items' : function(newVal, oldVal) { 
            newVal.forEach(e=>{
                e.total_price = this.thousandSeprator(e.total_price)
                e.unit_price = this.thousandSeprator(e.unit_price)
            })
        },
        'selected_item.total_amount' :function(newVal, oldVal) {  
            this.selected_item.total_amount = this.thousandSeprator(newVal)
        }
    }
};
</script>

<style lang="scss" scoped>

</style>