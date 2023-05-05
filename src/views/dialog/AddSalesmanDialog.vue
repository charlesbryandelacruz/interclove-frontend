<template>
        <v-dialog v-model="showDialog" persistent max-width="50%">
            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col class="text-left">
                            Add Salesman
                        </v-col>
                        <v-col class="text-right">
                            <v-btn text @click="$emit('closeDialog',false)"><v-icon>mdi-close-circle</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>   
                <v-divider></v-divider>
                <v-card-text>
                    <v-row class="mt-2">
                        <v-col cols="6">
                            <v-text-field 
                                :readonly="isDisabled" 
                                v-model="salesman.name" 
                                dense 
                                outlined 
                                hide-details 
                                label="Name"> 
                            </v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field 
                                :readonly="isDisabled" 
                                v-model="salesman.remarks" 
                                dense 
                                outlined 
                                hide-details 
                                label="Remarks"> 
                            </v-text-field>
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
    name: 'PosLaravelVueAddSalesmanDialog',

    data() {
        return {
            showDialog:false,
            salesman:{
                name:'',
                remarks:'',
            },
            departments:[]
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
                salesman:this.salesman      
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/save-salesman`,payload).then(response=>{
                Swal.fire(response.data,'','success')
                this.$emit('refreshData')
                this.$emit('closeDialog')
                this.resetFields();
            })
        },
        resetFields(){
            Object.assign(this.$data, this.$options.data.call(this));
        }
    },
};
</script>

<style lang="scss" scoped>

</style>