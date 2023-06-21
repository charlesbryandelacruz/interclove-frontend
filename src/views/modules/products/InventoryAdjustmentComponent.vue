<template>
    <v-app>
        <v-row>
            <v-col class="text-left" cols="3">
                <ListComponentVue :listItems="items" @selectedItem="selectItem" :listTitle="'Items'"></ListComponentVue>
            </v-col>
            <v-col class="text-left px-2 mt-2" cols="9" v-if="userAccess.view">
                    <v-card-title>
                        <v-row>
                            <v-col>Inventory Adjustment</v-col>
                            <v-spacer></v-spacer>
                        </v-row>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <v-row>
                            <v-col cols="3">
                                <v-text-field 
                                    readonly 
                                    v-model="selected_item.current_stock" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Current Stocks"
                                    reverse> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field 
                                    reverse
                                    v-model="new_stock" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Adjust Stock"> 
                                </v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field 
                                    v-model="remarks" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Remarks"
                                    reverse> 
                                </v-text-field>
                            </v-col>
                            <v-col>
                                <v-btn 
                                    v-if="userAccess.add_stocks"
                                    small
                                    class="mr-2" 
                                    color="primary" 
                                    @click="confirmAdjustment('ADD'); isDisabled = !isDisabled"
                                >
                                    {{ 'Add'}}
                                </v-btn>
                                <v-btn 
                                    v-if="userAccess.subtract_stocks"
                                    type="number"
                                    dark
                                    small
                                    class="mr-2" 
                                    color="red" 
                                    @click="confirmAdjustment('SUBTRACT'); isDisabled = !isDisabled"
                                >
                                    {{ 'Sub'}}
                                </v-btn>
                            </v-col>
                        </v-row>
                        <h3 class="mt-4">Item Movement</h3>
                    <v-divider class="mb-2"></v-divider>
                    <v-row>
                        <v-col>
                            <v-data-table 
                                dense
                                :headers="headers"
                                :items="selected_item.adjustment_history"
                                >
                                <template v-slot:[`item.created_at`]="{ item }">
                                    {{ item.created_at | formatDate }}
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
import Swal from 'sweetalert2';
import AddProductsDialogVue from '../../dialog/AddProductsDialog.vue';
import ListComponentVue from '@/views/main/ListComponent.vue';
import ShareFunctionsComponent from '@/views/main/ShareFunctionsComponent.vue';
import axios from 'axios';
export default {
    name: 'PosLaravelVueProductComponent',
    mixins:[ShareFunctionsComponent],
    data() {
        return {
            addDialog:false,
            items:[],
            addDialog:false,
            selected_item:{
                sku:'',
                name:'',
                uom:'',
                description:'',
                id:'',
                item_prices:[],
                current_stock:0,
                remarks:''
            },
            headers:[
                { text: 'Date', value: 'created_at',class:'grey lighten-2' },
                { text: 'Prev. Qty #', value: 'from_quantity',class:'grey lighten-2' },
                { text: 'Method', value: 'method',class:'grey lighten-2' },
                { text: 'Quantity', value: 'quantity',class:'grey lighten-2' },
                { text: 'Remarks', value: 'remarks',class:'grey lighten-2' },
            ],
            isDisabled:true,
            new_stock:0,
            userAccess:{
                add_stocks:false,
                subtract_stocks:false,
                view:false
            },
            remarks:''
        };
    },

    mounted() {
        this.checkAccess()
        this.getAll();
    },

    methods: {
        selectItem(item){
            this.selected_item = item
            this.selected_item.item_prices.total_cost = this.thousandSeprator(this.selected_item.item_prices.total_cost)
        },
        // closeDialog(){
        //     this.addDialog = false
        // },
        // showAddEditDialog(){
        //     this.addDialog = true
        // },
        confirmAdjustment(method){
            Swal.fire({
            icon: 'warning',
            title: `Are you sure you want ${method} stock?.`,
            text: '',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
            reverseButtons:true
            })
            .then((result) => {
                if (result.isConfirmed) {
                    let payload = {
                        new_stock:this.new_stock,
                        method:method,
                        id:this.selected_item.id,
                        remarks:this.remarks
                    }
                    axios.post(`${process.env.VUE_APP_HOST_API}/api/update-stock`,payload).then(response=>{
                        Swal.fire(response.data,'','success')
                        this.getAll();
                    })
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
                axios.post(`${process.env.VUE_APP_HOST_API}/api/update-item`,payload).then(response=>{
                    Swal.fire(response.data,'','success')
                    this.$emit('refreshData')
                    this.getAll();
                })
            }
        },
        checkAccess(){
            let payload = {
                side_nav_id:3,
                side_nav_link_id:11,
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
        AddProductsDialogVue,
        ListComponentVue
    }
};
</script>

<style lang="scss" scoped>

</style>