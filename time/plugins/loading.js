export default ({store}, inject) => {
    const progress = {
      start() {
        store.dispatch('changeLoading', true)
      },
      stop() {
        store.dispatch('changeLoading', false)
      },
      operation() {
        store.dispatch('changeLoading', false)
      },
    }

  inject('progressBar', progress)
}
