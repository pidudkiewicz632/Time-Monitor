/* eslint-disable vue/no-parsing-error */
<template>
    <div>
        <div v-if="showActions" class="text-right mb-8 mx-3">
            <v-row justify="space-between">
                <v-btn color="blue darken-3" @click="$emit('addActivity')">Add New</v-btn>
                <v-btn color="blue darken-3" @click="$emit('deleteActivities')">Delete Selected</v-btn>
            </v-row>
        </div>
        <v-data-table
            id="myTable"
            class="elevation-1 blue darken-3"
            :headers="headers"
            :items="activities"
            :items-per-page="10"
            item-key="id"
            :show-group-by="userGroupBy"
            @current-items="changeSum"
            @update:group-by="changeRowsAmount"
        >
            <template #[`body.append`]>
                <tr class="blue darken-4">
                    <td v-for="(item, index) in headers" :key="index + item.value">
                        <div v-if="index === labelSumIndex">Total</div>
                        <div v-else-if="index === sumIndex">{{ sumUserTable }}</div>
                    </td>
                </tr>
            </template>
            <template #[`group.summary`]="{ items }">
                <td v-for="(item, index) in headers" :key="index + item.value">
                    <div v-if="index === labelSumIndex">Total</div>
                    <div v-else-if="index === sumIndex">{{ sum(items) }}</div>
                </td>
            </template>
            <template v-if="showActions" #[`item.actions`]="{ item }">
                <v-row v-if="item.editable" align="center">
                    <v-icon small class="mr-3" @click="$emit('editActivity', item)">mdi-pencil</v-icon>
                    <v-icon small class="mr-3" @click="$emit('deleteActivity', item)">mdi-delete</v-icon>
                    <v-simple-checkbox
                        v-model="item.toDelete"
                        dense
                        @input="changeSelectedActivities"
                    ></v-simple-checkbox>
                </v-row>
            </template>
        </v-data-table>
    </div>
</template>

<script>
export default {
    name: 'UserActivityTable',
    prop: ['value'],
    props: {
        data: {
            type: Array,
            required: true,
        },
        fieldToSum: {
            type: String,
            default: 'y',
        },
        showActions: {
            type: Boolean,
            default: false,
        },
        userGroupBy: {
            type: Boolean,
            default: false,
        },
        headersProp: {
            type: Array,
            default() {
                return [
                    { text: "Date", value: "x" },
                    { text: "Duration", value: "y" },
                ];
            }
        }
    },
    data() {
        return {
            sumUserTable: 0,
            labelSumIndex: 0,
            sumIndex: 0,
            startSumIndex: 0,
            headers: [
                { text: "Date", value: "x" },
                { text: "Duration", value: "y" },
            ],
        };
    },
    computed: {
        activities() {
            return JSON.parse(JSON.stringify(this.data));
        },
    },
    created() {
        this.headers = this.headersProp;
        if (this.showActions) {
            this.headers.push({ text: 'Actions', value: 'actions', sortable: false });
        }

        this.startSumIndex = this.sumIndex  = this.headers.findIndex((item) => item.value === this.fieldToSum);

        if (this.sumIndex) {
            this.labelSumIndex = this.sumIndex - 1;
        }
    },
    methods: {
        changeRowsAmount(value) {
            this.sumIndex = this.startSumIndex;
            if (value.length) {
                this.sumIndex = this.sumIndex - 1;
            }
            this.labelSumIndex = this.sumIndex - 1;
        },
        changeSum(items) {
            this.sumUserTable = items.reduce((acc, item) => acc + item[this.fieldToSum], 0).toFixed(2);
        },
        sum(items) {
            return items.reduce((acc, item) => acc + item[this.fieldToSum], 0).toFixed(2);
        },
        changeSelectedActivities() {
            const temp = this.activities.filter((item) => item.toDelete);
            this.$emit('input', temp);
        },
    },
}
</script>