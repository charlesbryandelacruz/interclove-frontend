<template>
    <div>
        <v-dialog v-model="showFileViewer">
            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col class="text-left">
                            View File
                        </v-col>
                        <v-col class="text-right">
                            <v-btn text @click="closeDialog()"><v-icon>mdi-close-circle</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>  
                <v-card-text>
                    <v-data-table
                        class="pa-4"
                        :headers="filesHeader"
                        :items="fileItems"
                    >
                    <template v-slot:[`item.action`]="{ item }">
                        <v-btn fab x-small icon text color="orange" @click="showFile(item)"><v-icon>mdi-eye</v-icon></v-btn>
                    </template>
                    <template v-slot:[`item.created_at`]="{ item }">
                        {{  item.created_at | formatDate }}
                    </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showSelectedFile">
            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col class="text-left">
                            File
                        </v-col>
                        <v-col class="text-right">
                            <v-btn text @click="showSelectedFile = false"><v-icon>mdi-close-circle</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>  
                <v-card-text>
                    <div class="iframe-container">
                        <iframe :src="filePath" frameborder="0" class="responsive-iframe"></iframe>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'IntercloveFrontBaseFileViewerComponent',
    props:['show','files'],
    data() {
        return {
            showFileViewer:false,
            filesHeader: [
                { text: 'Name', value: 'name' },
                { text: 'Uploaded By', value: 'uploaded_by_name' },
                { text: 'Date', value: 'created_at' },
                { text: 'Action', value: 'action' },
            ],
            fileItems: [],
            showSelectedFile:false,
            filePath:null,
        };
    },

    mounted() {
        
    },

    methods: {
        closeDialog(){
            this.showFileViewer = false
            this.$emit('closeFileViewer')
        },
        showFile(item){
            this.showSelectedFile = true
            this.filePath = `${process.env.VUE_APP_HOST_API}`+item.path
        }
    },
    watch:{
        show:{
            handler(val){
                if(val){
                    this.showFileViewer = true
                    this.fileItems = this.files
                }
            }
        }
    }
};
</script>

<style scoped>
.iframe-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
}

.responsive-iframe {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
}
</style>