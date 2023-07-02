<template>
    <v-app>
        <v-row>
            <v-col class="text-left" cols="3">
                <ListComponentVue :listItems="items" @selectedItem="selectItem" :listTitle="'Items'"></ListComponentVue>
            </v-col>
            <v-col class="text-left px-2 mt-2" cols="9" v-if="userAccess.view">
                <v-row class="text-left px-2 mt-1">
                    <v-col class="text-left">
                        <v-btn
                            v-if="userAccess.create"
                            small
                            color="primary" 
                            @click="showAddEditInvoiceDialog">
                                <v-icon>mdi-plus</v-icon>
                                Add Invoice
                        </v-btn>
                    </v-col>
                </v-row>
                <v-card-title>
                    <v-row>
                        <v-col>Customer Details</v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right">
                            <v-btn 
                                v-if="userAccess.create_collection"
                                :disabled="selected_item.balance_amount == 0" 
                                small
                                color="primary" 
                                @click="showAddEditDialog">
                                    <v-icon>mdi-plus</v-icon>
                                    Add Collection
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
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
                                <v-row>
                                    <v-col>
                                        <v-text-field  v-model="selected_item.created_by_name" readonly dense outlined hide-details label="Created By"> </v-text-field>
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
                                    <v-row>
                                        <v-col class="text-center">
                                            <h3>Item</h3>
                                        </v-col>
                                        <v-col class="text-center" >
                                            <h3>Quantity</h3>
                                        </v-col>
                                        <v-col class="text-center" >
                                            <h3>Unit Price</h3>
                                        </v-col>
                                        <v-col class="text-center" >
                                            <h3>Discount Price</h3>
                                        </v-col>
                                        <v-col class="text-center" >
                                            <h3>UOM</h3>
                                        </v-col>
                                        <v-col class="text-center" >
                                            <h3>Total Price</h3>    
                                        </v-col>
                                    </v-row>
                                    <v-row  v-for="(item,i) in selected_item.invoice_items" :key="i" class="ma-1 pa-0">
                                        <v-col class="pa-0 ma-0">
                                            <v-autocomplete 
                                                readonly
                                                v-model="item.item_id" 
                                                dense 
                                                outlined 
                                                hide-details 
                                                :items="item_selection" 
                                                item-text="name"
                                                item-value="id"
                                                @change="getItemDetails(i)"> 
                                            </v-autocomplete>
                                        </v-col>
                                        <v-col class="pa-0 ma-0">
                                            <v-text-field class="mx-1" reverse v-model="item.quantity" dense outlined hide-details type="number" @blur="computeAmount(i)"> </v-text-field>
                                        </v-col>
                                        <v-col class="pa-0 ma-0">
                                            <v-text-field class="mx-1" reverse v-model="item.unit_price" dense outlined hide-details background-color="grey" @blur="formatNumber(item.unit_price,i,'unit_price')"> </v-text-field>
                                        </v-col>
                                        <v-col class="pa-0 ma-0">
                                            <v-text-field class="mx-1" reverse v-model="item.discount_price" dense outlined hide-details background-color="grey" @blur="formatNumber(item.unit_price,i,'discount_price')"> </v-text-field>
                                        </v-col>
                                        <v-col class="pa-0 ma-0">
                                            <v-text-field class="mx-1" reverse v-model="item.uom" readonly dense outlined hide-details background-color="grey"> </v-text-field>
                                        </v-col>
                                        <v-col class="pa-0 ma-0">
                                            <v-text-field class="mx-1" reverse v-model="item.total_price" readonly dense outlined hide-details> </v-text-field>
                                        </v-col>
                                    </v-row> 
                                </v-col>
                            </v-row>
                        </v-card>
                        <v-row class="mt-5">
                            <v-spacer></v-spacer>
                            <v-col cols="3" class="text-right">
                                <v-text-field 
                                reverse
                                dense
                                outlined
                                hide-details
                                v-model="selected_item.total_amount">
                            </v-text-field>
                                
                            </v-col>
                        </v-row>
                        <v-card class="mt-2">
                            <v-row>
                                <v-col>
                                    <v-card-title>
                                        <h5>  
                                            Allocated Payments
                                        </h5> 
                                    </v-card-title>
                                    <v-divider class="mb-2"></v-divider>
                                    
                                            <v-data-table
                                            :headers="paymentHeaders"
                                            :items="selected_item.collections"
                                            dense>

                                            <template v-slot:[`item.gross_amount`]="{ item }">
                                                {{ item.gross_amount | currency('₱ ',2) }}
                                            </template>
                                            <template v-slot:[`item.remaining_amount`]="{ item }">
                                                {{ item.remaining_amount | currency('₱ ',2) }}
                                            </template>
                                            <template v-slot:[`item.action`]="{ item }">
                                                <v-btn fab x-small icon text color="orange" @click="showFileViewer(item)"><v-icon>mdi-eye</v-icon></v-btn>
                                            </template>
                                            </v-data-table>
                                       
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-card-text>
            </v-col>
        </v-row>
        <AddCollectionDialog :addDialog="addDialog" @closeDialog="closeDialog()" @refreshData="getAll()" :selected_item="selected_item"></AddCollectionDialog>
        <BaseFileViewerComponentVue :show="fileDialog.show" :files="fileDialog.files" @closeFileViewer="closeFileViewer"></BaseFileViewerComponentVue>
        <AddInvoiceDialogVue :dialog="addInvoiceDialog" @closeAddInvoiceDialog="closeAddInvoiceDialog" @refreshTable="getAll"></AddInvoiceDialogVue>
    </v-app>
  
</template>

<script>
import AddCollectionDialog from '../../dialog/AddCollectionDialog.vue';
import ListComponentVue from '@/views/main/ListComponent.vue';
import ShareFunctionsComponentVue from '@/views/main/ShareFunctionsComponent.vue';
import BaseFileViewerComponentVue from '@/views/main/BaseFileViewerComponent.vue';
import axios from 'axios';
import AddInvoiceDialogVue from '@/views/dialog/AddInvoiceDialog.vue';
import Swal from 'sweetalert2';
import moment from 'moment'
export default {
    name: 'PosLaravelVueProductComponent',
    mixins:[ShareFunctionsComponentVue],
    data() {
        return {
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
                        discount_price:0
                    }
                ],
                total_amount:0,
                balance_amount:0,
                paid_amount:0,
                id:0,
                size:'',
                collections:[],
                created_by_name:''
            },
            addDialog:false,
            items:[],
            paymentHeaders:[
                    { text: 'Reference #', value: 'reference_num',class:'grey lighten-2' },
                    { text: 'Transaction #', value: 'cheque_num',class:'grey lighten-2' },
                    { text: 'Transaction Date', value: 'transaction_date',class:'grey lighten-2' },
                    { text: 'Amount', value: 'gross_amount',align:'right',class:'grey lighten-2' },
                    { text: 'Remaining Amount', value: 'remaining_amount',align:'right',class:'grey lighten-2' },
                    { text: 'Payment Date', value: 'payment_date',class:'grey lighten-2' },
                    { text: 'View Files', value: 'action',class:'grey lighten-2' },
                ],
            paymentItems:[],
            fileDialog:{
                show:false,
                files:[]
            },
            addInvoiceDialog:false,
            userAccess:{
                view:false,
                create:false,
                create_collection:false,
                edit:false
            }
        };
    },

    mounted() {
        this.checkAccess();
        this.getAll();
        this.getAllCustomers()
        this.getAllItems()
    },
    methods: {
        formatNumber(number, index, field) {
            this.selected_item.invoice_items[index][field] =
                this.thousandSeprator(number);
        },
        selectItem(item){
            this.selected_item = item
            this.collectionId = this.selected_item.id
        },
        closeDialog(){
            this.addDialog = false
        },
        showAddEditDialog(){
            this.addDialog = true
        },
        showAddEditInvoiceDialog(){
            this.addInvoiceDialog = true
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
            this.selected_item.invoice_items[i].total_price = this.thousandSeprator(total_price)
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
                is_quotation:0
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-invoices`,payload).then(response=>{
                this.items = response.data
            })
        },
        showFileViewer(item){
            this.fileDialog = {
                show:true,
                files:item.collection_files
            }
        },
        closeFileViewer(){
            this.fileDialog = {
                show:false,
                files:[]
            }
        },
        closeAddInvoiceDialog(){
            this.addInvoiceDialog = false
        },
        checkAccess(){
            let payload = {
                side_nav_id:1,
                side_nav_link_id:2,
                user_id:localStorage.getItem('user_id'),
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-access`,payload).then(response=>{
                for(const property in response.data){
                    let isActive = false
                    if(response.data[property]['active'] == 1){
                        isActive = true
                    }
                    Object.assign(this.userAccess,{
                        [response.data[property]['code']]:isActive
                    })
                }
                //console.log(this.userAccess)
            })
        }
    },
    components:{
        AddCollectionDialog,
        ListComponentVue,
        BaseFileViewerComponentVue,
        AddInvoiceDialogVue
    },
    watch:{
        'selected_item.invoice_items' : function(newVal, oldVal) { 
            newVal.forEach(e=>{
                e.total_price = this.thousandSeprator(e.total_price)
                e.unit_price = this.thousandSeprator(e.unit_price)
                e.discount_price = this.thousandSeprator(e.discount_price)
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