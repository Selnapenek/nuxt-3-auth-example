<script>
import { authClient } from "./authClient";

export default {
  data() {
    const tokenInfo = authClient.getTokenInfo();
    return {
      user: tokenInfo,
      email: "",
      password: "",
      loginForm: true,
      loading: false,
    };
  },
  methods: {
    logout() {
      authClient.purgeState();
      this.user = undefined;
    },
    login(event) {
      event.preventDefault();
      if (this.loading || !this.email || !this.password) {
        return;
      }

      this.loading = true;

      authClient
        .login({ email: this.email, password: this.password })
        .then(() => {
          this.user = authClient.getTokenInfo();
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    singUp(event) {
      event.preventDefault();
      if (this.loading || !this.email || !this.password) {
        return;
      }

      authClient
        .singUp({ user: { email: this.email }, password: this.password })
        .then(() => {
          this.user = authClient.getTokenInfo();
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<template>
  <div
    v-bind:style="{
      display: 'grid',
      alignItems: 'center',
      justifyContent: 'center',
    }"
  >
    <div>User: {{ JSON.stringify(user || {}, null, 2) }}</div>
    <form>
      <div>
        <label>Email</label>
        <div>
          <input type="email" name="email" required v-model="email" />
        </div>
      </div>
      <div>
        <label>Password</label>
        <div class="control">
          <input type="password" name="password" required v-model="password" />
        </div>
      </div>
      <div
        v-bind:style="{ display: ['grid'], gridGap: '8px', marginTop: '16px' }"
      >
        <div v-if="loading">Loading ...</div>
        <button type="sumbit" v-if="loginForm" @click="login">Login</button>
        <button type="sumbit" v-if="!!loginForm" @click="singUp">SingUp</button>
        <hr />
        <button @click="loginForm = true">Login Form</button>
        <button @click="loginForm = false">SingUp Form</button>
        <button type="submit" @click="logout" v-if="!!user">Logout</button>
      </div>
    </form>
  </div>
</template>
