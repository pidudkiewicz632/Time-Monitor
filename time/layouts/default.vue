<template>
  <v-app dark class="ma-0 pa-0">
    <v-app-bar class="moveTop" elevation="4" app>
      <NuxtLink to="/">
        <v-list-item>
          <v-list-item-title class="font-weight-bold blue--text lighten-4--text">
            Timer
          </v-list-item-title>
          <v-list-item-avatar color="primary">
            <v-img class="col-12" src="/logo.svg"></v-img>
          </v-list-item-avatar>
        </v-list-item>
      </NuxtLink>
      <v-toolbar-items v-if="!showSideMenu" class="ml-10">
        <v-btn
          v-for="(page, pageIndex) in singlePages"
          :key="pageIndex + page.title"
          text
          :to="page.path"
          elevation="0"
        >
          <v-icon v-text="page.icon"></v-icon>
          {{ page.title }}
        </v-btn>
        <v-menu
          v-for="(page, pageIndex) in multiPages"
          :key="pageIndex + page.title"
          open-on-hover
          offset-y
          transition="slide-x-transition"
          bottom
          right
        >
          <template #activator="{ on, attrs }">
            <v-btn text elevation="0" v-bind="attrs" v-on="on">
              <v-icon class="mr-1" v-text="page.icon"></v-icon>
              {{ page.title }}
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item
              v-for="(subPage, subPageIndex) in page.subPages"
              :key="subPageIndex"
              router
              :to="subPage.path"
            >
              <v-list-item-action>
                <v-list-item-title>{{ subPage.title }}</v-list-item-title>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <div v-if="!showSideMenu">
        <v-list-item>
          <v-list-item-avatar color="primary">
            <v-img v-if="link" class="col-12" :src="link"></v-img>
            <span v-else>{{ initials }}</span>
          </v-list-item-avatar>
          <v-list-item-title class="font-weight-bold">
            <NuxtLink to="/profile">{{ `${name} ${surname}` }}</NuxtLink>
          </v-list-item-title>
          <v-list-item-icon>
            <v-btn color="primary" icon @click="logout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </v-list-item-icon>
        </v-list-item>
      </div>
      <v-app-bar-nav-icon
        v-if="showSideMenu"
        @click.stop="sidebar = !sidebar"
      ></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer
      v-if="showSideMenu"
      v-model="sidebar"
      class="moveTop"
      temporary
      dark
      right
      app
    >
      <template #prepend>
        <v-list-item>
          <v-list-item-avatar color="primary">
            <v-img v-if="link" class="col-12" :src="link"></v-img>
            <span v-else>{{ initials }}</span>
          </v-list-item-avatar>
          <v-list-item-title class="font-weight-bold">
            <NuxtLink to="/profile">
              {{ `${name} ${surname}` }}
            </NuxtLink>
          </v-list-item-title>
          <v-list-item-icon>
            <v-btn color="primary" icon @click="logout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </v-list-item-icon>
        </v-list-item>
        <v-divider dark></v-divider>
      </template>
      <v-list nav dense>
        <v-list-item
          v-for="(page, pageIndex) in singlePages"
          :key="pageIndex + page.title"
          router
          :to="page.path"
        >
          <v-list-item-icon>
            <v-icon v-text="page.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list-group
        v-for="(page, pageIndex) in multiPages"
        :key="pageIndex + page.title"
        :prepend-icon="page.icon"
      >
        <template #activator>
          <v-list-item-title>{{ page.title }}</v-list-item-title>
        </template>
        <v-list dense>
          <v-list-item
            v-for="(subPage, subPageIndex) in page.subPages"
            :key="subPageIndex"
            router
            :to="subPage.path"
          >
            <v-list-item-icon>
              <v-icon v-text="subPage.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ subPage.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-list-group>
    </v-navigation-drawer>
    <v-main>
      <MessageAlert />
      <Nuxt />
      <LoadingSpinner />
    </v-main>
  </v-app>
</template>

<script>
import LoadingSpinner from '../components/LoadingSpinner.vue'

export default {
  name: 'HomeLayout',
  components: { LoadingSpinner },
  transition: 'fade',
  data() {
    return {
      name: '',
      surname: '',
      link: '',
      sidebar: false,
      multiPages: [
        {
          title: 'User',
          icon: 'mdi-account',
          subPages: [
            {
              title: 'Activities',
              icon: 'mdi-calendar-clock',
              path: '/user/activities',
            },
            {
              title: 'Statistics',
              icon: 'mdi-chart-bell-curve-cumulative',
              path: '/user/statistics',
            },
            {
              title: 'Profile',
              icon: 'mdi-face-man-profile',
              path: '/profile',
            },
          ],
        },
      ],
      singlePages: [{ title: 'Home', path: '/', icon: 'mdi-home' }],
    }
  },
  computed: {
    initials() {
      if (this.name && this.surname) {
        return this.name[0] + this.surname[0]
      }
      return ''
    },
    showSideMenu() {
      return this.$vuetify.breakpoint.width < 880
    },
  },
  created() {
    this.$progressBar.start()
    this.name = this.$auth.user.name
    this.surname = this.$auth.user.surname
    this.link = this.$auth.user.avatar ? `/user/${this.$auth.user.avatar}` : ''

    if(this.$auth.user.type === 'admin') {
      this.multiPages.push({
          title: 'Admin',
          icon: 'mdi-shield-crown',
          subPages: [
            {
              title: 'Activities',
              icon: 'mdi-calendar-clock',
              path: '/admin/activities',
            },
            {
              title: 'Statistics',
              icon: 'mdi-chart-bell-curve-cumulative',
              path: '/admin/statistics',
            },
          ],
        });
    }

  },
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="scss">
.moveTop {
  z-index: 500 !important;
}

a {
  text-decoration: none;
  color: inherit;
  .nuxt-link-exact-active {
    color: #fff !important;
    font-style: normal;
  }

  :hover {
    color: #fff;
  }

  :visited {
    text-decoration: none;
    color: inherit;
  }
  .nuxt-link-active {
    color: #fff !important;
  }
}
</style>