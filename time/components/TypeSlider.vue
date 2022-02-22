<template>
    <v-card class="elevation-12">
        <v-card-title>
            <v-row>
                <v-col v-if="title" cols="12">
                    {{title}}
                </v-col>
                <v-col cols="12">
                    <v-row justify="space-between" align="center">
                        <v-col>
                            <v-btn class="mx-auto" elevation="2" fab @click="changeUserType(-1)">
                                <v-icon color="blue darken-4" large>mdi-chevron-left</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col class="text-center">
                            {{ userLabels[selectedUserBarType] }}
                        </v-col>
                        <v-col class="text-right">
                            <v-btn elevation="2" fab @click="changeUserType(1)">
                                <v-icon color="blue darken-4" rotate="45" large>mdi-chevron-right</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12">
                    <v-item-group v-model="selectedUserBarType" class="text-center" mandatory>
                        <v-item
                            v-for="n in userLabels.length"
                            :key="`btn-${n}`"
                            v-slot="{ active }">
                            <v-btn color="primary" :input-value="active" icon @click="selectedUserBarType = n - 1">
                                <v-icon>mdi-record</v-icon>
                            </v-btn>
                        </v-item>
                    </v-item-group>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text class="px-6">
            <slot></slot>
        </v-card-text>
        <v-card-actions>
            <v-btn color="blue darken-4" :to="moreLink" class="mx-auto">More</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: 'TypeSlider',
    props: {
        moreLink: {
            type: String,
        },
        title: {
            type: String,
        },
    },
    data() {
        return {
            selectedUserBarType: 0,
            userLabels: ['Current Month', 'Last Month', 'Current Year', 'Last Year'],
        };
    },
    watch: {
        selectedUserBarType(value) {
            this.$emit('input', value);
        },
    },
    methods: {
        changeUserType(value) {
            this.selectedUserBarType += value;

            if (this.selectedUserBarType < 0) {
                this.selectedUserBarType = this.userLabels.length - 1;
            } else if (this.selectedUserBarType >= this.userLabels.length) {
                this.selectedUserBarType = 0;
            }
        },
    },
}
</script>

<style>
</style>