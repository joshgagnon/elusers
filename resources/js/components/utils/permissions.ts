
export function hasPermission(user: EL.User, permission: string) {
    if(!user) {
        return false;
    }
    return (user.permissions || []).find(p => p.name === permission);
}