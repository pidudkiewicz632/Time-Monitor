export default function ({
  route,
  $axios,
  redirect,
  $progressBar,
  $messageAlert,
}) {
  $axios.onError((error) => {
    $progressBar.stop()

    if (route.name.toLowerCase() === 'login') {
      return;
    }
    if (error.response.status === 500 || error.response.status === 401) {
      redirect('/login')
    } else {
      $messageAlert(true, 'Something goes wrong!', 'error')
    }
  })
}
