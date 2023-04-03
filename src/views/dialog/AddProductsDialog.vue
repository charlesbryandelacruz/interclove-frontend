<template>
    <div> 
        <v-dialog v-model="showDialog" persistent height="500px" max-width="50%">
            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col class="text-left">
                            Add New Product
                        </v-col>
                        <v-col class="text-right">
                            <v-btn text @click="$emit('closeDialog',false)"><v-icon>mdi-close-circle</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>   
                <v-divider horizontal></v-divider>
                <v-card-text>
                    <v-row class="mt-2">
                        <v-col>
                            <v-text-field dense outlined label="SKU"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field dense outlined label="Item Name"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-autocomplete :items="unit_of_measures" dense outlined label="UOM"></v-autocomplete>
                        </v-col>
                        <v-col>
                            <v-text-field dense outlined label="SKU"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="3">
                            <v-textarea dense rows="2" outlined label="Description">
                            </v-textarea>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field dense outlined label="SI Price" type="number"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field dense outlined label="DR Price" type="number"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field dense outlined label="SP Price" type="number"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>   
                <v-card-actions>
                    <v-row> 
                        <v-col class="text-center">
                            <v-btn color="secondary">Cancel</v-btn>
                        </v-col>
                        <v-col class="text-center">
                            <v-btn color="primary">Submit</v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>  
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'PosLaravelVueAddProductsDialog',

    data() {
        return {
            showDialog:false,
            unit_of_measures:[
                {text:'PCS',value:1},
                {text:'M',value:2},
                {text:'SET',value:3},
                {text:'BOX',value:4},
                {text:'KG',value:5},
                {text:'ROLLS',value:6},
            ]
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
        
    },
};
</script>

<style lang="scss" scoped>

</style>