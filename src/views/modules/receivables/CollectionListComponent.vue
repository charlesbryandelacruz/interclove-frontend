<template>
    <v-app>
        <v-row>
           
            <v-col class="text-left px-2 mt-2" cols="12">
                <v-card-title>
                    <v-row>
                        <v-col><h2>Collection List</h2></v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right" cols="2">
                            <v-text-field
                            dense
                            outlined
                            hide-details
                            v-model="search"
                            class="text-right mx-2 mb-2"
                            label="Search"
                            style="border-radius:15px"
                            >
    
                            </v-text-field>   
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-divider></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col cols="2">
                                <v-autocomplete 
                                    v-model="filter_data" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Filter" 
                                    :items="filter_selection" 
                                    > 
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="2">
                                <v-btn color="primary" @click="getAll()">
                                    Filter
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row v-if="userAccess.view">
                            <v-col cols="12">
                                <v-data-table
                                :headers="headers"
                                :items="items"
                                item-key="id"
                                show-expand
                                single-expand
                                :search="search"
                               
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
                                    :headers="collection_header"
                                    :items="item.collections"
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
                                        <v-btn fab x-small icon text color="green" @click="approvePayment(item)" v-if="userAccess.approve"><v-icon>mdi-check</v-icon></v-btn>
                                        <v-btn fab x-small icon text color="red" @click="cancelPayment(item)" v-if="userAccess.cancel"><v-icon>mdi-cancel</v-icon></v-btn>
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
import AddCustomersDialog from '../../dialog/AddCustomersDialog.vue';
import ListComponentVue from '@/views/main/ListComponent.vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment'
export default {
    name: 'PosLaravelVueProductComponent',

    data() {
        return {
            customer_selection:[],
            salesman_selection:[],
            item_selection:[],
            items:[],
            headers:[
                { text: 'Date', value: 'created_at',class:'grey lighten-2' },
                { text: 'Invoice #', value: 'invoice_num',class:'grey lighten-2' },
                { text: 'Customer', value: 'customer.company_name',class:'grey lighten-2' },
                { text: 'Salesman', value: 'salesman_text',class:'grey lighten-2' },
                { text: 'Balance Amount', value: 'balance_amount',align:'right',class:'grey lighten-2' },
                { text: 'Paid Amount', value: 'paid_amount',align:'right',class:'grey lighten-2' },
                { text: 'Total Amount', value: 'total_amount',align:'right',class:'grey lighten-2' },
                
            ],
            collection_header:[
                { text: 'Reference #', value: 'reference_num' },
                { text: 'Transaction #', value: 'cheque_num' },
                { text: 'Transaction Date', value: 'transaction_date' },
                { text: 'Amount', value: 'gross_amount',align:'right' },
                { text: 'Remaining Amount', value: 'remaining_amount',align:'right' },
                { text: 'Payment Date', value: 'payment_date' },
                { text: 'Action', value: 'action' },
            ],
            search:'',
            userAccess:{
                approve:false,
                view:false,
                cancel:false
            },
            filter_data: null,
            filter_selection:[
                {text:'All', value:null},
                {text:'With Pending Approval',value:1},
                {text:'With Balance',value:2},
                {text:'Paid',value:3}
            ]
        };
    },

    mounted() {
        this.checkAccess()
        this.getAll();
    },
    methods: {
        getAll(){
            let payload = {
                is_quotation:0,
                filter_data:this.filter_data
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-invoices`,payload).then(response=>{
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
                    data.append("collection", JSON.stringify(item));
                    data.append("method",'approved');
                    axios.post(`${process.env.VUE_APP_HOST_API}/api/save-collection`,data,config).then(response=>{
                        Swal.fire(response.data,'','success');
                        this.getAll();
                        // this.$emit('refreshData')
                        // this.$emit('closeDialog')
                        // this.resetFields();
                    })
                }
            });
        },
        checkAccess(){
            let payload = {
                side_nav_id:1,
                side_nav_link_id:3,
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
        },
        cancelPayment(item){
            Swal.fire({
                title: "",
                text: "Are you sure you want to Cancel Collection?",
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
                    data.append("colection_id",item.id);
                    axios.post(`${process.env.VUE_APP_HOST_API}/api/cancel-collection`,data,config).then(response=>{
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