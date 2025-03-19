<template>
        <v-dialog v-model="showDialog" persistent max-width="50%">
            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col class="text-left">
                            Add New Product
                        </v-col>
                        <v-col class="text-right">
                            <v-btn text @click="$emit('closeDialog',false)"><v-icon>mdi-close-circle</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>   
                <v-divider></v-divider>
                <v-card-text>
                    <v-row class="mt-2">
                        <v-col cols="4">
                            <v-text-field v-model="items.sku" dense outlined hide-details label="SKU #"> </v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="items.name" dense outlined hide-details label="Item Name"> </v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-autocomplete v-model="items.uom" dense outlined hide-details label="UOM" :items="unit_of_measures"> </v-autocomplete>
                        </v-col>
                        <v-col cols="8">
                            <v-textarea v-model="items.description" dense outlined hide-details label="Description"> </v-textarea>
                        </v-col>
                    </v-row>
                    <v-divider class="mt-2"></v-divider>              
                    <v-row class="mt-2"> 
                        <v-col class="text-right">
                            <v-btn small color="secondary" @click="$emit('closeDialog',false)" class="mr-2">Cancel</v-btn>
                            <v-btn small color="primary" @click="saveItem()">Submit</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>   
               
          
            </v-card>
        </v-dialog>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'
export default {
    name: 'PosLaravelVueAddProductsDialog',

    data() {
        return {
            showDialog:false,
            unit_of_measures:[
                {text:'PCS',value:'PCS'},
                {text:'M',value:'M'},
                {text:'SET',value:'SET'},
                {text:'BOX',value:'BOX'},
                {text:'KG',value:'KG'},
                {text:'ROLLS',value:'ROLLS'},
            ],
            items:{
                sku:'',
                name:'',
                uom:'',
                description:''
            }
        };
    },
    props:['addDialog'],
    mounted() {

    },
    watch:{
        addDialog:{
            handler(val){
                this.showDialog = val
            }
        }
    },
    methods: {
        saveItem(){
            let payload = {
                items:this.items      
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/save-item`,payload).then(response=>{
                Swal.fire(response.data,'','success')
                this.$emit('refreshData')
                this.$emit('closeDialog')
            })
        }
    },
};
</script>

<style lang="scss" scoped>

</style>