<template>
        <v-dialog v-model="showDialog" persistent max-width="30%">
            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col class="text-left">
                            Remove Discount
                        </v-col>
                        <v-col class="text-right">
                            <v-btn text @click="$emit('closeRemoveDialog',false)"><v-icon>mdi-close-circle</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>   
                <v-divider></v-divider>
                <v-card-text>
                    <v-row class="mt-2">
                        <v-col cols="12">
                            <v-autocomplete
                                v-model="selected_discount" 
                                dense 
                                outlined 
                                hide-details 
                                label="Discount Name"
                                item-value="id"
                                item-text="code"
                                :items="discount_list"> 
                            </v-autocomplete>
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
    name: 'PosLaravelVueAddPriceBracketDialog',

    data() {
        return {
            showDialog:false,
            discount:{
                name:'',
                remarks:'',
            },
            discount_list:[]
            // departments:[]
        };
    },
    props:['removeDialog'],
    mounted() {
        this.getAllDiscounts();
    },
    watch:{
        removeDialog:{
            handler(val){
                this.showDialog = val
            }
        }
    },
    methods: {
        saveItem(){
            let payload = {
                id:this.selected_discount     
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/remove-discount`,payload).then(response=>{
                Swal.fire(response.data,'','success')
                this.$emit('refreshData')
                this.$emit('closeRemoveDialog')
                this.resetFields();
                this.getAllDiscounts();
            })
        },
        resetFields(){
            Object.assign(this.$data, this.$options.data.call(this));
        },
        getAllDiscounts(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-discounts`).then(response=>{
                this.discount_list = response.data
            })
        }
    },
};
</script>

<style lang="scss" scoped>

</style>