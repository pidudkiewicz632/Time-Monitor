export default ({ store }, inject) => {
  const message = function (show, message, type) {
    store.dispatch('changeMessage', { show, message, type });
    };

  inject('messageAlert', message)
}
