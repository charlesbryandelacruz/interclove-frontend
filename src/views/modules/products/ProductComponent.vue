<template>
    <v-app>
        <v-row>
            <v-col class="text-left" cols="3">
                <ListComponentVue :listItems="items" @selectedItem="selectItem" :listTitle="'Items'"></ListComponentVue>
            </v-col>
            <v-col class="text-left px-2 mt-2" cols="9">
                    <v-card-title>
                        <v-row>
                            <v-col>Item Details</v-col>
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
                        <v-row>
                            <v-col cols="4">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.sku" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="SKU #"> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.name" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Item Name"> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-autocomplete   :readonly="isDisabled"  v-model="selected_item.uom" dense outlined hide-details label="UOM" :items="unit_of_measures"> </v-autocomplete>
                            </v-col>
                            <v-col cols="8">
                                <v-textarea 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.description" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Description"> 
                                </v-textarea>
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
                sku:'',
                name:'',
                uom:'',
                description:'',
                id:''
            },
            isDisabled:true,
            unit_of_measures:[
                {text:'PCS',value:'PCS'},
                {text:'M',value:'M'},
                {text:'SET',value:'SET'},
                {text:'BOX',value:'BOX'},
                {text:'KG',value:'KG'},
                {text:'ROLLS',value:'ROLLS'},
            ],
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