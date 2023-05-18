<template>
    <v-dialog v-model="showDialog" persistent max-width="30%">
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col class="text-left">
                        Add Petty Cash
                    </v-col>
                    <v-col class="text-right">
                        <v-btn text @click="$emit('closeDialogPettyCash',false)"><v-icon>mdi-close-circle</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>   
            <v-divider></v-divider>
            <v-card-text>
                <v-row class="mt-2">
                    <v-col cols="6">
                        <v-text-field 
                            :readonly="isDisabled" 
                            v-model="petty_cash.title" 
                            dense 
                            outlined 
                            hide-details 
                            label="Title"> 
                        </v-text-field>
                    </v-col>
                    <!-- <v-col cols="6">
                        <v-text-field 
                            :readonly="isDisabled" 
                            v-model="petty_cash.remaining_amount" 
                            dense 
                            outlined 
                            hide-details 
                            label="Remaining"> 
                        </v-text-field>
                    </v-col> -->
                    <v-col cols="6">
                        <v-text-field 
                            :readonly="isDisabled" 
                            v-model="petty_cash.gross_amount" 
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
        petty_cash:{
            title:'',
            remaining_amount:0,
            total_amount:0,
        },
    };
},
props:['addDialogPettyCash'],
mounted() {
    
},
watch:{
    addDialogPettyCash:{
        handler(val){
            this.showDialog = val
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
        data.append("petty_cash", JSON.stringify(this.petty_cash));
        
        axios.post(`${process.env.VUE_APP_HOST_API}/api/save-petty_cash`,data,config).then(response=>{
            Swal.fire(response.data,'','success');
            this.$emit('refreshData')
            this.$emit('closeDialogPettyCash')
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