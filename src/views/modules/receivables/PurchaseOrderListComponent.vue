<template>
    <v-app>
        <v-row v-if="userAccess.view">
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
                                v-if="userAccess.edit"
                                small
                                class="mr-2" 
                                :color="!!isDisabled ? 'secondary' : 'green'" 
                                @click="editPurchase(); isDisabled = !isDisabled"
                            >
                                {{ !!isDisabled ? 'Edit' : 'Save'}}
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
                                            :readonly="isDisabled"
                                            v-model="selected_item.supplier_id" 
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
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-text-field  v-model="selected_item.address" :readonly="isDisabled" dense outlined hide-details label="Address"> </v-text-field>
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
                                        <v-text-field v-model="selected_item.purchase_num" :readonly="isDisabled" dense outlined hide-details label="Purchase #"> </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <!-- <v-text-field v-model="selected_item.terms" :readonly="isDisabled" dense outlined hide-details label="Terms"> </v-text-field> -->
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-text-field :readonly="isDisabled" v-model="selected_item.purchase_date" dense outlined hide-details label="Purchase Date"> </v-text-field>
                                    </v-col>
                                    <v-col>
                                        <!-- <v-autocomplete 
                                            :readonly="isDisabled"
                                            v-model="selected_item.salesman_id" 
                                            dense 
                                            outlined 
                                            hide-details 
                                            label="Salesman" 
                                            :items="supplier_selection" 
                                            item-text="name"
                                            item-value="id"
                                            @change="getAddress()"> 
                                        </v-autocomplete> -->
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <!-- <v-text-field :readonly="isDisabled" v-model="selected_item.po_num" dense outlined hide-details label="PO #"> </v-text-field> -->
                                    </v-col>
                                    <v-col cols="6">
                                        <!-- <v-text-field :readonly="isDisabled" v-model="selected_item.sales_account_id" dense outlined hide-details label="GL Sales Account"> </v-text-field> -->
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="3">
                                <v-textarea
                                :readonly="isDisabled"
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
                                        <h3 class="mt-4">  
                                            <v-btn icon small color="red" @click="removeLine()" :disabled="isDisabled"><v-icon>mdi-minus</v-icon></v-btn> 
                                            <v-btn icon small color="primary" @click="addLine()" :disabled="isDisabled"><v-icon>mdi-plus</v-icon></v-btn> 
                                        </h3>   
                                        <v-divider class="mb-2"></v-divider>
                                        <h5>  
                                            Products
                                        </h5> 
                                    </v-card-title>
                                    <v-divider class="mb-2"></v-divider>
                                    <v-row  v-for="(item,i) in selected_item.purchase_items" :key="i" class="ma-1 pa-0">
                                        <v-col class="pa-0 ma-0">
                                            <v-autocomplete 
                                                :readonly="isDisabled"
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
                                            <v-text-field class="mx-1" reverse v-model="item.unit_price" :readonly="isDisabled" dense outlined hide-details label="Unit Price" background-color="grey"> </v-text-field>
                                        </v-col>
                                        <!-- <v-col class="pa-0 ma-0">
                                            <v-text-field class="mx-1" reverse v-model="item.uom" :readonly="isDisabled" dense outlined hide-details label="Unit" background-color="grey"> </v-text-field>
                                        </v-col> -->
                                        <v-col class="pa-0 ma-0">
                                            <v-text-field class="mx-1" reverse v-model="item.total_price" :readonly="isDisabled" dense outlined hide-details label="Total Price"> </v-text-field>
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
                                v-model="totalAmount">
                            </v-text-field>
                                
                            </v-col>
                        </v-row>
                    </v-card-text>
            </v-col>
        </v-row>
        <!-- <AddSuppliersDialog :addDialog="addDialog" @closeDialog="closeDialog()" @refreshData="getAll()" :pricing_selection="pricing_selection" :payment_type_selection="payment_type_selection"></AddSuppliersDialog> -->
    </v-app>
  
</template>

<script>
import AddSuppliersDialog from '../../dialog/AddSuppliersDialog.vue';
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
            supplier_selection:[],
            salesman_selection:[],
            item_selection:[],
            selected_item:{
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
                id:0,
                created_by_name:''
            },
            isDisabled:true,
            userAccess:{
                view:false,
                edit:false
            }   
        };
    },

    mounted() {
        this.checkAccess();
        this.getAll();
        this.getAllSuppliers()
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
        getAllSuppliers(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-suppliers`).then(response=>{
                this.supplier_selection = response.data
            })
        },
        getAddress(){
            this.selected_item.address = this.selected_item.supplier_object.address;
            this.selected_item.supplier_id = this.selected_item.supplier_object.id;
            this.selected_item.terms = this.selected_item.supplier_object.terms;
        },
        getAllItems(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-item`).then(response=>{
                this.item_selection = response.data
            })
        },
        getItemDetails(i){
            let item = _.find(this.item_selection, ['id', this.selected_item.purchase_items[i].item_id])
            // this.selected_item.purchase_items[i].uom = item.uom;
            this.selected_item.purchase_items[i].unit_price = item.item_prices.si_price;
        },
        computeAmount(i){
            let total_price = this.selected_item.purchase_items[i].unit_price.replaceAll(",", "") * this.selected_item.purchase_items[i].quantity
            this.selected_item.purchase_items[i].total_price = total_price
        },
        addLine(){
            this.selected_item.purchase_items.push({
                item_id:0,
                quantity:0,
                unit_price:0,
                uom:'',
                total_price:0,
            })
        },
        removeLine(){
            this.selected_item.purchase_items.pop()
        },
        getAll(){
            let payload = {
                is_purchase_order:1,
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-purchases`,payload).then(response=>{
                response.data.forEach(e=>{
                    e.name = e.q_name
                })
                this.items = response.data
            })
        },
        editPurchase(is_purchase_order){
            if(!this.isDisabled){
                Object.assign(this.selected_item,{total_amount:this.totalAmount})
                let payload = {
                    purchase:this.selected_item,
                }
                axios.post(`${process.env.VUE_APP_HOST_API}/api/update-purchase`,payload).then(response=>{
                    Swal.fire(response.data,'','success');
                    this.closeDialog()
                })
            }
            
        },
        checkAccess(){
            let payload = {
                side_nav_id:2,
                side_nav_link_id:4,
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
                console.log(this.userAccess)
            })
        }
        
    },
    components:{
        AddSuppliersDialog,
        ListComponentVue
    },
    watch:{
        'selected_item.purchase_items' : function(newVal, oldVal) { 
            newVal.forEach(e=>{
                e.total_price = this.thousandSeprator(e.total_price)
                e.unit_price = this.thousandSeprator(e.unit_price)
            })
        },
        'selected_item.total_amount' :function(newVal, oldVal) {  
            this.selected_item.total_amount = this.thousandSeprator(newVal)
        }
    },
    computed:{
        totalAmount(){
            let container = this.selected_item.purchase_items
            container.forEach(e=>{
                e.total_price = Number (String (e.total_price).replaceAll(/,/g, ""))
            })
            return this.thousandSeprator(_.sumBy(container, 'total_price'));
        }
    }
};
</script>

<style lang="scss" scoped>

</style>