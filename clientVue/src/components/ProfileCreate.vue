<template>
    <div class="profile-create">
        <form @submit.prevent>
            <h4>Create Event</h4>
            <div class="input__validate">
                <my-input
                    v-model="userName"
                    type="text" 
                    placeholder="UserName"
                    :style="{'font-weight': 700, color: 'teal'}"
                    disabled
                />
                <!-- <span v-if="v$.userName.$error"> 
                    {{ this.v$.userName.$errors[0].$message }}
                </span> -->
            </div>
            
            <div class="input__validate">
                <my-input
                    v-focus 
                    v-model="title"
                    type="text" 
                    placeholder="Title"
                />
                <span v-if="v$.title.$error"> 
                    {{ this.v$.title.$errors[0].$message }}
                </span>
            </div>
            
            <div class="input__validate">
                <my-input 
                    v-model="description"
                    type="text" 
                    placeholder="Description"
                />
                <span v-if="v$.description.$error"> 
                    {{ this.v$.description.$errors[0].$message }}
                </span>
            </div>
            <div class="input__validate">
                <my-input 
                    v-model="startDate"
                    type="date" 
                    placeholder="StartDate"
                />
                <span v-if="v$.startDate.$error"> 
                    {{ this.v$.startDate.$errors[0].$message }}
                </span>
            </div>
            <div class="input__validate">
                <my-input 
                    v-model="endDate"
                    type="date" 
                    placeholder="EndDate"
                />
                <span v-if="v$.endDate.$error"> 
                    {{ this.v$.endDate.$errors[0].$message }}
                </span>
            </div>
            <my-button 
                @click="multiple"
            >
                Create
            </my-button>
        </form>

    </div>
</template>

<script>
import {mapActions} from 'vuex'
import MyInput from '@/components/UI/MyInput.vue';
//vuelidate
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength} from '@vuelidate/validators'
import validate from '@/validate/validate.js'

export default {
    name: 'profile-create',
    components: {
        MyInput
    },
    props: {
        modelValue: {
            type: String
        },
        user: {
            type: String
        }
    },
    data() {
        return {
            v$: useVuelidate(),
            userName: this.user,
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            // Error message
            messageVisible: false,
            messageText: ''
        }
    },
    validations() {
        return {
            userName: {
                required,
                minLength: minLength(4),
                maxLength: maxLength(12)
            },
            title: {
                required,
                minLength: minLength(2),
                maxLength: maxLength(12)
            },
            description: {
                required,
                minLength: minLength(6),
                maxLength: maxLength(32)
            },
            startDate: {
                required,
                verifyStartDate: validate.verifyStartDate
            },
            endDate: {
                required,
                verifyEndDate: validate.verifyEndDate
            }        
        }
    },
    methods: {
        multiple() {
            this.validateProfile()
            this.closeDialog()
        },
        validateProfile() {
            this.v$.$validate();
            if (!this.v$.$error) {
                this.createProfile({
                    userName: this.userName, 
                    title: this.title, 
                    description: this.description, 
                    startDate: this.startDate, 
                    endDate: this.endDate
                });
                // alert(`Form successfully submitted ... `);   
            }
            // else {
            //     // alert(`Form failed validation ... `);   
            //     // console.log(this.v$.$errors);
            //     // console.log(this.v$.email.$errors[0].$message)
            // }
        },
        closeDialog() {
            if (this.v$.$errors.length == 0) {
                this.$emit('update:modelValue', false)
            }
        },
        ...mapActions({
            createProfile: 'profile/createProfile'
        })
    }
}
</script>

<style>
form {
    display: flex;
    flex-direction: column;
}
h4 {
    text-align: left;
    color: rgb(0, 112, 112);
}
.input__validate {
  display: flex;
  flex-direction: column;
  color: teal;
}
</style>