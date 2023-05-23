<template>
    <v-app>
        <v-row>
           
            <v-col class="text-left px-2 mt-2" cols="12">
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-data-table
                                :headers="headers"
                                :items="items"
                                item-key="id"
                                show-expand
                                single-expand
                                dense
                            >
                            <template v-slot:[`item.balance_amount`]="{ item }">
                                {{ item.balance_amount | currency('₱ ',2) }}
                            </template>
                            <template v-slot:[`item.paid_amount`]="{ item }">
                                {{ item.paid_amount | currency('₱ ',2) }}
                            </template>
                            <template v-slot:[`item.total_amount`]="{ item }">
                                {{ item.total_amount | currency('₱ ',2) }}
                            </template>
                            <template v-slot:[`item.created_at`]="{ item }">
                                {{ item.created_at | formatDate }}
                            </template>
                            <template v-slot:expanded-item="{ headers, item }">
                                <td :colspan="headers.length">
                                    <v-data-table
                                    :headers="payment_header"
                                    :items="item.payments"
                                    :items-per-page="10"
                                    class="w-100"
                                    dense
                                    >
                                    <template v-slot:[`item.gross_amount`]="{ item }">
                                        {{ item.gross_amount | currency('₱ ',2) }}
                                    </template>
                                    <template v-slot:[`item.remaining_amount`]="{ item }">
                                        {{ item.remaining_amount | currency('₱ ',2) }}
                                    </template>
                                    <template v-slot:[`item.action`]="{ item }">
                                        <span v-if="item.remaining_amount != 0">
                                        <v-btn fab x-small icon text color="green" @click="approvePayment(item)"><v-icon>mdi-check</v-icon></v-btn>
                                        <v-btn fab x-small icon text color="red" @click="cancelPayment(item)"><v-icon>mdi-cancel</v-icon></v-btn>
                                        </span>
                                    </template>
                                    </v-data-table>
                                </td>
                            </template>

                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
            </v-col>
        </v-row>
    </v-app>
</template>

<script>
import AddSuppliersDialog from '../../dialog/AddSuppliersDialog.vue';
import ListComponentVue from '@/views/main/ListComponent.vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment'
export default {
    name: 'PosLaravelVueProductComponent',

    data() {
        return {
            supplier_selection:[],
            salesman_selection:[],
            item_selection:[],
            items:[],
            headers:[
                { text: 'Date', value: 'created_at' },
                { text: 'Purchase #', value: 'purchase_num' },
                { text: 'Supplier', value: 'supplier.supplier_name' },
                // { text: 'Salesman', value: 'salesman_text' },
                { text: 'Balance Amount', value: 'balance_amount',align:'right' },
                { text: 'Paid Amount', value: 'paid_amount',align:'right' },
                { text: 'Total Amount', value: 'total_amount',align:'right' },
                
            ],
            payment_header:[
                { text: 'Reference #', value: 'reference_num' },
                { text: 'Transaction #', value: 'cheque_num' },
                { text: 'Transaction Date', value: 'transaction_date' },
                { text: 'Amount', value: 'gross_amount',align:'right' },
                { text: 'Remaining Amount', value: 'remaining_amount',align:'right' },
                { text: 'Payment Date', value: 'payment_date' },
                { text: 'Action', value: 'action' },
            ],
        };
    },

    mounted() {
        this.getAll();
    },
    methods: {
        getAll(){
            let payload = {
                is_quotation:0
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-purchases`,payload).then(response=>{
                this.items = response.data
            })
        },
        approvePayment(item){
            Swal.fire({
                title: "",
                text: "Are you sure you want to Approve Payment?",
                icon: "warning",
                showConfirmButton: true,
                showCancelButton: true,
                reverseButtons: true,
                allowOutsideClick: false,
                confirmButtonColor: '#397373',
                cancelButtonColor: 'grey',
                confirmButtonText: 'Confirm',
                showCloseButton: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const data = new FormData();
                    const config = {
                        headers: {
                            "content-type": "multipart/form-data",
                        },
                    };  
                    data.append("payment", JSON.stringify(item));
                    data.append("method",'approved');
                    axios.post(`${process.env.VUE_APP_HOST_API}/api/save-payment`,data,config).then(response=>{
                        Swal.fire(response.data,'','success');
                        this.getAll();
                        // this.$emit('refreshData')
                        // this.$emit('closeDialog')
                        // this.resetFields();
                    })
                }
            });
        }
    },  
    components:{
      
    },
};
</script>

<style lang="scss" scoped>

</style>