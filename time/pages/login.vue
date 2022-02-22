<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="5" xl="4">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-row align="center" justify="center">
            <v-col cols="4">
              <v-img 
                max-height="175"
                src="/logo.svg"
                contain>
              </v-img>
            </v-col>
            <v-col cols="8">
              <v-card-text>
                <v-form class="mr-3">
                  <v-text-field
                    v-model="loginData.login"
                    name="login"
                    label="Login"
                    type="text">
                  </v-text-field>
                  <v-text-field
                    v-model="loginData.password"
                    name="password"
                    label="Password"
                    type="password">
                  </v-text-field>
                  <v-alert
                    v-if="showLoginError"
                    color="red"
                    type="error">
                    {{loginErrorMessage}}
                  </v-alert>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                  type="submit" 
                  color="primary"
                  @click="login">
                    Login
                  </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'login',
  transition: 'fade',
  auth: false,
  data() {
    return {
      loginData: {
        login: '',
        password: '',
      },
      showLoginError: false,
      loginErrorMessage: '',
    };
  },
  beforeDestroy() {
    if (typeof window === 'undefined') return;
    window.removeEventListener('keyup', this.checkKey);
  },
  mounted() {
    window.addEventListener('keyup', this.checkKey);
  },
  methods: {
    async login() {
      try {
        this.$progressBar.start();

        this.showLoginError = false;

        await this.$auth.loginWith("local", {
          data: this.loginData
        });

        this.$messageAlert(true, 'Logged in!', 'success');
        
        setTimeout(() => this.$router.push('/'), 1000)

        this.$progressBar.stop();
        
      } catch (err) {
        if(err.response.status === 401) {
          this.loginErrorMessage = 'Bad login or password';
        }else{
          this.loginErrorMessage = 'Please try again later or contact with support';
        }
        this.showLoginError = true;
        this.$progressBar.stop();
      }
    },
    checkKey(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.login();
      }
    },
  },
}
</script>

<style>

</style>