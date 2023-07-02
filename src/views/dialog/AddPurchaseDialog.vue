<template>
    <v-dialog v-model="dialog" persistent max-width="100%">
    <!-- <AddSuppliersDialog  @getSuppliers="getAllSuppliers" :no_discount="true" :addDialog="addDialog" @closeDialog="closeDialog()" @refreshData="getAll()" :pricing_selection="pricing_selection" :payment_type_selection="payment_type_selection"></AddSuppliersDialog> -->

        <v-card>
            <v-card-title>
                <v-row>
                    <v-col class="text-left">
                        Add New Purchase
                    </v-col>
                    <v-col class="text-right">
                        <v-btn text @click="closeDialog()"><v-icon>mdi-close-circle</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>  
            <v-card-text>
                <v-row>
                    <v-col cols="5">
                        <v-row>
                            <v-col>
                                <v-btn color="green" width="100%" @click="showAllPurchaseOrders()">Extract From Purchase Order</v-btn>
                            </v-col>
                            <v-col>
                                <v-autocomplete 
                                    v-if="from_purchase_order"
                                    v-model="purchase_order" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="PurchaseOrders" 
                                    :items="purchase_order_selection" 
                                    item-text="q_name"
                                    item-value="id"
                                    return-object
                                    @change="getPurchaseOrderDetails()"
                                    > 
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="8">
                                <v-autocomplete 
                                    v-model="purchase.supplier_object" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Supplier" 
                                    :items="supplier_selection" 
                                    item-text="name"
                                    item-value="id"
                                    return-object
                                    @change="getAddress()"> 
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="4">
                                <v-btn 
                                    color="primary" 
                                    @click="showAddEditDialog">
                                        <v-icon>mdi-plus</v-icon>
                                        Add
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field  v-model="purchase.address" dense outlined hide-details label="Address"> </v-text-field>
                            </v-col>
                        </v-row>
                        
                    </v-col>
                    <v-col cols="4">
                        <v-row>
                            <v-col cols="6">
                                <v-text-field readonly background-color="grey" v-model="purchase.purchase_num" dense outlined hide-details label="Purchase #"> </v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="purchase.terms" dense outlined hide-details label="Terms"> </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field readonly v-model="purchase.purchase_date" dense outlined hide-details label="Purchase Date"> </v-text-field>
                            </v-col>
                            <v-col>
                                <!-- <v-autocomplete 
                                    disabled
                                    v-model="purchase.salesman_id" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Salesman" 
                                    :items="salesman_selection" 
                                    item-text="name"
                                    item-value="id"
                                    @change="getAddress()"> 
                                </v-autocomplete> -->
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <!-- <v-text-field v-model="purchase.po_num" dense outlined hide-details label="PO #"> </v-text-field> -->
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="3">
                        <v-textarea
                        row="3"
                        outlined
                        label="Remarks"
                        v-model="purchase.remarks"
                        >
                        </v-textarea>
                    </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-card class="mt-2">
                    <v-row>
                        <v-col>
                            <h3 class="mt-4">  
                                <v-btn icon small color="red" @click="removeLine()"><v-icon>mdi-minus</v-icon></v-btn> 
                                <v-btn icon small color="primary" @click="addLine()"><v-icon>mdi-plus</v-icon></v-btn> 
                            </h3>   
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
                                <!-- <v-col class="text-center" >
                                    <h3>UOM</h3>
                                </v-col> -->
                                <v-col class="text-center" >
                                    <h3>Total Price</h3>    
                                </v-col>
                            </v-row>
                            <v-row  v-for="(item,i) in purchase.purchase_items" :key="i" class="ma-1 pa-0" :style="!!item.hasError ? 'background-color:orange': '' ">
                                <v-col class="pa-0 ma-0">
                                    <v-autocomplete 
                                        placeholder="Item" v-model="item.item_id" 
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
                                    <v-text-field class="mx-1" reverse placeholder="Quantity" v-model="item.quantity" dense outlined hide-details type="number" @blur="computeAmount(i,item.current_stock)"> </v-text-field>
                                </v-col>
                                <v-col class="pa-0 ma-0">
                                    <v-text-field class="mx-1" reverse placeholder="Unit Price" v-model="item.unit_price" dense outlined hide-details @blur="computeAmount(i,item.current_stock)"> </v-text-field>
                                </v-col>
                                <!-- <v-col class="pa-0 ma-0">
                                    <v-text-field class="mx-1" reverse placeholder="UOM" v-model="item.uom" readonly dense outlined hide-details background-color="grey"> </v-text-field>
                                </v-col> -->
                                <v-col class="pa-0 ma-0">
                                    <v-text-field class="mx-1" reverse placeholder="Total Price" v-model="item.total_price" readonly dense outlined hide-details> </v-text-field>
                                </v-col>
                            </v-row> 
                        </v-col>
                    </v-row>
                </v-card>
                <v-row class="mt-5">
                    <v-spacer></v-spacer>
                    <v-col class="text-right">
                        <h3>Total: &#8369; {{thousandSeprator(totalAmount) }}</h3>
                    </v-col>
                </v-row>
                <v-divider class="mt-2"></v-divider>              
                    <v-row class="mt-2"> 
                        <v-col class="text-right">
                            <v-btn :disabled="from_purchase_order" small color="green" @click="savePurchase(true)" class="mr-2">Save as Purchase Order</v-btn>
                            <v-btn small color="primary" @click="savePurchase(false)" :disabled="outOfStocks != 0">Print and Submit</v-btn>
                            <!-- <PrintPurchaseComponentVue :purchase="purchase" :print_purchase="print_purchase" :totalAmount="totalAmount" @resetPrint="resetPrint"></PrintPurchaseComponentVue>  -->
                        </v-col>
                    </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
    
    
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment'
import AddSuppliersDialog from './AddSuppliersDialog.vue'; 
import ShareFunctionsComponent from '../main/ShareFunctionsComponent.vue';
// import PrintPurchaseComponentVue from '../prints/PrintPurchaseComponent.vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
export default {
    mixins: [ShareFunctionsComponent],
    data() {
        return {
            supplier_selection:[],
            salesman_selection:[],
            item_selection:[],
            purchase_order_selection:[],
            purchase_order:'',
            purchase:{
                supplier_object:'',
                purchase_num:'',
                address:'',
                supplier_id:'',
                purchase_date:moment().format('YYYY-MM-DD'),
                terms:'',
                remarks:'',
                salesman_id:1,
                is_purchase_order:0,
                purchase_items:[
                    {
                        item_id:0,
                        quantity:0,
                        unit_price:0,
                        uom:'',
                        total_price:0,
                        item_name:null,
                        current_stock:0,
                        hasError:false
                    }
                ],
                id:0
            },
            from_purchase_order:false,
            addDialog:false,
            pricing_selection:[
                {
                    code:"N/A",
                    id:9999
                }
            ],
            payment_type_selection:[
                {
                    name:"CASH",
                    id:9999
                }
            ],
            print_purchase:false,
            outOfStocks:0
        };
    },

    mounted() {
        this.getAllSalesman()
        this.getPurchaseNum()
        this.getAllSuppliers()
        this.getAllItems()
        
    },
    computed:{
        totalAmount(){
            let container = this.purchase.purchase_items
            container.forEach(e=>{
                e.total_price = Number (String (e.total_price).replaceAll(/,/g, ""))
            })
            return _.sumBy(container, 'total_price');
        }
    },
    methods: {
        closeDialog(){
            this.$emit('closeAddPurchaseDialog')
            this.$emit('refreshTable')
        },
        getAllSuppliers(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-suppliers`).then(response=>{
                this.supplier_selection = response.data
            })
        },
        getAddress(){
            this.purchase.address = this.purchase.supplier_object.address;
            this.purchase.supplier_id = this.purchase.supplier_object.id;
            this.purchase.terms = this.purchase.supplier_object.terms;
            this.purchase.salesman_id = this.purchase.supplier_object.salesman_id
        },
        getAllItems(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-item`).then(response=>{
                this.item_selection = response.data
            })
        },
        getItemDetails(i){
            let item = _.find(this.item_selection, ['id', this.purchase.purchase_items[i].item_id])
            
            this.purchase.purchase_items[i].uom = item.uom;
            this.purchase.purchase_items[i].item_name = item.name;
            this.purchase.purchase_items[i].unit_price = item.dr_price
            this.purchase.purchase_items[i].current_stock = item.current_stock

            // if(item.current_stock <= 0){
            //     this.outOfStocks++
            //     this.purchase.purchase_items[i].hasError = true
            // }
            // else{
            //     this.outOfStocks--
            //     if(this.outOfStocks <= 0){
            //         this.outOfStocks = 0
            //     }  
            // }
        },
        computeAmount(i,current_stock){
            // this.purchase.purchase_items[i].hasError = false
            // if(current_stock < this.purchase.purchase_items[i].quantity){
            //     this.outOfStocks++
            //     this.purchase.purchase_items[i].hasError = true
            // }
            // else{
            //     this.outOfStocks--
            //     if(this.outOfStocks <= 0){
            //         this.outOfStocks = 0
            //     }   
            // }
            let total_price = this.purchase.purchase_items[i].unit_price.replaceAll(",", "") * this.purchase.purchase_items[i].quantity
            this.purchase.purchase_items[i].total_price = this.thousandSeprator(total_price)
        },
        addLine(){
            this.purchase.purchase_items.push({
                item_id:0,
                quantity:0,
                unit_price:0,
                uom:'',
                total_price:0,
            })
        },
        removeLine(){
            this.purchase.purchase_items.pop()
        },
        async savePurchase(is_purchase_order){
            Object.assign(this.purchase,{total_amount:this.totalAmount})
            let payload = {
                purchase:this.purchase,
                from_purchase_order:this.from_purchase_order
            }
            if(is_purchase_order){
                this.purchase.is_purchase_order = 1
            }
            await axios.post(`${process.env.VUE_APP_HOST_API}/api/save-purchase`,payload).then(response=>{
                Swal.fire(response.data,'','success');
                this.print_purchase = true
                this.resetFields()
                this.closeDialog()
            })
            
        },
        getPurchaseNum(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-purchase-num`).then(response=>{
                this.purchase.purchase_num = response.data;    
            })
        },
        getAllSalesman(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-salesmans`).then(response=>{
                this.salesman_selection = response.data
            })
        },
        getPurchaseOrderDetails(){
            this.purchase_order.purchase_num = this.purchase.purchase_num
            this.purchase = this.purchase_order
            let c = this.supplier_selection.filter(e=>{
                if(e.id == this.purchase.supplier_id) return e
            }) 
            this.purchase.supplier_object = c[0]
        },
        showAllPurchaseOrders(){
            this.from_purchase_order = true
            let payload = {
                is_purchase_order:1,
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-purchases`,payload).then(response=>{
                this.purchase_order_selection = response.data
                if(this.purchase_order_selection.length == 0){
                    this.from_purchase_order = false
                }
            })
        },
        thousandSeprator(num){
            return new Intl.NumberFormat('en-US').format(num);
        },
        showAddEditDialog(){
            this.addDialog = true
        },
        resetPrint(){
            this.print_purchase = false
        },
        resetFields(){
            Object.assign(this.$data, this.$options.data.call(this));
            this.getAllSalesman()
            this.getPurchaseNum()
            this.getAllSuppliers()
            this.getAllItems()
        }
    },
    props:['dialog'],
    components:{
        AddSuppliersDialog,
        // PrintPurchaseComponentVue
    }
};
</script>

<style lang="scss" scoped>

</style>