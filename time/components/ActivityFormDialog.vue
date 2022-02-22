<template>
  <v-dialog v-model="showDialog" eager class="col-8" dark width="500">
    <v-card class="pa-8">
      <div class="text-right">
        <v-btn icon dark @click="showDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-card-title>Edit Aciivity</v-card-title>
      <v-card-text>
        <ActivityForm
          ref="aform"
          :edit="edit"
          :users="users"
          :show-select-user="showSelectUser"
          @updated="action"
          @added="action"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ActivityFormDialog',
  data() {
    return {
      showDialog: false,
      data: {},
      edit: true,
      resolve: null,
      reject: null,
      users: [],
      showSelectUser: false,
    }
  },
  methods: {
    startDialog(data, edit = true, showSelectUser = false, users) {
      this.showDialog = true
      this.edit = edit;
      this.data = data;
      this.showSelectUser = showSelectUser;

      if (showSelectUser) {
        this.users = users;
        this.users.unshift({
          text: 'Select User',
          value: null,
        });
      }

      if (!this.edit) {
        this.$refs.aform.clear();
      } else {
        this.$refs.aform.update(JSON.parse(JSON.stringify(this.data)));
      }

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    action(result, data) {
      this.showDialog = false
      
      if (result) {
        this.resolve(data)
      } else {
        this.reject(data)
      }
    },
  },
}
</script>

<style></style>
