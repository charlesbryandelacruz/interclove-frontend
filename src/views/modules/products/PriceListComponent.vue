<template>
    <v-app>
        <v-row>
            <v-col class="text-left" cols="3">
                <ListComponentVue :listItems="items" @selectedItem="selectItem" :listTitle="'Items'"></ListComponentVue>
            </v-col>
            <v-col class="text-left px-2 mt-2" cols="9">
                    <v-card-title>
                        <v-row>
                            <v-col>Price List</v-col>
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
                    <v-card-text>
                        <v-row>
                            <v-col cols="4">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.total_cost" 
                                    dense 
                                    outlined 
                                    hide-details
                                    type="number" 
                                    label="Total Cost"> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.min_markup" 
                                    dense 
                                    outlined 
                                    hide-details
                                    type="number" 
                                    label="Min Markup"> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.max_discount" 
                                    dense 
                                    outlined 
                                    hide-details
                                    type="number" 
                                    label="Max Disc"> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.si_price" 
                                    dense 
                                    outlined 
                                    hide-details
                                    type="number" 
                                    label="SI Price"> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.dr_price" 
                                    dense 
                                    outlined 
                                    hide-details
                                    type="number" 
                                    label="DR Price"> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.sp_price" 
                                    dense 
                                    outlined 
                                    hide-details
                                    type="number" 
                                    label="SP Price"> 
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col>
                                <v-data-table 
                                    dark
                                    dense
                                    :headers="pricingTable.headers"
                                    :items="pricingTable.items"
                                    hide-default-footer
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
            addDialog:false,
            selected_item:{
                total_cost:'',
                min_markup:'',
                max_discount:'',
                si_price:'',
                dr_price:'',
                id:0
            },
            isDisabled:true,
            pricingTable:{
                headers:[
                    { text: 'Name', value: 'item_name' },
                    { text: 'SI Price', value: 'si_price' },
                    { text: 'SI - 10%', value: 'si_price_1' },
                    { text: 'SI - 15%', value: 'si_price_2' },
                    { text: 'SI - 20%', value: 'si_price_3' },
                    { text: 'DR Price', value: 'dr_price' },
                    { text: 'DR - 10%', value: 'dr_price_1' },
                    { text: 'DR - 15%', value: 'dr_price_2' },
                    { text: 'DR - 20%', value: 'dr_price_3' },
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
            this.selected_item = item.item_prices
            let temp_arr = []
            temp_arr.push(item.item_prices)
            this.pricingTable.items = temp_arr
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
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-item`).then(response=>{
                this.items = response.data
            })
        },
        saveItem(){
            if(!this.isDisabled){
                let payload = {
                    items:this.selected_item
                }
                axios.post(`${process.env.VUE_APP_HOST_API}/api/update-pricing`,payload).then(response=>{
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