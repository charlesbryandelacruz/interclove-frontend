<template>
    <v-dialog v-model="showDialog" persistent max-width="30%">
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col class="text-left">
                        Add Expense
                    </v-col>
                    <v-col class="text-right">
                        <v-btn text @click="$emit('closeDialogExpense',false)"><v-icon>mdi-close-circle</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>   
            <v-divider></v-divider>
            <v-card-text>
                <v-row class="mt-2">
                    <v-col cols="12">
                        <span>
                            Upload Attachment <FileUpload @uploadedData="uploadedData" @reset="clearFileUpload"/>
                        </span>
                    </v-col>
                    <v-col>
                        <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="expense.date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="expense.date"
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
                        v-model="expense.date"
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
                            @click="$refs.menu.save(expense.date)"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-menu>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field 
                            v-model="expense.particulars" 
                            dense 
                            outlined 
                            hide-details 
                            label="Title"> 
                        </v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-autocomplete 
                            v-model="expense.expense_type_id" 
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
                    <v-col cols="12">
                        <v-text-field 
                            v-model="expense.amount" 
                            dense 
                            outlined 
                            hide-details 
                            label="Amount"> 
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-divider class="mt-2"></v-divider>              
                <v-row class="mt-2"> 
                    <v-col class="text-right">
                        <!-- <v-btn small color="secondary" @click="$emit('closeDialog',false)" class="mr-2">Cancel</v-btn> -->
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
import FileUpload from '@/views/main/UploadFileComponent.vue'
export default {
name: 'PosLaravelVueAddUserDialog',

data() {
    return {
        showDialog:false,
        expense:{
            particulars:null,
            amount:0,
            expense_type_id:0,
            date:null,
        },
        expense_type_selection:[],
        menu:false,
        uploadedFiles:null
    };
},
props:['addDialogExpense'],
mounted() {
    this.getAllExpensesType();
},
watch:{
    addDialogExpense:{
        handler(val){
            this.showDialog = val
            this.getAllExpensesType();
        }
    }
},
components:{
    FileUpload
},
methods: {
    uploadedData(data) {
        if (!data) {
            this.uploadedFiles = null;
        }
        this.uploadedFiles = data;
    },
    clearFileUpload(confirm) {
        if (confirm) {
            this.uploadedFiles = null;
        }
        this.uploadedFiles = null;
        this.$refs.fileUpload.reset();
    },
    saveItem(){
        const data = new FormData();
        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };  
        if (this.uploadedFiles == null && this.payment.payment_type_id != 2) {
            Swal
                .fire({
                    title: "Please Upload Images or Files",
                    icon: "warning",
                    dangerMode: true,
                })
            return false
        }
        if (!!this.uploadedFiles && this.uploadedFiles.attachments.length > 0) {
            let files = this.uploadedFiles.attachments;

            for (let i = 0; i < _.compact(files).length; i++) {
                data.append("files[]", files[i]);
            }
        }
        data.append("expense", JSON.stringify(this.expense));
        
        axios.post(`${process.env.VUE_APP_HOST_API}/api/save-expense`,data,config).then(response=>{
            Swal.fire(response.data,'','success');
            this.$emit('refreshData')
            this.$emit('closeDialogExpense')
            this.resetFields();
        })
    },
    resetFields(){
        Object.assign(this.$data, this.$options.data.call(this));
    },
    getAllExpensesType(){
        axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-expense-types`).then(response=>{
            this.expense_type_selection = response.data
        })
    },
},
};
</script>

<style lang="scss" scoped>

</style>