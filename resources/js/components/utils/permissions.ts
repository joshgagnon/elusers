
export function hasPermission(user: EL.User, permission: string) {
    return (user.permissions || []).find(p => p.name === permission);
}