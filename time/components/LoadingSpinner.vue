<template lang="html">
    <v-overlay v-if="loading" :value="overlay" opacity="3">
    <div class="screen">
      <div class="dot">
        <div class="hand"></div>
        <div class="hand" size="small"></div>
      </div>
    </div>
  </v-overlay>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['loading', 'overlay']),
  },
}
</script>

<style lang="scss">

.hand {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 15%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transform-origin: 50% 50%;
  animation: rotation 1s linear infinite;

  &::after {
    content: "";
    background-color: black;
    border-radius: 200px;
    width: 40%;
    height: 3%;
    margin-left: -0.8vmax;
  }

  &[size="small"] {
    animation: rotation 10s linear infinite;
    padding: 23%;
  }

  &[size="small"]::after {
    width: 40%;
    height: 3%;
    margin-left: -0.8vmax;
  }
}

.screen {
  width: 16vh;
  height: 16vh;
  background-color: #263238;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5%;
}

.dot {
  width: 100%;
  height: 100%;
  background-color: #0D47A1;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    width: 9%;
    height: 9%;
    background-color: white;
    border-radius: 100%;
    display: flex;
  }
}

#logo {
  content: "";
  background-color: white;
  width: 100%;
  height: 100%;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(1turn);
  }
}
</style>

/*
<v-progress-circular
      indeterminate
      size="64"
      color="primary"
    ></v-progress-circular>

*/