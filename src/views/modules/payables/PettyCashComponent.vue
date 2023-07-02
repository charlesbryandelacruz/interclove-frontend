<template>
    <v-app>
        <v-row>
            <v-col class="text-left" cols="3">
                <ListComponentVue :listItems="items" @selectedItem="selectItem" :listTitle="'Items'"></ListComponentVue>
            </v-col>
            <v-col class="text-left px-2 mt-2" cols="9" v-if="userAccess.view">
                <v-row>
                    <v-col class="text-left">
                        <v-btn 
                            v-if="isDisabled && userAccess.create"
                            small
                            class="mr-2" 
                            color="primary" 
                            @click="showAddEditDialogPettyCash">
                                <v-icon>mdi-plus</v-icon>
                                Add New Petty Cash
                        </v-btn>
                    </v-col>
                </v-row>
                    <v-card-title>
                        <v-row>
                            <v-col>Petty Cash Details</v-col>
                            <v-spacer></v-spacer>
                            <v-col class="text-right">
                                <v-btn 
                                    v-if="isDisabled && userAccess.create_transactions"
                                    small
                                    color="orange" 
                                    class="mr-2"
                                    @click="showAddEditDialog">
                                        <v-icon>mdi-plus</v-icon>
                                        Add Transaction
                                </v-btn>
                                <v-btn 
                                v-if="isDisabled && userAccess.create_funds"
                                
                                small
                                color="green" 
                                @click="showFundsAddEditDialog">
                                    <v-icon>mdi-plus</v-icon>
                                    Add More Funds
                                </v-btn>
                            </v-col>
                        </v-row>
        
                    </v-card-title>
                    <v-divider></v-divider>
                    
                    <v-card-text >
                        <h3 class="mt-2">Details</h3>
                        <v-divider class="mb-2"></v-divider>
                        <v-row>
                            <v-col cols="4">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.title" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Title"> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.remaining_amount" 
                                    dense 
                                    outlined 
                                    hide-details
                                    reverse
                                    label="Remaining"> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.gross_amount" 
                                    dense 
                                    outlined 
                                    hide-details
                                    reverse
                                    label="Total Amount"> 
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <h3 class="mt-4">Transactions</h3>
                    <v-divider class="mb-2"></v-divider>
                    <v-row>
                        <v-col>
                            <v-data-table 
                                dense
                                :headers="transaction.headers"
                                :items="selected_item.petty_cash_items"
                                >
                                <template v-slot:[`item.allocated_amount`]="{ item }">
                                    {{ item.allocated_amount | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.created_at`]="{ item }">
                                    {{ item.created_at | formatDate }}
                                </template>
                            </v-data-table>
                        </v-col>
                      
                    </v-row>
                    </v-card-text>
            </v-col>
        </v-row>
        <AddPettyCashItemDialog :addDialog="addDialog" @closeDialog="closeDialog()" @refreshData="getAll()" :selected_item="selected_item"></AddPettyCashItemDialog>
        <AddPettyCashDialog :addDialogPettyCash="addDialogPettyCash" @closeDialogPettyCash="closeDialogPettyCash()" @refreshData="getAll()" :selected_item="selected_item"></AddPettyCashDialog>
        <AddFundsPettyCashDialog :addFundsDialogPettyCash="addFundsDialogPettyCash" @closeFundsDialogPettyCash="closeFundsDialogPettyCash()" @refreshData="getAll()" :selected_item="selected_item"></AddFundsPettyCashDialog>
    </v-app>
  
</template>

<script>
import Swal from 'sweetalert2';
import ListComponentVue from '@/views/main/ListComponent.vue';
import axios from 'axios';
import AddPettyCashItemDialog from '@/views/dialog/AddPettyCashItemDialog.vue';
import AddPettyCashDialog from '@/views/dialog/AddPettyCashDialog.vue';
import AddFundsPettyCashDialog from '@/views/dialog/AddFundsPettyCashDialog.vue';
export default {
    name: 'PosLaravelVueProductComponent',

    data() {
        return {
            addDialog:false,
            items:[],
            selected_item:{
                title:'',
                gross_amount:0,
                remaining_amount:0,
                id:'',
                petty_cash_items:[]
            },
            isDisabled:true,
            transaction:{
                headers:[
                    { text: 'Date', value: 'created_at' },
                    { text: 'Type', value: 'expense_type_id' },
                    { text: 'Description', value: 'description' },
                    { text: 'Amount', value: 'allocated_amount' },
                ],
                items:[]
            },
            addDialogPettyCash:false,
            addFundsDialogPettyCash:false,
            userAccess:{
                create:false,
                create_funds:false,
                create_transactions:false,
                view:false
            }
        };
    },

    mounted() {
        this.checkAccess()
        this.getAll();
    },

    methods: {
        selectItem(item){
            this.selected_item = item
        },
        closeDialog(){
            this.addDialog = false
        },
        closeDialogPettyCash(){
            this.addDialogPettyCash = false
        },
        closeFundsDialogPettyCash(){
            this.addFundsDialogPettyCash = false
        },
        showAddEditDialog(){
            this.addDialog = true
        },
        showAddEditDialogPettyCash(){
            this.addDialogPettyCash = true
        },
        showFundsAddEditDialog(){
            this.addFundsDialogPettyCash = true
        },
        cancelItem(){
            Swal.fire({
            icon: 'warning',
            title: 'Are you sure you want to disable item?.',
            text: '',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
            reverseButtons:true
            })
            .then((result) => {
                if (result.isConfirmed) {
                // Retry logic goes here
                }
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
        },
        getAll(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-petty-cash`).then(response=>{
                this.items = response.data
            })
        },
        saveItem(){
            if(!this.isDisabled){
                let payload = {
                    items:this.selected_item
                }
                axios.post(`${process.env.VUE_APP_HOST_API}/api/update-item`,payload).then(response=>{
                    Swal.fire(response.data,'','success')
                    this.getAll();
                })
            }
        },
        checkAccess(){
            let payload = {
                side_nav_id:2,
                side_nav_link_id:8,
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
        AddPettyCashItemDialog,
        AddPettyCashDialog,
        ListComponentVue,
        AddFundsPettyCashDialog
    }
};
</script>

<style lang="scss" scoped>

</style>