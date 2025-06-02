import { useMemo } from "react";
import { widgets } from "../mockData";

const useRolePermissions = (role) => {
  return useMemo(() => {
    return widgets.filter((widget) => widget.allowedRoles.includes(role));
  }, [role]);
};

export default useRolePermissions;
