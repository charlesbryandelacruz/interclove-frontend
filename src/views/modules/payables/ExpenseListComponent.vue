<template>
    <v-app>
        <v-row>
            <v-col class="text-left" cols="3" >
                <ListComponentVue :listItems="items" @selectedItem="selectItem" :listTitle="'Items'"></ListComponentVue>
            </v-col>
            <v-col class="text-left px-2 mt-2" cols="9" v-if="userAccess.view">
                <v-row>
                    <v-col class="text-left">
                        <v-btn 
                            v-if="isDisabled && userAccess.create"
                            small
                            class="mr-2" 
                            color="primary" 
                            @click="showAddEditDialogExpense">
                                <v-icon>mdi-plus</v-icon>
                                Add New Expense
                        </v-btn>
                        <v-btn 
                            v-if="isDisabled && userAccess.create"
                            small
                            color="primary" 
                            @click="showAddEditDialog">
                                <v-icon>mdi-plus</v-icon>
                                Add Expense Type
                        </v-btn>
                    </v-col>
                </v-row>
                    <v-card-title>
                        <v-row>
                            <v-col>Expense Details</v-col>
                            <v-spacer></v-spacer>
                            <v-col class="text-right">
                                <v-btn color="orange" small @click="showFileViewer(selected_item)">
                                    View Files
                                </v-btn>
                            </v-col>
                        </v-row>
        
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <h3 class="mt-2">Details</h3>
                        <v-divider class="mb-2"></v-divider>
                        <v-row>
                            <v-col>
                                <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                :return-value.sync="selected_item.date"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="selected_item.date"
                                    dense
                                    outlined
                                    label="Date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    hide-details 
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                v-model="selected_item.date"
                                no-title
                                scrollable
                                >
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="menu = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.menu.save(selected_item.date)"
                                >
                                    OK
                                </v-btn>
                                </v-date-picker>
                            </v-menu>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.particulars" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Title"> 
                                </v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-autocomplete 
                                    v-model="selected_item.expense_type_id" 
                                    dense 
                                    outlined
                                    hide-details 
                                    label="Expense Type" 
                                    :items="expense_type_selection" 
                                    item-text="name"
                                    item-value="id"
                                    > 
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field 
                                    :readonly="isDisabled" 
                                    v-model="selected_item.amount" 
                                    dense 
                                    outlined 
                                    hide-details
                                    reverse
                                    label="Amount"> 
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
            </v-col>
        </v-row>
        <AddExpenseDialog :addDialogExpense="addDialogExpense" @closeDialogExpense="closeDialogExpense()" @refreshData="getAll()"></AddExpenseDialog>
        <AddExpenseTypeDialogVue :addDialog="addDialog" @closeDialog="closeDialog()" @refreshData="getAll()"></AddExpenseTypeDialogVue>
        <BaseFileViewerComponent :show="fileDialog.show" :files="fileDialog.files" @closeFileViewer="closeFileViewer"></BaseFileViewerComponent>
    </v-app>
  
</template>

<script>
import Swal from 'sweetalert2';
import ListComponentVue from '@/views/main/ListComponent.vue';
import axios from 'axios';
import AddExpenseDialog from '@/views/dialog/AddExpenseDialog.vue';
import BaseFileViewerComponent from '@/views/main/BaseFileViewerComponent.vue';
import AddExpenseTypeDialogVue from '@/views/dialog/AddExpenseTypeDialog.vue';
export default {
    name: 'PosLaravelVueProductComponent',

    data() {
        return {
            items:[],
            selected_item:{
                particulars:null,
                amount:0,
                expense_type_id:0,
                date:null,
                id:'',
            },
            isDisabled:true,         
            addDialogExpense:false,
            expense_type_selection:[],
            fileDialog:{
                show:false,
                files:[]
            },
            menu:false,
            userAccess:{
                view:false,
                create:false
            },
            addDialog:false,
        };
    },
    mounted() {
        this.checkAccess()
        this.getAll();
        this.getAllExpensesType();
    },
    methods: {
        selectItem(item){
            this.selected_item = item
        },
        closeDialogExpense(){
            this.addDialogExpense = false
        },
        closeDialog(){
            this.addDialog = false
        },
        showAddEditDialogExpense(){
            this.addDialogExpense = true
        },
        showAddEditDialog(){
            this.addDialog = true
        },
        getAll(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-expenses`).then(response=>{
                this.items = response.data
            })
        },
        getAllExpensesType(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-expense-types`).then(response=>{
                this.expense_type_selection = response.data
            })
        },
        showFileViewer(item){
            this.fileDialog = {
                show:true,
                files:item.expense_files
            }
        },
        closeFileViewer(){
            this.fileDialog = {
                show:false,
                files:[]
            }
        },
        checkAccess(){
            let payload = {
                side_nav_id:2,
                side_nav_link_id:7,
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
                //console.log(this.userAccess)
            })
        }
    },
    components:{
        AddExpenseDialog,
        ListComponentVue,
        BaseFileViewerComponent,
        AddExpenseTypeDialogVue
    }
};
</script>

<style lang="scss" scoped>

</style>