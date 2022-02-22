<template>
    <v-container fluid>
        <v-row class="mt-3" justify="start" align="start">
            <v-col cols="12" sm="5" md="4">
                <v-card>
                    <v-card-title>New Activity</v-card-title>
                    <v-card-text>
                        <ActivityForm />
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="10" md="8">
                <TypeSlider v-model="currentUserChart.selectedType">
                    <apexchart
                        ref="barUser"
                        type="bar"
                        :options="currentUserChart.chartOptions"
                        :series="currentUserChart.series"
                    ></apexchart>
                </TypeSlider>
            </v-col>
            <v-col v-if="isAdmin" cols="12" sm="10" md="8">
                <TypeSlider v-model="allUsersChart.selectedType">
                    <apexchart
                        ref="lineUsers"
                        type="bar"
                        :options="allUsersChart.chartOptions"
                        :series="allUsersChart.series"
                    ></apexchart>
                </TypeSlider>
            </v-col>
            <v-col cols="12" sm="8" md="4">
                <TypeSlider v-model="currentUserTable.selectedUserTableType">
                    <UserActivityTable :data="currentUserTableData" />
                </TypeSlider>
            </v-col>
            <v-col v-if="isAdmin" cols="12" sm="8" md="4">
                <TypeSlider v-model="allUsersTable.selectedType">
                    <UserActivityTable
                        :headers-prop="allUsersTable.headers"
                        user-group-by
                        :data="allUsersTableData"
                    />
                </TypeSlider>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import moment from 'moment'
import dateFunctions from '../lib/dateFunctions'
import TypeSlider from '../components/TypeSlider.vue';
import UserActivityTable from '../components/UserActivityTable.vue';

export default {
    name: "IndexPage",
    components: { TypeSlider, UserActivityTable },
    data() {
        return {
            isAdmin: 'false',
            currentUserChart: {
                selectedType: 0,
                chartOptions: {
                    theme: {
                        mode: "dark",
                    },
                    chart: {
                        foreColor: "white",
                        background: "#1e1e1e",
                    },
                    xaxis: {
                        tickAmount: 8,
                    },
                },
                series: [
                    {
                        name: "",
                        data: [],
                    },
                ],
            },
            currentUserTable: {
                selectedUserTableType: 0,
            },
            allUsersTable: {
                selectedType: 0,
                headers: [
                    { text: "User", value: "user" },
                    { text: "Date", value: "x" },
                    { text: "Duration", value: "y" },
                ],
            },
            userActivities: [],
            allUsersActivities: [],
            allUsersChart: {
                selectedType: 0,
                chartOptions: {
                    theme: {
                        mode: "dark",
                    },
                    chart: {
                        foreColor: "white",
                        background: "#1e1e1e",
                    },
                    xaxis: {
                        tickAmount: 8,
                        type: 'category',
                        tickPlacement: 'on',
                    },
                },
                series: [
                    {
                        name: "",
                        data: [],
                    },
                ],
            },
        };
    },
    async fetch() {
        this.isAdmin = this.$auth.user.type === 'admin';

        if (this.isAdmin) {
            this.allUsersActivities = await this.$axios
                .get("/api/activity/allUsers")
                .then((res) => res.data.activities);
            this.allUsersActivities = this.allUsersActivities.map((user) => {
                const data = dateFunctions.preparationUserActivities(user.activities);
                return {
                    name: user.login,
                    data
                };
            });
        }
        this.userActivities = await this.$axios
            .get("/api/activity/user")
            .then((res) => res.data.activities);


        this.userActivities = dateFunctions.preparationUserActivities(this.userActivities);
    },
    computed: {
        chartBarUserData() {
            let data = this.preparationUsersData(this.currentUserChart.selectedType);
            const { min, max } = dateFunctions.findMinMax(data);
            data = data.map((item) => {
                let color = "#0D47A1";
                if (item.y === min && item.y !== max) {
                    color = "#C62828";
                }
                else if (item.y !== min && item.y === max) {
                    color = "#00E676";
                }
                return {
                    ...item,
                    fillColor: color,
                };
            });
            return data;
        },
        currentUserTableData() {
            return this.preparationUsersData(this.currentUserTable.selectedUserTableType);
        },
        allUsersData() {
            return this.preparationUsersData(this.allUsersTable.selectedType, true);
        },
        chartAllUsersData() {
            return this.preparationUsersData(this.allUsersChart.selectedType, true);
        },
        allUsersTableData() {

            if (!this.allUsersData.length) {
                return [];
            }

            let data = [];
            this.allUsersData.forEach((user) => {
                user.data.forEach((activity) => {
                    data.push({
                        user: user.name,
                        ...activity
                    });
                });
            });
            data = data.sort((a, b) => {
                if (a.x < b.x) return -1
                if (a.x > b.x) return 1
                return 0
            });

            return data;
        },
    },
    watch: {
        chartBarUserData(data) {
            this.$refs.barUser.updateSeries([
                {
                    data,
                },
            ]);
        },
        chartAllUsersData(data) {
            this.$refs.lineUsers.updateSeries(data);
        },
    },
    methods: {
        preparationUsersData(selectedType, allUsers) {
            let data = allUsers ? this.allUsersActivities : this.userActivities;
            let [start, type, group] = [moment(), "month", "day"];
            switch (selectedType) {

                case 1:
                    start = start.subtract(1, "months");
                    break;
                case 2:
                    type = "year";
                    group = "month";
                    break;
                case 3:
                    start = start.subtract(1, "year");
                    type = "year";
                    group = "month";
            }

            if (allUsers) {
                data = data.map((element) => {
                    const temp = this.preparationDataStage(element.data, type, group, start);
                    return {
                        name: element.name,
                        data: temp
                    };
                });

                return data;
            } else {
                return this.preparationDataStage(data, type, group, start);
            }
        },
        preparationDataStage(data, type, group, start) {
            let temp = data.filter((activity) => start.isSame(activity.startTime, type));

            temp = dateFunctions.group(temp, group);

            return dateFunctions.preparationDataToPrint(temp);
        }
    }
}
</script>
