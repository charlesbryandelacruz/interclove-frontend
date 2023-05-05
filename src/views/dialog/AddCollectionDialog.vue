<template>
    <v-dialog v-model="showDialog" persistent max-width="50%">
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col class="text-left">
                        Add New Collection
                    </v-col>
                    <v-col class="text-right">
                        <v-btn text icon fab @click="$emit('closeDialog',false)"><v-icon>mdi-close-circle</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>  
            <v-card-text>
                <v-divider></v-divider>
                <h3 class="mt-4">Invoice Details</h3>
                <v-row class="mt-2">
                    <v-col cols="4">
                        <v-text-field 
                            v-model="selected_item.invoice_num"
                            label="Invoice #"
                            outlined
                            readonly
                            dense
                            background-color="grey"
                            >  
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field 
                            v-model="selected_item.invoice_date"
                            label="Invoice Date"
                            outlined
                            readonly
                            dense
                            background-color="grey"
                            >  
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field 
                            v-model="display_total_amount"
                            label="Invoice Amount"
                            outlined
                            readonly
                            dense
                            background-color="grey"
                            >  
                        </v-text-field>
                    </v-col>
                </v-row>
                <h3 class="mt-2">Collection Detail</h3>
                <v-row class="mt-2">
                    <v-col cols="4">
                        <v-autocomplete 
                            v-model="collection.payment_type_id"
                            label="Collection Method"
                            :items="payment_type_selection"
                            item-text="name"
                            item-value="id"
                            outlined
                            dense
                            >  
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field 
                            v-model="collection.cheque_num"
                            :disabled="collection.payment_type_id == 2"
                            :background-color="collection.payment_type_id == 2 ? 'grey' : 'white' "
                            label="Account Number"
                            outlined
                            dense
                            >  
                        </v-text-field>
                    </v-col>
                    <v-col cols="4" v-if="collection.payment_type_id != 2">
                        <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="collection.transaction_date"
                        :disabled="collection.payment_type_id == 2"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="collection.transaction_date"
                            :disabled="collection.payment_type_id == 2"
                            dense
                            outlined
                            label="Picker in menu"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="collection.transaction_date"
                        no-title
                        scrollable
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="menu = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(collection.transaction_date)"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-menu>
                       
                    </v-col>
                </v-row>
                <v-row class="mt-0">
                    <v-col cols="8">
                        <v-textarea 
                            v-model="collection.remarks"
                            label="Remarks"
                            outlined
                            dense
                            rows="2"
                            >  
                        </v-textarea>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field 
                            v-model="collection.gross_amount"
                            label="Amount"
                            outlined
                            dense
                            >  
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row class="mt-2">
                    <v-col cols="6" v-if="excessCollections.length > 0">
                        <v-data-table
                            :headers="headers"
                            :items="excessCollections"
                            dense
                        >
                        <template v-slot:[`item.remaining_amount`]="{ item }">
                            {{ item.remaining_amount | currency('₱ ',2) }}
                        </template>
                        <template v-slot:[`item.action`]="{ item }">
                            <span>
                                <v-btn :disabled="checkAllocations(item)" text icon fab small color="green" @click="allocateCollection(item)"><v-icon>mdi-cash-plus</v-icon></v-btn>
                            </span>
                        </template>
                        </v-data-table>
                    </v-col>
                    <v-col class="text-right">
                        <h3>Gross Amount: {{selected_item.total_amount | currency('₱ ',2) }}</h3> 
                        <h3>Paid Amount: {{selected_item.paid_amount | currency('₱ ',2) }}</h3> 
                        <h3>Balance Amount: {{selected_item.balance_amount | currency('₱ ',2) }}</h3>
                        <br/>
                        <h3>Collection: {{collection_amount | currency('₱ ',2) }}</h3>
                        <h3>(Balance less Collection) : {{totalAmount | currency('₱ ',2)}}</h3>
                    </v-col>
                </v-row>
                <v-divider class="mt-2"></v-divider>              
                    <v-row class="mt-2"> 
                        <v-col class="text-right">
                            <v-btn small color="secondary" @click="$emit('closeDialog',false)" class="mr-2">Cancel</v-btn>
                            <v-btn small color="primary" @click="saveCollection()">Submit</v-btn>
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
            menu:false,
            invoice_selection:[],
            collection:{
                invoice_id:0,
                payment_type_id:0,
                gross_amount:0,
                remaining_amount:0,
                customer_id:0,
                payment_date:moment().format('YYYY-MM-DD'),
                remarks:'',
                cheque_num:null,
                collected_amount:0,
                transaction_date:'',
                
            },
            showDialog:false,
            display_total_amount:'',
            payment_type_selection:[],
            excessCollections:[],
            headers:[
                { text: 'Reference', value: 'reference_num',align:'left' },
                { text: 'Remaining', value: 'remaining_amount',align:'right' },
                { text: 'Action', value: 'action',align:'center' }
            ],
            allocatedRemainingCollection:[]
        };
    },

    mounted() {
        this.getAllCollectionTypes();
    },
    methods: {
        formatPrice(value) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'PHP',
                minimumFractionDigits: 2
            });
            return formatter.format(value);
        },
        getAllCollectionTypes(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-payment-types`).then(response=>{
                this.payment_type_selection = response.data
            })
        },
        saveCollection(){
            let payload = {
                collection:this.collection,
                excess_collection: this.allocatedRemainingCollection
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/save-collection`,payload).then(response=>{
                Swal.fire(response.data,'','success');
                this.$emit('refreshData')
                this.$emit('closeDialog')
                this.resetFields();
            })
        },
        getAllExcesCollections(){
            let payload = {
                customer_id:this.selected_item.customer_id
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-excess-collection`,payload).then(response=>{
                this.excessCollections = response.data
            })
        },
        allocateCollection(item){
            Swal.fire({
                icon: 'warning',
                title: 'Are you sure you want to allocate the remaining amount of this collection?.',
                text: '',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                showCancelButton: true,
                reverseButtons:true
            })
            .then((result) => {
                if(result.isConfirmed){
                    this.allocatedRemainingCollection.push(item)
                }
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
        },
        checkAllocations(item){
            if(this.allocatedRemainingCollection.includes(item)){
                return true
            }
            return false
        },
        resetFields(){
            Object.assign(this.$data, this.$options.data.call(this));
        }
    },
    props:['addDialog','selected_item'],
    watch:{
        addDialog:{
            handler(val){
                this.showDialog = val
                this.display_total_amount = this.formatPrice(this.selected_item.total_amount)
                this.collection.invoice_id = this.selected_item.id
                this.getAllExcesCollections();
            }
        },
        selected_item:{
            handler(val){
                
            }
        },
        allocatedRemainingCollection:{
            handler(val){
                val.forEach(element => {
                    this.collection.gross_amount = Number(this.collection.gross_amount) + Number(element.remaining_amount)
                });
                
            }
        },
        collection_amount:{
            handler(val){
                this.collection.collected_amount = Number(this.collection.collected_amount) + Number(val)
            }
        }
    },
    computed:{
        totalAmount(){
            let total = Number (this.selected_item.balance_amount) - Number (this.collection_amount);      
            if(total < 0){       
                this.collection.remaining_amount = Math.abs(total)  
                return 0
            } 
            return total
        },
        collection_amount(){
            return this.collection.gross_amount
        }
    },
};
</script>

<style lang="scss" scoped>

</style>