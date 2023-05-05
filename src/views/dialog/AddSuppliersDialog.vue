<template>
    <v-dialog v-model="showDialog" persistent max-width="50%">
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col class="text-left">
                        Add New Supplier
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
                                <v-text-field    v-model="suppliers.supplier_name" dense outlined hide-details label="Supplier Name"> </v-text-field>
                            </v-col>
                            <v-col cols="8">
                                <v-text-field    v-model="suppliers.address" dense outlined hide-details label="Address"> </v-text-field>
                            </v-col>
                        </v-row>
                        <h3 class="mt-4">Products  
                            <v-btn  icon small color="red" @click="removeLine('p')"><v-icon>mdi-minus</v-icon></v-btn> 
                            <v-btn  icon small color="primary" @click="addLine('p')"><v-icon>mdi-plus</v-icon></v-btn> 
                        </h3>  
                        <v-divider class="mb-2"></v-divider>
                        <v-row>
                            <v-col class="text-center">
                                <h3>Product</h3>
                            </v-col>
                            <v-col class="text-center" >
                                <h3>Payment Type</h3>
                            </v-col>
                            <v-col class="text-center" >
                                <h3>Terms</h3>
                            </v-col>
                        </v-row>
                        <v-row v-for="(supplier,i) in suppliers.supplier_products" :key="i" class="ma-1 pa-0">
                            <v-col class="pa-0 ma-0">
                                <v-autocomplete 
                                    v-model="supplier.product_id" 
                                    class="px-1"
                                    dense 
                                    outlined 
                                    hide-details 
                                    placeholder="Product" 
                                    item-text="name"
                                    item-value="id"
                                    :items="product_selection"
                                > 
                                </v-autocomplete>
                            </v-col>
                            <v-col class="pa-0 ma-0">
                                <v-autocomplete
                                    v-model="supplier.payment_type_id" 
                                    class="px-1"
                                    dense 
                                    outlined 
                                    hide-details 
                                    placeholder="Payment Type" 
                                    item-text="name"
                                    item-value="id"
                                    :items="payment_type_selection"
                                    > 
                                </v-autocomplete>
                            </v-col>
                            <v-col class="pa-0 ma-0">
                                <v-text-field  class="px-1"  v-model="supplier.terms" dense outlined hide-details placeholder="Terms"> </v-text-field>
                            </v-col>
                        </v-row> 
                        <h3 class="mt-4">Contacts  
                            <v-btn  icon small color="red" @click="removeLine('c')"><v-icon>mdi-minus</v-icon></v-btn> 
                            <v-btn  icon small color="primary" @click="addLine('c')"><v-icon>mdi-plus</v-icon></v-btn> 
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
                        <v-row v-for="(supplier,i) in suppliers.contacts" :key="i" class="ma-1 pa-0">
                            <v-col class="pa-0 ma-0">
                                <v-text-field class="px-1"  placeholder="Name" v-model="supplier.contact_person" dense outlined hide-details> </v-text-field>
                            </v-col>
                            <v-col class="pa-0 ma-0">
                                <v-text-field class="px-1"  placeholder="Position" v-model="supplier.contact_position" dense outlined hide-details> </v-text-field>
                            </v-col>
                            <v-col class="pa-0 ma-0">
                                <v-text-field class="px-1"  placeholder="Contact" v-model="supplier.contact_number" dense outlined hide-details> </v-text-field>
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
        suppliers:{
            supplier_name:'',
            address:'',
            contacts:[
                {
                    contact_person: '',
                    contact_position:'',
                    contact_number:'',
                }
            ],
            supplier_products:[
                {
                    product_id:0,
                    payment_type_id:0,
                    terms:'',
                }
            ],
        },
    };
},
props:['addDialog','payment_type_selection','product_selection'],
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
            suppliers:this.suppliers 
        }
        axios.post(`${process.env.VUE_APP_HOST_API}/api/save-supplier`,payload).then(response=>{
            Swal.fire(response.data,'','success')
            this.$emit('refreshData')
            this.$emit('closeDialog')
            this.resetFields()
        })
    },
    addLine(type){
        if(type == 'c'){
            this.suppliers.contacts.push({
                contact_person:'',
                contact_position:'',
                contact_number:'',
            })
        }
        else if(type == 'p'){
            this.suppliers.supplier_products.push({
                product_id:0,
                payment_type_id:0,
                terms:'',
            })
        }
    },
    removeLine(type){
        if(type == 'c') this.suppliers.contacts.pop()
        else if(type == 'p') this.suppliers.supplier_products.pop()
        
    },
    resetFields(){
        Object.assign(this.$data, this.$options.data.call(this));
    }

},
};
</script>

<style lang="scss" scoped>

</style>