<template>
  <v-container>
    <apexchart
      ref="chart"
      type="bar"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </v-container>
</template>

<script>
import moment from 'moment';

export default {
  name: 'ActivityChart',
  props: {
    activities: {
      type: Array,
      required: true,
    },
    allUsers: {
      type: Boolean,
      default: false,
    },
    labelType: {
      type: String,
      default: 'month',
    },
  },
  data() {
    return {
      chartOptions: {
        theme: {
          mode: 'dark',
        },
        chart: {
          width: '100%',
          height: '800px',
          foreColor: 'white',
          background: '#1e1e1e',
          animations: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          type: 'datetime',
          labels: {
            formatter: (val, timestamp) => {
              let format;
              switch (this.labelType) {
                case 'month':
                  format = 'YYYY-MM'
                  break
                case 'year':
                  format = 'YYYY'
                  break
                default:
                  format = 'YYYY-MM-DD'
              }
              
              return moment(timestamp).format(format);
            },
          },
          tickPlacement: 'between',
        },
        noData: {
          text: 'Loading...',
        },
      },
      series: [
        {
          name: '',
          data: [],
        },
      ],
    }
  },
  watch: {
    activities(data) {
      if (!this.allUsers) {
        data = [
          {
            data,
          },
        ]
      }

      this.$refs.chart.updateSeries(data)
    },
  },
}
</script>
<style lang="scss">
.apexcharts-toolbar{
  z-index: 1 !important;
}
</style>
