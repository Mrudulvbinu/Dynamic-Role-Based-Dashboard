import { widgets } from '../mockData';

const useRolePermissions = (role) => {
  return widgets.filter((widget) => widget.allowedRoles.includes(role));
};

export default useRolePermissions;