<template>
    <v-dialog v-model="showDialog" persistent max-width="50%">
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col class="text-left">
                        Add Transaction
                    </v-col>
                    <v-col class="text-right">
                        <v-btn text @click="$emit('closeDialog',false)"><v-icon>mdi-close-circle</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>   
            <v-divider></v-divider>
            
            <v-card-text>
                <span>
                    Upload Attachment <FileUpload @uploadedData="uploadedData" @reset="clearFileUpload"/>
                </span>
                <h3>Available Amount : {{available_amount | currency('',2)}}</h3>
                <v-row class="mt-2">
                    <v-col cols="4">
                        <v-autocomplete 
                            v-model="petty_cash_item.expense_type_id" 
                            :items="expenses_type"
                            dense 
                            outlined 
                            hide-details 
                            label="Expense Type"> 
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field 
                            v-model="petty_cash_item.description" 
                            dense 
                            outlined 
                            hide-details 
                            label="Description"> 
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field 
                            v-model="petty_cash_item.allocated_amount" 
                            dense 
                            outlined 
                            hide-details 
                            label="Total Amount"> 
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
import FileUpload from '@/views/main/UploadFileComponent.vue'
export default {
name: 'PosLaravelVueAddUserDialog',

data() {
    return {
        showDialog:false,
        petty_cash_item:{
            petty_cash_id:0,
            expense_type_id:'',
            description:'',
            allocated_amount:'',
        },
        departments:[],
        file: {},
        fileSelected: false,
        showFileSelect: false,
        uploadedFiles:null,
        expenses_type:[
            {text:'Misc',value:1},
            {text:'Others',value:2},
        ],
        available_amount:0
    };
},
props:['addDialog','selected_item'],
mounted() {
    
},
watch:{
    addDialog:{
        handler(val){
            this.showDialog = val
            this.available_amount = this.selected_item.remaining_amount
            this.petty_cash_item.petty_cash_id = this.selected_item.id
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
        if(Number(this.available_amount) < Number(this.petty_cash_item.allocated_amount)){
            Swal
                .fire({
                    title: "Invalid Amount",
                    icon: "warning",
                    dangerMode: true,
                })
            return false
        }
        if (this.uploadedFiles == null) {
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
        data.append("petty_cash_item", JSON.stringify(this.petty_cash_item));
        
        axios.post(`${process.env.VUE_APP_HOST_API}/api/save-petty_cash_item`,data,config).then(response=>{
            Swal.fire(response.data,'','success');
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