export default function ({ route, $auth, redirect }) {
    if (route.path.includes('/admin') && $auth.user.type !== 'admin') {
        redirect({ name: 'index' });
        console.log('dd');
    }
}
