<template>
    <v-dialog v-model="dialog" persistent max-width="100%">
    <AddCustomersDialog  @getCustomers="getAllCustomers" :no_discount="true" :addDialog="addDialog" @closeDialog="closeDialog()" @refreshData="getAll()" :pricing_selection="pricing_selection" :payment_type_selection="payment_type_selection"></AddCustomersDialog>

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
                            <!-- <v-col>
                                <v-btn color="green" width="100%" @click="showAllQuotations()">Extract From Quotation</v-btn>
                            </v-col> -->
                            <!-- <v-col>
                                <v-autocomplete 
                                    v-if="from_quotation"
                                    v-model="quotation" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Quotations" 
                                    :items="quotation_selection" 
                                    item-text="q_name"
                                    item-value="id"
                                    return-object
                                    @change="getQuotationDetails()"
                                    > 
                                </v-autocomplete>
                            </v-col> -->
                        </v-row>
                        <v-row>
                            <v-col cols="8">
                                <v-autocomplete 
                                    v-model="purchase.supplier_object" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Customer" 
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
                                <v-autocomplete 
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
                                </v-autocomplete>
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
                                <v-col class="text-center" >
                                    <h3>UOM</h3>
                                </v-col>
                                <v-col class="text-center" >
                                    <h3>Total Price</h3>    
                                </v-col>
                            </v-row>
                            <v-row  v-for="(item,i) in purchase.purchase_items" :key="i" class="ma-1 pa-0">
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
                                    <v-text-field class="mx-1" reverse placeholder="Quantity" v-model="item.quantity" dense outlined hide-details type="number" @blur="computeAmount(i)"> </v-text-field>
                                </v-col>
                                <v-col class="pa-0 ma-0">
                                    <v-text-field class="mx-1" reverse placeholder="Unit Price" v-model="item.unit_price" dense outlined hide-details @blur="computeAmount(i)"> </v-text-field>
                                </v-col>
                                <v-col class="pa-0 ma-0">
                                    <v-text-field class="mx-1" reverse placeholder="UOM" v-model="item.uom" readonly dense outlined hide-details background-color="grey"> </v-text-field>
                                </v-col>
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
                            <v-btn small color="secondary" @click="$emit('closeDialog',false)" class="mr-2">Cancel</v-btn>
                            <v-btn :disabled="from_quotation" small color="green" @click="savePurchase(true)" class="mr-2">Save as Quotation</v-btn>
                            <v-btn small color="primary" @click="savePurchase(false)">Submit</v-btn>
                            
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
import AddCustomersDialog from './AddCustomersDialog.vue'; 
import ShareFunctionsComponent from '../main/ShareFunctionsComponent.vue';
export default {
    mixins: [ShareFunctionsComponent],
    data() {
        return {
            supplier_selection:[],
            salesman_selection:[],
            item_selection:[],
            quotation_selection:[],
            quotation:'',
            purchase:{
                supplier_object:'',
                purchase_num:'',
                address:'',
                supplier_id:'',
                purchase_date:moment().format('YYYY-MM-DD'),
                terms:'',
                remarks:'',
                salesman_id:0,
                is_quotation:0,
                purchase_items:[
                    {
                        item_id:0,
                        quantity:0,
                        unit_price:0,
                        uom:'',
                        total_price:0,
                    }
                ],
                id:0
            },
            from_quotation:false,
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
            ]
        };
    },

    mounted() {
        this.getAllSalesman()
        this.getPurchaseNum()
        this.getAllCustomers()
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
            this.$router.push({name:'purchase-list'})
        },
        getAllCustomers(){
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
            this.purchase.purchase_items[i].unit_price = this.thousandSeprator(item.item_prices.si_price);
        },
        computeAmount(i){
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
        savePurchase(is_quotation){
            Object.assign(this.purchase,{total_amount:this.totalAmount})
            let payload = {
                purchase:this.purchase,
                from_quotation:this.from_quotation
            }
            if(is_quotation){
                this.purchase.is_quotation = 1
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/save-purchase`,payload).then(response=>{
                Swal.fire(response.data,'','success');
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
        getQuotationDetails(){
            this.quotation.purchase_num = this.purchase.purchase_num
            this.purchase = this.quotation
            let c = this.supplier_selection.filter(e=>{
                if(e.id == this.purchase.supplier_id) return e
            }) 
            this.purchase.supplier_object = c[0]
        },
        showAllQuotations(){
            this.from_quotation = true
            let payload = {
                is_quotation:1,
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-purchases`,payload).then(response=>{
                this.quotation_selection = response.data
                if(this.quotation_selection.length == 0){
                    this.from_quotation = false
                }
            })
        },
        thousandSeprator(num){
            return new Intl.NumberFormat('en-US').format(num);
        },
        showAddEditDialog(){
            this.addDialog = true
        },
        
    },
    props:['dialog'],
    components:{
        AddCustomersDialog
    }
};
</script>

<style lang="scss" scoped>

</style>