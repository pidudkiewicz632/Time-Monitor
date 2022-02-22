<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Profile</v-toolbar-title>
          </v-toolbar>
          <v-row align="center" justify="center">
            <v-col class="text-center my-3" cols="4">
              <v-avatar size="150" color="primary">
                <v-img v-if="link" class="col-12" :src="link"></v-img>
                <span v-else>{{ initials }}</span>
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-card-title>{{ `${name} ${surname}` }}</v-card-title>
                    <v-card-subtitle class="blue--text lighten-3--text">{{
                      type
                    }}</v-card-subtitle>
                    <v-card-text class="blue--text lighten-3--text"
                      >Login: {{ login }}</v-card-text
                    >
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-menu top>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      class="elevation-2"
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      >Edit</v-btn
                    >
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="(item, index) in editTypes"
                      :key="index"
                    >
                      <v-list-item-action @click="showEditDialog(item)">{{
                        item
                      }}</v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="showDialog" eager class="col-8" dark width="500">
      <v-card class="pa-8">
        <div class="text-right">
          <v-btn icon dark @click="showDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-card-title>Edit User</v-card-title>
        <v-card-text>
          <v-form ref="formUser" v-model="validUserEdit" class="mt-5">
            <v-text-field
              v-if="edit === 'login'"
              v-model="loginInput"
              label="login"
              :rules="loginRules"
              :error-messages="loginErrors"
              @blur="loginValidation"
              @input="loginErrors = ''"
            ></v-text-field>
            <div v-if="edit === 'password'">
              <v-text-field
                v-model="oldPassword"
                type="password"
                label="Old Password"
                :rules="oldPasswordRules"
                :error-messages="oldPasswordErrors"
                @blur="oldPasswordValidation"
              ></v-text-field>
              <v-text-field
                v-model="newPassword"
                :rules="passwordRules"
                type="password"
                label="New Password"
              ></v-text-field>
              <v-text-field
                v-model="newPasswordRepeat"
                type="password"
                label="Repeat New Password"
                :rules="passwordRepeatRules"
              ></v-text-field>
            </div>
            <v-file-input
              v-if="edit === 'avatar'"
              v-model="avatar"
              chips
              small-chips
              truncate-length="15"
            ></v-file-input>
            <v-btn class="mt-5" color="blue darken-4" @click="update"
              >Save</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <MessageAlert ref="message" />
  </v-container>
</template>

<script>
export default {
  name: 'ProfilePage',
  transition: 'fade',
  data() {
    return {
      showDialog: false,
      edit: '',
      login: '',
      type: '',
      name: '',
      link: false,
      surname: '',
      loginInput: '',
      oldPassword: '',
      loginErrors: '',
      newPasswordRepeat: '',
      newPassword: '',
      avatar: null,
      validUserEdit: true,
      editTypes: ['login', 'password', 'avatar'],
      oldPasswordErrors: [],
      oldPasswordRules: [
        (v) =>
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{8,})/.test(v) ||
          'Bad password.',
      ],
      passwordRepeatRules: [
        (v) => v === this.newPassword || 'The passwords are not the same.',
      ],
      passwordRules: [
        (v) => v.length >= 8 || 'Too short.',
        (v) => v.length <= 100 || 'Too long.',
        (v) =>
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(v) ||
          'Must contain at least one uppercase letter, one lowercase letter and digit.',
      ],
      loginRules: [
        (v) => v.length > 4 || 'Too short.',
        (v) => v.length <= 20 || 'Too long.',
        (v) =>
          /^[a-zA-Z0-9][a-zA-Z0-9_-]+$/.test(v) ||
          'Must start with a letter or a number.',
        (v) =>
          /^[a-zA-Z0-9_-]+[a-zA-Z0-9]$/.test(v) ||
          'Must end with a letter or a number.',
        (v) => /^[a-zA-Z0-9_-]+$/.test(v) || 'An illegal character was used.',
      ],
    }
  },
  async fetch() {
    this.$progressBar.start();
    const temp = await this.$axios
      .get('/api/user/profile')
      .then((res) => res.data.data);
    this.login = temp.login
    this.loginInput = temp.login
    this.type = temp.type
    this.name = temp.name
    this.surname = temp.surname
    this.link = temp.avatar ? `/user/${temp.avatar}` : ''
    this.$progressBar.stop();
  },
  computed: {
    initials() {
      if (this.name && this.surname) {
        return this.name[0] + this.surname[0]
      }
      return ''
    },
  },
  methods: {
    async loginValidation() {
      this.loginErrors = ''

      if (this.login !== this.loginInput) {
        const inUse = await this.$axios
          .get('/api/user/checkLogin/', {
            params: {
              login: this.loginInput,
            },
          })
          .then((res) => res.data.data)

        if (inUse) {
          this.loginErrors = 'This login is in use.'
        }
      }
    },
    async oldPasswordValidation() {
      this.oldPasswordErrors = []

      const isGood = await this.$axios
        .get('/api/user/checkPassword/', {
          params: {
            password: this.oldPassword,
          },
        })
        .then((res) => res.data.data)

      console.log('a: ', isGood);

      if (!isGood) {
        this.oldPasswordErrors.push('Bad password.');
      }
    },
    update() {
      this.$refs.formUser.validate()
      
      if (this.validUserEdit) {
        let params = {}

        switch (this.edit) {
          case 'login':
            params = {
              method: 'put',
              url: '/api/user/update',
              data: {
                login: this.loginInput,
              },
            }
            break
          case 'password':
            params = {
              method: 'put',
              url: '/api/user/update',
              data: {
                password: this.newPassword,
              },
            }
            break
          case 'avatar':
            // eslint-disable-next-line no-case-declarations
            const data = new FormData()

            data.append('userPhoto', this.avatar)

            params = {
              method: 'post',
              url: '/api/user/upload',
              data,
            }
        }

        this.$progressBar.start()

        this.$axios(params)
          .then((response) => {
            this.$messageAlert(true, 'User updated.', 'success')
          })
          .catch((error) => {
            console.log(error)
            this.$messageAlert(true, 'Something went wrong' , 'error')
          })
          .finally(() => {
            this.$progressBar.stop()
            this.$fetch()
            this.showDialog = false
          })
        this.$auth.fetchUser()
      }
    },
    showEditDialog(type) {
      this.edit = type
      this.showDialog = true
    },
  },
}
</script>

<style>
</style>