<template>
    <v-dialog v-model="showDialog" persistent max-width="50%">
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col class="text-left">
                        Add New Customer
                    </v-col>
                    <v-col class="text-right">
                        <v-btn icon text @click="$emit('closeDialog',false)"><v-icon>mdi-close-circle</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>   
            <v-divider></v-divider>
            <v-card-text>
                <h3 class="mt-2">Details</h3>
                <v-divider class="mb-2"></v-divider>
                <v-row>
                    <v-col cols="4">
                        <v-text-field v-model="customers.company_name" dense outlined hide-details label="Company Name"> </v-text-field>
                    </v-col>
                    <v-col cols="8">
                        <v-text-field v-model="customers.address" dense outlined hide-details label="Address"> </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-autocomplete 
                            v-model="customers.pricing_id" 
                            dense 
                            outlined 
                            hide-details 
                            label="Pricing" 
                            item-text="code"
                            item-value="id"
                            :items="pricing_selection"
                        > 
                    </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                        <v-autocomplete
                            v-model="customers.payment_type_id" 
                            dense 
                            outlined 
                            hide-details 
                            label="Payment Type" 
                            item-text="name"
                            item-value="id"
                            :items="payment_type_selection"
                            > 
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="customers.terms" dense outlined hide-details label="Terms"> </v-text-field>
                    </v-col>
                </v-row>
                
                <h3 class="mt-4">Contacts  
                    <v-btn icon small color="red" @click="removeLine()"><v-icon>mdi-minus</v-icon></v-btn> 
                    <v-btn icon small color="primary" @click="addLine()"><v-icon>mdi-plus</v-icon></v-btn> 
                </h3>   
                <v-divider class="mb-2"></v-divider>
                <v-row>
                    <v-col class="text-center">
                        <h3>Name</h3>
                    </v-col>
                    <v-col class="text-center" >
                        <h3>Position</h3>
                    </v-col>
                    <v-col class="text-center" >
                        <h3>Contact</h3>
                    </v-col>
                </v-row>
                <v-row v-for="(customer,i) in customers.contacts" :key="i" class="ma-1 pa-0">
                    <v-col class="pa-0 ma-0">
                        <v-text-field class="px-1" v-model="customer.contact_person" dense outlined hide-details> </v-text-field>
                    </v-col>
                    <v-col class="pa-0 ma-0">
                        <v-text-field class="px-1" v-model="customer.contact_position" dense outlined hide-details> </v-text-field>
                    </v-col>
                    <v-col class="pa-0 ma-0">
                        <v-text-field class="px-1" v-model="customer.contact_number" dense outlined hide-details> </v-text-field>
                    </v-col>
                </v-row> 
                <v-divider class="mt-2"></v-divider>             
                <v-row class="mt-2"> 
                    <v-col class="text-right">
                        <v-btn small color="secondary" @click="$emit('closeDialog',false)" class="mr-2">Cancel</v-btn>
                        <v-btn small color="primary" @click="saveCustomer()">Submit</v-btn>
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
        customers:{
            company_name:'',
            address:'',
            pricing_id:0,
            terms:'',
            payment_type_id:0,
            contacts:[
                {
                    contact_person: '',
                    contact_position:'',
                    contact_number:'',
                }
            ]
        },
    };
},
props:['addDialog','payment_type_selection','pricing_selection'],
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
    saveCustomer(){
        let payload = {
            customers:this.customers 
        }
        axios.post(`${process.env.VUE_APP_HOST_API}/api/save-customer`,payload).then(response=>{
            Swal.fire(response.data,'','success')
            this.$emit('refreshData')
            this.$emit('closeDialog')
            this.resetFields();
        })
    },
    addLine(){
        this.customers.contacts.push({
            contact_person:'',
            contact_position:'',
            contact_number:'',
        })
    },
    removeLine(){
        this.customers.contacts.pop()
    },
    resetFields(){
        Object.assign(this.$data, this.$options.data.call(this));
    }

},
};
</script>

<style lang="scss" scoped>

</style>