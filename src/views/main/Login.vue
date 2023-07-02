<template>
<v-app>
   <v-container fluid class="mt-6">
      <v-layout align-center justify-center>
         <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
               <v-toolbar dark color="primary">
                  <v-toolbar-title>Login</v-toolbar-title>
               </v-toolbar>
               <v-card-text>
                  <v-text-field
                     v-model="email"
                     name="username"
                     label="Username"
                     type="text"
                     placeholder="username"
                     required
                  ></v-text-field>
                  
                  <v-text-field
                     v-model="password"
                     name="password"
                     label="Password"
                     type="password"
                     placeholder="password"
                     required
                  ></v-text-field>
                  <v-btn type="submit" class="mt-4" color="primary" value="log in" @click="Login">Login</v-btn>
               </v-card-text>
            </v-card>
         </v-flex>
      </v-layout>
   </v-container>
</v-app>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'
export default {
 name: "Login",
 data() {
   return {
     username: "",
     password: "",
     email:""
   };
 },
 methods: {
   async Login(){
         let payload = {
               name:this.username,  
               email:this.email,
               password:this.password         
         }
         await axios.post(`${process.env.VUE_APP_HOST_API}/login`,payload).then(response=>{
            if(response.data != 'Login Successfully'){
               Swal.fire('Wrong Credentials','','error')
               return false
            }
               Swal.fire(response.data,'','success')

              axios.post(`${process.env.VUE_APP_HOST_API}/api/get-user-info`,payload).then(resp=>{
                  localStorage.setItem("user_info",JSON.stringify(resp.data));
                  localStorage.setItem("user_id",resp.data.id);
                  localStorage.setItem("user_name",resp.data.name);
                  localStorage.setItem("position",resp.data.position);
                  this.$router.push('/home')
               })
         })
      }
 },
};
</script>