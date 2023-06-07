<template>
    <v-app>
        <v-row>
            <v-col class="text-left" cols="3">
                <ListComponentVue :listItems="items" @selectedItem="selectItem" :listTitle="'Items'"></ListComponentVue>
            </v-col>
            <v-col class="text-left px-2 mt-2" cols="9">
                    <v-card-title>
                        <v-row>
                            <v-col>User Details</v-col>
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
                                    class="mr-2"
                                    color="primary" 
                                    @click="showAddEditDialog">
                                        <v-icon>mdi-plus</v-icon>
                                        Add
                                </v-btn>
                                <v-btn 
                                    v-if="isDisabled"
                                    small
                                    color="primary" 
                                    @click="showAddEditRoleDialog">
                                        <v-icon>mdi-plus</v-icon>
                                        Add Role
                                </v-btn>
                            </v-col>
                        </v-row>
        
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <v-row>
                            <v-col cols="6">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.name" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Name"> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.email" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Email"> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.position" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Position"> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-autocomplete    
                                    item-text="name"
                                    item-value="id" 
                                    :readonly="isDisabled"  
                                    v-model="selected_item.department_id"
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Department" 
                                    :items="departments">
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-card-text>
            </v-col>
        </v-row>
        <AddUserDialogVue :addDialog="addDialog" @closeDialog="closeDialog()" @refreshData="getAll()"></AddUserDialogVue>
        <AddUserRoleDialogVue :addRoleDialog="addRoleDialog" @closeRoleDialog="closeRoleDialog()" @refreshData="getAll()" :selected_item="selected_item"></AddUserRoleDialogVue>
    </v-app>
  
</template>

<script>
import Swal from 'sweetalert2';
import AddUserDialogVue from '../../dialog/AddUserDialog.vue';
import AddUserRoleDialogVue from '../../dialog/AddUserRoleDialog.vue';
import ListComponentVue from '@/views/main/ListComponent.vue';
import axios from 'axios';
export default {
    name: 'PosLaravelVueProductComponent',

    data() {
        return {
            addRoleDialog:false,
            addDialog:false,
            items:[],
            addDialog:false,
            selected_item:{
                name:'',
                email:'',
                position:'',
                department_id:0,
                id:''
            },
            isDisabled:true,
            departments:[],
        };
    },

    mounted() {
        this.getAll();
        this.getAllDepartments();
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
        showAddEditRoleDialog(){
            this.addRoleDialog = true
        },
        closeRoleDialog(){
            this.addRoleDialog = false
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
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-users`).then(response=>{
                this.items = response.data
            })
        },
        saveItem(){
            if(!this.isDisabled){
                let payload = {
                    items:this.selected_item
                }
                axios.post(`${process.env.VUE_APP_HOST_API}/api/update-user`,payload).then(response=>{
                    Swal.fire(response.data,'','success')
                    this.getAll();
                })
            }
        },
        getAllDepartments(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-departments`).then(response=>{
                this.departments = response.data
            })
        }
    },
    components:{
        AddUserDialogVue,
        ListComponentVue,
        AddUserRoleDialogVue
    }
};
</script>

<style lang="scss" scoped>

</style>