<template>
    <v-app>
        <v-row>
            <v-col class="text-left" cols="3">
                <ListComponentVue :listItems="items" @selectedItem="selectItem" :listTitle="'Items'"></ListComponentVue>
            </v-col>
            <v-col class="text-left px-2 mt-2" cols="9">
                    <v-card-title>
                        <v-row>
                            <v-col>Petty Cash Details</v-col>
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
                                    small
                                    class="mr-2" 
                                    :color="!!isDisabled ? 'secondary' : 'green'" 
                                    @click="saveItem(); isDisabled = !isDisabled"
                                >
                                    {{ !!isDisabled ? 'Edit' : 'Save'}}
                                </v-btn>
                               
                                <v-btn 
                                    v-if="isDisabled"
                                    small
                                    color="primary" 
                                    @click="showAddEditDialog">
                                        <v-icon>mdi-plus</v-icon>
                                        Add
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
                                :items="transaction.items"
                                >
                                <template v-slot:[`item.si_price`]="{ item }">
                                    {{ item.si_price | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.si_price_1`]="{ item }">
                                    {{ item.si_price - (item.si_price * .10) | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.si_price_2`]="{ item }">
                                    {{( item.si_price - item.si_price * .15) | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.si_price_3`]="{ item }">
                                    {{ item.si_price - (item.si_price * .20) | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.dr_price`]="{ item }">
                                    {{ item.dr_price | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.dr_price_1`]="{ item }">
                                    {{ item.dr_price - (item.dr_price * .10) | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.dr_price_2`]="{ item }">
                                    {{( item.dr_price - item.dr_price * .15) | currency('₱ ',2) }}
                                </template>
                                <template v-slot:[`item.dr_price_3`]="{ item }">
                                    {{ item.dr_price - (item.dr_price * .20) | currency('₱ ',2) }}
                                </template>
                            </v-data-table>
                        </v-col>
                      
                    </v-row>
                    </v-card-text>
            </v-col>
        </v-row>
        <AddProductsDialogVue :addDialog="addDialog" @closeDialog="closeDialog()" @refreshData="getAll()"></AddProductsDialogVue>
    </v-app>
  
</template>

<script>
import Swal from 'sweetalert2';
import AddProductsDialogVue from '../../dialog/AddProductsDialog.vue';
import ListComponentVue from '@/views/main/ListComponent.vue';
import axios from 'axios';
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
                id:''
            },
            isDisabled:true,
            transaction:{
                headers:[
                    { text: 'Date', value: 'created_at' },
                    { text: 'Type', value: 'expense_type_by_name' },
                    { text: 'Description', value: 'description' },
                    { text: 'Amount', value: 'allocated_amount' },
                ],
                items:[]
            }
        };
    },

    mounted() {
        this.getAll();
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
        }
    },
    components:{
        AddProductsDialogVue,
        ListComponentVue
    }
};
</script>

<style lang="scss" scoped>

</style>