<template>
    <v-dialog v-model="dialog" persistent max-width="100%">
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col class="text-left">
                        Add New Invoice
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
                                <v-btn color="green" width="100%" @click="showAllQuotations()">Extract From Quotation</v-btn>
                            </v-col>
                            <v-col>
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
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-autocomplete 
                                    v-model="invoice.customer_object" 
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
                                <v-text-field  v-model="invoice.address" dense outlined hide-details label="Address"> </v-text-field>
                            </v-col>
                        </v-row>
                        
                    </v-col>
                    <v-col cols="4">
                        <v-row>
                            <v-col cols="6">
                                <v-text-field readonly background-color="grey" v-model="invoice.invoice_num" dense outlined hide-details label="Invoice #"> </v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="invoice.terms" dense outlined hide-details label="Terms"> </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field readonly v-model="invoice.invoice_date" dense outlined hide-details label="Invoice Date"> </v-text-field>
                            </v-col>
                            <v-col>
                                <v-autocomplete 
                                    v-model="invoice.salesman_id" 
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
                                <!-- <v-text-field v-model="invoice.po_num" dense outlined hide-details label="PO #"> </v-text-field> -->
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="3">
                        <v-textarea
                        row="3"
                        outlined
                        label="Remarks"
                        v-model="invoice.remarks"
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
                            <v-row  v-for="(item,i) in invoice.invoice_items" :key="i" class="ma-1 pa-0">
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
                                    <v-text-field class="mx-1" placeholder="Quantity" v-model="item.quantity" dense outlined hide-details type="number" @blur="computeAmount(i)"> </v-text-field>
                                </v-col>
                                <v-col class="pa-0 ma-0">
                                    <v-text-field class="mx-1" reverse placeholder="Unit Price" v-model="item.unit_price" readonly dense outlined hide-details background-color="grey"> </v-text-field>
                                </v-col>
                                <v-col class="pa-0 ma-0">
                                    <v-text-field class="mx-1" placeholder="UOM" v-model="item.uom" readonly dense outlined hide-details background-color="grey"> </v-text-field>
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
                        <h3>Total: {{totalAmount | currency('₱ ',2) }}</h3>
                    </v-col>
                </v-row>
                <v-divider class="mt-2"></v-divider>              
                    <v-row class="mt-2"> 
                        <v-col class="text-right">
                            <v-btn small color="secondary" @click="$emit('closeDialog',false)" class="mr-2">Cancel</v-btn>
                            <v-btn :disabled="from_quotation" small color="green" @click="saveInvoice(true)" class="mr-2">Save as Quotation</v-btn>
                            <v-btn small color="primary" @click="saveInvoice(false)">Submit</v-btn>
                            
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
export default {
    data() {
        return {
            customer_selection:[],
            salesman_selection:[],
            item_selection:[],
            quotation_selection:[],
            quotation:'',
            invoice:{
                customer_object:'',
                invoice_num:'',
                address:'',
                customer_id:'',
                invoice_date:moment().format('YYYY-MM-DD'),
                terms:'',
                remarks:'',
                salesman_id:0,
                is_quotation:0,
                invoice_items:[
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
            from_quotation:false 
        };
    },

    mounted() {
        this.getAllSalesman()
        this.getInvoiceNum()
        this.getAllCustomers()
        this.getAllItems()
        
    },
    computed:{
        totalAmount(){
            return _.sumBy(this.invoice.invoice_items, 'total_price');
        }
    },
    methods: {
        closeDialog(){
            this.$router.push({name:'invoice-list'})
        },
        getAllCustomers(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-customers`).then(response=>{
                this.customer_selection = response.data
            })
        },
        getAddress(){
            this.invoice.address = this.invoice.customer_object.address;
            this.invoice.customer_id = this.invoice.customer_object.id;
            this.invoice.terms = this.invoice.customer_object.terms;
        },
        getAllItems(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-item`).then(response=>{
                this.item_selection = response.data
            })
        },
        getItemDetails(i){
            let item = _.find(this.item_selection, ['id', this.invoice.invoice_items[i].item_id])
            this.invoice.invoice_items[i].uom = item.uom;
            this.invoice.invoice_items[i].unit_price = this.thousandSeparator(item.item_prices.si_price);
        },
        computeAmount(i){
            let total_price = this.invoice.invoice_items[i].unit_price.replaceAll(",", "") * this.invoice.invoice_items[i].quantity
            this.invoice.invoice_items[i].total_price = this.thousandSeparator(total_price)
        },
        addLine(){
            this.invoice.invoice_items.push({
                item_id:0,
                quantity:0,
                unit_price:0,
                uom:'',
                total_price:0,
            })
        },
        removeLine(){
            this.invoice.invoice_items.pop()
        },
        saveInvoice(is_quotation){
            Object.assign(this.invoice,{total_amount:this.totalAmount})
            let payload = {
                invoice:this.invoice,
                from_quotation:this.from_quotation
            }
            if(is_quotation){
                this.invoice.is_quotation = 1
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/save-invoice`,payload).then(response=>{
                Swal.fire(response.data,'','success');
                this.closeDialog()
            })
            
        },
        getInvoiceNum(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-invoice-num`).then(response=>{
                this.invoice.invoice_num = response.data;    
            })
        },
        getAllSalesman(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-salesmans`).then(response=>{
                this.salesman_selection = response.data
            })
        },
        getQuotationDetails(){
            this.quotation.invoice_num = this.invoice.invoice_num
            this.invoice = this.quotation
            let c = this.customer_selection.filter(e=>{
                if(e.id == this.invoice.customer_id) return e
            }) 
            this.invoice.customer_object = c[0]
        },
        showAllQuotations(){
            this.from_quotation = true
            let payload = {
                is_quotation:1,
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-invoices`,payload).then(response=>{
                this.quotation_selection = response.data
                if(this.quotation_selection.length == 0){
                    this.from_quotation = false
                }
            })
        },
        thousandSeparator(num){
            return new Intl.NumberFormat('en-US').format(num);
        }
        
    },
    props:['dialog']
};
</script>

<style lang="scss" scoped>

</style>