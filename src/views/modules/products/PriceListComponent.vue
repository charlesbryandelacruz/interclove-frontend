<template>
    <v-app>
        <v-row>
            <!-- <v-col class="text-left" cols="3">
                <ListComponentVue :listItems="items" @selectedItem="selectItem" :listTitle="'Items'"></ListComponentVue>
            </v-col> -->
            <v-col class="text-left px-2 mt-2" cols="12" v-if="userAccess.view">
                    <v-card-title>
                        <v-row>
                            <v-col><h2>Price List</h2></v-col>
                            <v-spacer></v-spacer>
                            <v-col class="text-right">
                                <v-btn 
                                    v-if="userAccess.edit"
                                    small
                                    class="mr-2" 
                                    color="" 
                                    @click="showPriceChange();"
                                    dark
                                >
                                    Update Price
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
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-col cols="2">
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
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <v-data-table 
                                    :headers="pricingTable.headers"
                                    :items="items"
                                    v-model="item_price_list"
                                    class="elevation-1"
                                    :search="search"
                                    
                                    >
                                    <!-- <template v-slot:[`item.si_price`]="{ item }">
                                        {{ item.si_price | currency('₱ ',2) }}
                                    </template> -->
                                    <template v-slot:body="props">
                                        <tbody>
                                         <tr v-for="item in props.items">
                                           <td v-for="(header, index) in pricingTable.headers" :class="index >= 3 ? 'text-right' : ''">
                                                <span v-if="index == 0">
                                                    <v-checkbox v-model="item.selected"></v-checkbox>
                                                </span>
                                                <span v-if="index <= 2">{{ item[header.value]}}</span>
                                                <span v-if="index == 3 | index == 4">{{ item[header.value] | currency('₱ ',2)}}</span>
                                                <span v-else>{{ item.price_b[header.value] | currency('₱ ',2)}}</span>
                                              
                                           </td>
                                         </tr>
                                        </tbody>
                                    </template>
                                </v-data-table>
                            </v-col>
                          
                        </v-row>
                    </v-card-text>
            </v-col>
            <v-dialog v-model="showPriceUpdateDialog" persistent max-width="30%" style="overflow:hidden;">
                <v-card>
                    <v-card-title>
                        <v-row>
                            <v-col class="text-left">
                                Update Price
                            </v-col>
                            <v-col class="text-right">
                                <v-btn text @click="showPriceUpdateDialog = false"><v-icon>mdi-close-circle</v-icon></v-btn>
                            </v-col>
                        </v-row>
                    </v-card-title>   
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <v-text-field
                                dense
                                outlined
                                hide-details
                                class="mt-2"
                                label="New DR Price"
                                v-model="new_price"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-divider class="mt-2"></v-divider>              
                        <v-row class="mt-2"> 
                            <v-col class="text-right">
                                <!-- <v-btn small color="secondary" @click="$emit('closeDialog',false)" class="mr-2">Cancel</v-btn> -->
                                <v-btn small color="primary" @click="saveUpdatedPrice()">Submit</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    
                </v-card>
            </v-dialog>
        </v-row>
        <AddPriceBracketDialogVue :addDialog="addDialog" @closeDialog="closeDialog()" @refreshData="getAll()"></AddPriceBracketDialogVue>
    </v-app>
  
</template>

<script>
import Swal from 'sweetalert2';
import AddPriceBracketDialogVue from '../../dialog/AddPriceBracketDialog.vue';
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
                    { text: '', value: '',class:'grey lighten-2'},
                    { text: 'Name', value: 'name',class:'grey lighten-2' },
                    { text: 'Current Stocks', value: 'current_stock',class:'grey lighten-2' },
                    { text: 'Purchase Price', value: 'total_cost',align:'right',class:'grey lighten-2' },
                    { text: 'DR Price', value: 'dr_price',align:'right',class:'grey lighten-2' },
                ],
                items:[]
            },
            item_price_list:[],
            test:0,
            showPriceUpdateDialog:false,
            new_price:0,
            search:'',
            userAccess:{
                create:false,
                edit:false,
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
            this.items = [];
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-item`).then(response=>{
                this.items = response.data
                this.items.forEach(e=>{
                    Object.assign(e,{selected:false})
                })
                for (const prop in this.items[0].price_b){
                    this.pricingTable.headers.push(
                        { text: prop, value: prop, align:'right',class:'grey lighten-2'},
                    )
                }
            })
        },
        showPriceChange(){
            this.showPriceUpdateDialog = true
        },
        saveUpdatedPrice(){
            let a = this.items.filter(e=>{
                if (e.selected){
                    return e.id
                }
            })
            let payload = {
                item_ids:a.map(e=>{return e.id}),
                new_price:this.new_price
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/update-pricing`,payload).then(response=>{
                Swal.fire(response.data,'','success')
                this.showPriceUpdateDialog = false
                this.getAll();
            })
        },
        checkAccess(){
            let payload = {
                side_nav_id:3,
                side_nav_link_id:10,
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
        AddPriceBracketDialogVue,
        ListComponentVue
    },
    computed:{
    },
};
</script>

<style>
</style>