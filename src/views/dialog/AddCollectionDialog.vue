<template>
    <v-dialog v-model="showDialog" persistent max-width="50%">
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col class="text-left">
                        Add New Collection
                    </v-col>
                    <v-col class="text-right">
                        <v-btn text @click="$emit('closeDialog',false)"><v-icon>mdi-close-circle</v-icon></v-btn>
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
                            >  
                        </v-text-field>
                    </v-col>
                </v-row>
                <h3 class="mt-2">Payment Detail</h3>
                <v-row class="mt-2">
                    <v-col cols="4">
                        <v-autocomplete 
                            v-model="collection.payment_type_id"
                            label="Payment Method"
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
                            :disabled="collection.payment_type_id != 1"
                            :background-color="collection.payment_type_id != 1 ? 'grey' : 'white' "
                            label="Cheque Number"
                            outlined
                            dense
                            >  
                        </v-text-field>
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
                </v-row>
                <v-row class="mt-5">
                    <v-spacer></v-spacer>
                    <v-col class="text-right">
                        <h3>Gross Amount: {{selected_item.total_amount | currency('₱ ',2) }}</h3>
                        <h3>Balance Amount: {{selected_item.balance_amount | currency('₱ ',2) }}</h3>
                        <h3>Paid Amount: {{selected_item.paid_amount | currency('₱ ',2) }}</h3> 
                        <br/>
                        <h3>Payment: {{collection.gross_amount | currency('₱ ',2) }}</h3>
                        <h3>(Balance less Payment) : {{totalAmount | currency('₱ ',2)}}</h3>
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
                
            },
            showDialog:false,
            display_total_amount:'',
            payment_type_selection:[]
        };
    },

    mounted() {
        this.getAllPaymentTypes();
        // this.getAllCustomers()
        // this.getAllItems()
    },
    // computed:{
    //     totalAmount(){
    //         return _.sumBy(this.invoice.invoice_items, 'total_price');
    //     }
    // },
    methods: {
        formatPrice(value) {
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'PHP',
                minimumFractionDigits: 2
            });
            return formatter.format(value);
        },
        getAllPaymentTypes(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-payment-types`).then(response=>{
                this.payment_type_selection = response.data
            })
        },
        saveCollection(){
            let payload = {
                collection:this.collection
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/save-collection`,payload).then(response=>{
                Swal.fire(response.data,'','success');
                this.$emit('refreshData')
                this.$emit('closeDialog')
            })
        },
    },
    props:['addDialog','selected_item'],
    watch:{
        addDialog:{
            handler(val){
                this.showDialog = val
                this.display_total_amount = this.formatPrice(this.selected_item.total_amount)
                this.collection.invoice_id = this.selected_item.id
                
            }
        },
        selected_item:{
            handler(val){
                
            }
        }
    },
    computed:{
        totalAmount(){
            let total = Number (this.selected_item.balance_amount) - Number (this.collection.gross_amount); 
            return total
        }
    },
};
</script>

<style lang="scss" scoped>

</style>