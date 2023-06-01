<template>
    <v-app>
        <v-row>
            <!-- <v-col class="text-left" cols="3">
                <ListComponentVue :listItems="items" @selectedItem="selectItem" :listTitle="'Items'"></ListComponentVue>
            </v-col> -->
            <v-col class="text-left px-2 mt-2" cols="12">
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
                            <v-col>
                                <v-data-table 
                                    :headers="pricingTable.headers"
                                    :items="items"
                                    >
                                    <!-- <template v-slot:[`item.si_price`]="{ item }">
                                        {{ item.si_price | currency('₱ ',2) }}
                                    </template> -->
                                    <template v-slot:body="props">
                                        <tbody>
                                         <tr v-for="item in props.items">
                                           <td v-for="(header, index) in pricingTable.headers" :class="index >= 2 ? 'text-right' : ''">
                                                <span v-if="index <= 1">{{ item[header.value]}}</span>
                                                <span v-if="index == 2 | index == 3">{{ item[header.value] | currency('₱ ',2)}}</span>
                                                <span v-else>{{ item.price_b[header.value] | currency('₱ ',2)}}</span>
                                                <!-- {{ header }} -->

                                           </td>
                                         </tr>
                                        </tbody>
                                       </template>
                                </v-data-table>
                            </v-col>
                          
                        </v-row>
                    </v-card-text>
            </v-col>
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
                    { text: 'Name', value: 'name' },
                    { text: 'Current Stocks', value: 'current_stock' },
                    { text: 'Purchase Price', value: 'total_cost',align:'right' },
                    { text: 'DR Price', value: 'dr_price',align:'right' },
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

                for (const prop in this.items[0].price_b){
                    this.pricingTable.headers.push(
                        { text: prop, value: prop, align:'right'},
                    )
                }
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
        AddPriceBracketDialogVue,
        ListComponentVue
    }
};
</script>

<style lang="scss" scoped>

</style>