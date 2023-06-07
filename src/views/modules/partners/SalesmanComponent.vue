<template>
    <v-app>
        <v-row>
            <v-col class="text-left" cols="3">
                <ListComponentVue :listItems="items" @selectedItem="selectItem" :listTitle="'Salesman'"></ListComponentVue>
            </v-col>
            <v-col class="text-left px-2 mt-2" cols="9" v-if="userAccess.view">
                    <v-card-title>
                        <v-row>
                            <v-col>Salesman Details</v-col>
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
                                    @click="saveItem(); isDisabled = !isDisabled"
                                >
                                    {{ !!isDisabled ? 'Edit' : 'Save'}}
                                </v-btn>
                            
                                <v-btn 
                                    v-if="isDisabled && userAccess.create"
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
                            <v-col cols="6">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.name" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Name"> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.remarks" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Remarks"> 
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <h3 class="mt-4">Transactions</h3>
                    <v-divider class="mb-2"></v-divider>
                    <v-row>
                        <v-col>
                            <v-data-table 
                                dense
                                :headers="pricingTable.headers"
                                :items="selected_item.salesman_transactions"
                                >
                                
                                <template v-slot:[`item.total_amount`]="{ item }">
                                    {{ item.total_amount | currency('₱ ',2) }}
                                </template>
                            </v-data-table>
                        </v-col>
                      
                    </v-row>
                    </v-card-text>
            </v-col>
        </v-row>
        <AddSalesmanDialog :addDialog="addDialog" @closeDialog="closeDialog()" @refreshData="getAll()"></AddSalesmanDialog>
    </v-app>
  
</template>

<script>
import Swal from 'sweetalert2';
import AddSalesmanDialog from '@/views/dialog/AddSalesmanDialog.vue';
import ListComponentVue from '@/views/main/ListComponent.vue';
import axios from 'axios';
export default {
    name: 'PosLaravelVueProductComponent',

    data() {
        return {
            items:[],
            addDialog:false,
            selected_item:{
                name:'',
                remarks:'',
                id:'',
                salesman_transactions:[]
            },
            isDisabled:true,
            pricingTable:{
                headers:[
                    { text: 'Date', value: 'invoice_date' },
                    { text: 'Type', value: 'invoice_date' },
                    { text: 'Customer/Supplier', value: 'customer.company_name' },
                    { text: 'Invoice Number', value: 'invoice_num' },
                    { text: 'Total Amount', value: 'total_amount', align:'right'},
                ],
                items:[]
            },
            userAccess:{
                create: false,
                edit:false,
                view:false
            }
        };
    },

    mounted() {
        this.checkAccess();
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
        getAll(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-salesmans`).then(response=>{
                this.items = response.data
            })
        },
        saveItem(){
            if(!this.isDisabled){
                let payload = {
                    salesman:this.selected_item
                }
                axios.post(`${process.env.VUE_APP_HOST_API}/api/update-salesman`,payload).then(response=>{
                    Swal.fire(response.data,'','success')
                    this.getAll();
                })
            }
        },
        checkAccess(){
            let payload = {
                side_nav_id:4,
                side_nav_link_id:14,
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
        AddSalesmanDialog,
        ListComponentVue
    }
};
</script>

<style lang="scss" scoped>

</style>