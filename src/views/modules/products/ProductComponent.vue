<template>
    <v-app>
        <v-row>
            <v-col class="text-left" cols="3">
                <v-card
                    class="ma-0 pa-0"
                    height="100%"
                    tile
                >
                    <v-list dense>
                        <v-subheader>ITEMS</v-subheader>
                        <v-list-item-group
                        color="primary"
                        >
                        <v-list-item
                            v-for="(item, i) in items"
                            :key="i"
                            @click="selectItem(item)"
                        >
                            <v-list-item-content>
                            <v-list-item-title v-text="item.name"></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-col>
            <v-col class="text-left" cols="9" >
                <v-card
                    height="100%"
                    class="m-auto"
                >
                    <v-card-title>
                        <v-row>
                            <v-col>Item Details</v-col>
                            <v-spacer></v-spacer>
                            <v-col class="text-right">
                                <v-btn color="primary" @click="showAddEditDialog"><v-icon>mdi-plus</v-icon>Add</v-btn>
                            </v-col>
                        </v-row>
        
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col cols="4">
                                <v-text-field v-model="selected_item.sku" dense outlined hide-details label="SKU #"> </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field v-model="selected_item.name" dense outlined hide-details label="Item Name"> </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field v-model="selected_item.uom" dense outlined hide-details label="UOM"> </v-text-field>
                            </v-col>
                            <v-col cols="8">
                                <v-textarea v-model="selected_item.description" dense outlined hide-details label="Description"> </v-textarea>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <AddProductsDialogVue :addDialog="addDialog" @closeDialog="closeDialog()" @refreshData="getAll()"></AddProductsDialogVue>
    </v-app>
  
</template>

<script>
import Swal from 'sweetalert2';
import AddProductsDialogVue from '../../dialog/AddProductsDialog.vue';
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
                description:''
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
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-item`).then(response=>{
                this.items = response.data
            })
           
        }
    },
    components:{
        AddProductsDialogVue
    }
};
</script>

<style lang="scss" scoped>

</style>