<template>
        <v-dialog v-model="showDialog" persistent max-width="80%">
            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col class="text-left">
                            Change Access
                        </v-col>
                        <v-col class="text-right">
                            <v-btn text @click="$emit('closeRoleDialog',false)"><v-icon>mdi-close-circle</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>   
                <v-divider></v-divider>
                <v-card-text>
                    <v-expansion-panels>
                        <v-expansion-panel
                          v-for="(item,i) in modules"
                          :key="i"
                        >
                          <v-expansion-panel-header>
                            {{item.name}}
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                                    <v-expansion-panels>
                                        <v-expansion-panel
                                        v-for="(side_nav,i) in item.side_nav_links"
                                        :key="i"
                                        >
                                        <v-expansion-panel-header>
                                            {{side_nav.name}}
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <v-switch v-for="(action,x) in side_nav.actions" v-model="action.active" :label="action.name">
                                                
                                            </v-switch> 
                                        </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    
                </v-card-text>   
                <v-divider class="mt-2"></v-divider>              
                <v-row class="mt-2 mx-0 my-0"> 
                    <v-col class="text-right">
                        <v-btn small color="secondary" @click="$emit('closeRoleDialog',false)" class="mr-2">Cancel</v-btn>
                        <v-btn small color="primary" @click="saveItem()">Submit</v-btn>
                    </v-col>
                </v-row>
          
            </v-card>
        </v-dialog>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'
export default {
    name: 'PosLaravelVueAddUserDialog',

    data() {
        return {
            showDialog:false,
            user:{
                name:'',
                email:'',
                position:'',
                department_id:0,
                password:'intercloveco'
            },
            modules:[],
            user_id:null
        };
    },
    props:['addRoleDialog','selected_item'],
    mounted() {
        this.getAllDepartments()
    },
    watch:{
        addRoleDialog:{
            handler(val){
                //console.log(this.selected_item)
                this.showDialog = val
                this.user_id = this.selected_item.id
                let payload = {
                    user_id:this.user_id
                }
                axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-accesses`,payload).then(response=>{
                    this.modules = response.data;
                })
            }
        }
    },
    methods: {
        saveItem(){
            let actions = []

            let side_nav_link = this.modules.map(e=>{ return e.side_nav_links})
            let act = _.flatten(side_nav_link,'actions')
            let a = act.map(e=>{return e.actions})
            let b = _.flatten(a)


            let payload = {
                actions:b,
                user_id:this.user_id
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/save-access`,payload).then(response=>{
                Swal.fire(response.data,'','success')
                this.$emit('refreshData')
                this.$emit('closeRoleDialog',false)
                this.resetFields()
            })
        },
        getAllDepartments(){
           
        },
        resetFields(){
            Object.assign(this.$data, this.$options.data.call(this));
            this.getAllDepartments()
        }
    },
};
</script>

<style lang="scss" scoped>

</style>