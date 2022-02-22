<template>
    <v-container fluid>
        <v-row class="col-12 col-md-11 mx-auto" justify="space-between" align="center">
            <v-col cols="2">
                <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
            </v-col>
            <v-col v-if="$refs.calendar" class="text-center text-h4 font-weight-bold blue--text lighten-4--text">
                {{title}}
            </v-col>
            <v-col class="text-right" cols="2">
                <v-btn icon class="ma-2" @click="$refs.calendar.next()">
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-calendar
            ref="calendar"
            v-model="currentDate"
            class="col-12 col-md-11 my-6 mx-auto"
            :events="data"
            event-overlap-threshold="30"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
        ></v-calendar>
        <v-menu
            v-model="show"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
        >
            <v-card dark min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color">
                    <v-toolbar-title>{{ selectedEvent.title }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>{{ selectedEvent.description }}</v-card-text>
                <v-card-actions>
                    <v-btn :color="selectedEvent.color" @click="show = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </v-container>
</template>

<script>
import moment from 'moment'

export default {
    name: 'UserCalendar',
    props: {
        data: {
            type: Array,
            required: true,
        },
        calendarType: {
            type: String,
            default: 'month',
        },
    },
    data() {
        return {
            show: false,
            currentDate: moment().endOf('month').format('YYYY-MM-DD hh:mm'),
            type: '',
            selectedEvent: {},
            selectedElement: '',
        }
    },
    computed: {
        title() {
            let format = '';
            switch (this.type) {
                case 'month':
                    format = 'MMMM YYYY';
                    break;
                case 'week':
                    format = 'MMMM YYYY';
                    break;
                default:
                    format = 'DD MMMM YYYY';
            }
            return moment(this.currentDate).format(format);
        },
    },
    watch: {
        calendarType(val) {
            this.type = val
        },
    },
    created() {
        this.type = this.calendarType
    },
    methods: {
        showEvent({ nativeEvent, event }) {
            const open = () => {
                this.selectedElement = nativeEvent.target

                const description = `${moment(event.start).format(
                    'YYYY-MM-DD HH:mm'
                )} - ${moment(event.end).format('YYYY-MM-DD HH:mm')}`

                this.selectedEvent = {
                    title: event.name,
                    description,
                    color: event.color,
                }
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => (this.show = true))
                )
            }

            if (this.show) {
                this.show = false
                requestAnimationFrame(() => requestAnimationFrame(() => open()))
            } else {
                open()
            }

            nativeEvent.stopPropagation()
        },
        viewDay({ date }) {
            this.currentDate = date
            this.type = 'day'
            this.$emit('typeChange', 'day')
        },
    },
}
</script>

<style>
</style>