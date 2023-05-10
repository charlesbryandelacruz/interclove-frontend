<template>
  <span>
        <div style="display:inline-block">
            <v-file-input
                ref="inputUploader"
                type="file"
                name="files"
                class="form-control pt-1"
                v-model="images"
                :multiple="true"
                @change="onChange"
                @click:clear="reset();$emit('reset', true);"
            />
        </div>
  </span>
</template>

<script>
import swal from 'sweetalert2'
export default {
    data() {
        return {
            name: '',
            files: '',
            success: '',
            attachments: [],
            images: null
        }
    },
    watch: {
        attachments() {
            if(this.attachments.length > 0) {
                this.attachments = [];
            }
        },
    },
    methods: {
        clearAttachments() {
            this.attachments = [];
            this.images = null;
        },
        onChange(e) {
            let selectedFiles = [];

            if(e) {
                selectedFiles = e;
            }

            let fileTypes = ['jpg','jpeg','png','csv','txt','xlx','xls','xlsx','pdf','zip'];


            if(selectedFiles.length == 0) {
                return false;
            } else {
                for(let i=0;i<selectedFiles.length;i++) {
                    this.attachments.push(selectedFiles[i])
                }

                let fileSizeChecker = _.compact(this.attachments).every(x=> {
                    return x.size < 8192000;
                });

                let fileTypeChecker = _.compact(this.attachments).every(x=> {
                    let fileName = x.name;
                    let fileNameLength = fileName.split('.').length;
                    let ext = fileName.split('.')[fileNameLength - 1];
                    return fileTypes.includes(ext);
                });

                // Emit Data
                if(!fileSizeChecker) {
                    swal.fire("", 'Each File size not more than 8MB', "warning").then(confirm=>{
                        if(confirm) {
                            this.attachments = [];
                        }
                    });

                    this.$emit('uploadedData', false);
                } else if(!fileTypeChecker) {
                    swal.fire("", 'Each File must be jpg, jpeg, png, csv, txt, xlx, xls, xlsx, pdf and zip type', "warning").then(confirm=>{
                        if(confirm) {
                            this.attachments = [];
                        }
                    });

                    this.$emit('uploadedData', false);
                } else {
                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    }

                    this.$emit('uploadedData', {
                        attachments: this.attachments,
                        config: config
                    });
                }
            }
        },
        reset() {
            this.$refs.inputUploader.reset();
            this.clearAttachments();
        }
    }
}
</script>

<style>

</style>
