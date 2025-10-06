export const hasPermission = (
  permissions: any[],
  permissionName: string
): boolean => {
  return permissions?.some((permission) => permission === permissionName);
};
