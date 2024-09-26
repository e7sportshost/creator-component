
import { usePage } from '@inertiajs/vue3'
const page = usePage();

const CheckPermissions = (route_name, permissions, item = null) => {
    return route().has(route_name, item?.id || null) && (page.props.permissions.includes(permissions) || page.props.auth.user.super_admin);
}

export default CheckPermissions;