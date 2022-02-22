const moment = require('moment')

module.exports = {
  group(dates, type, start, end) {
    const startDate = moment(start).valueOf() 
    const endDate = moment(end).valueOf() 
    let format

    switch (type) {
      case 'month':
        format = 'YYYY-MM'
        break
      case 'year':
        format = 'YYYY'
        break
      default:
        format = 'YYYY-MM-DD'
    }

    const map = new Map()
    dates.forEach((item) => {
      if (
        moment(item.startTime).valueOf() >= startDate &&
        moment(item.startTime).valueOf() <= endDate
      ) {
        const key = moment(item.startTime).format(format)
        let collection = map.get(key)
        if (!collection) {
          map.set(key, item.duration)
        } else {
          map.set(key, (collection += item.duration))
        }
      }
    })

    return Array.from(map, ([name, value]) => ({
      x: name,
      y: Number(Number(value).toFixed(2)),
    }))
  },
  findMinMax(data) {
    if (!data.length)
      return {
        min: null,
        max: null,
      }

    return data.reduce(
      function (prev, current) {
        if (prev.max < current.y) {
          prev.max = current.y
        }

        if (prev.min > current.y) {
          prev.min = current.y
        }

        return prev
      },
      {
        min: data[0].y,
        max: data[0].y,
      }
    )
  },
  preparationSingleUserActivities(data) {
    return data
      .map((activity) => {
        const duration = moment.duration(
          moment(activity.endTime).diff(activity.startTime)
        )
        return {
          ...activity,
          duration: duration.asHours(),
        }
      })
      .sort((a, b) => {
        if (moment(a.startTime).valueOf() < moment(b.startTime).valueOf()) return -1
        if (moment(a.startTime).valueOf() > moment(b.startTime).valueOf()) return 1
        return 0
      })
  },
  preparationAllUsersActivities(data) {
    return data.map((user) => {
      const data = this.preparationSingleUserActivities(user.activities)
      return {
        name: user.login,
        data,
      }
    })
  },
  preparationDataToPrint(data) {
    return data.map((activity) => {
      return {
        x: activity.x,
        y: Number(Number(activity.y).toFixed(2)),
      }
    })
  },
  markMinMax(data) {
    const { min, max } = this.findMinMax(data)
    data = data.map((item) => {
      let color = '#0D47A1'
      if (item.y === min && item.y !== max) {
        color = '#C62828'
      } else if (item.y !== min && item.y === max) {
        color = '#00E676'
      }
      return {
        ...item,
        fillColor: color,
      }
    })
    return data
  },
  preparationAllUsersCharDataToPrint(data, group, start, end) {
    return data.map((element) => {
      const temp = this.group(element.data, group, start, end)
      return {
        name: element.name,
        data: temp,
      }
    })
  },
  preparationAllUsersTableDataToPrint(data) {
    if (!data.length) {
      return []
    }

    let temp = []
    data.forEach((user) => {
      user.data.forEach((activity) => {
        temp.push({
          user: user.name,
          id: user.name + activity.x,
          ...activity,
        })
      })
    })
    temp = temp.sort((a, b) => {
      if (moment(a.x).valueOf() < moment(b.x).valueOf()) return -1
      if (moment(a.x).valueOf() > moment(b.x).valueOf()) return 1
      return 0
    })

    return temp
  },
  preparationCalendarDataToPrint(data, start, end, name) {
    const temp = [];
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    const startDate = moment(moment(start).format('YYYY-MM-DD'))
    const endDate = moment(moment(end).format('YYYY-MM-DD'))

    data.forEach((activity) => {
      if (
        moment(moment(activity.startTime).format('YYYY-MM-DD')) >= startDate &&
        moment(moment(activity.startTime).format('YYYY-MM-DD')) <= endDate
      ) {
        temp.push({
          name: `${name}: ${activity.description || 'Work'}`,
          start: moment(activity.startTime).toDate(),
          end: moment(activity.endTime).toDate(),
          color,
          timed: true,
        });
      }
    });
    return temp;
  },
}
