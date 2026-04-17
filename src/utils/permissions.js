export const ROLES = {
  GESTOR: 'GESTOR',
  FUNCIONARIO: 'FUNCIONARIO',
};

export const ROUTE_PERMISSIONS = {
  '/inicio': [ROLES.GESTOR, ROLES.FUNCIONARIO],
  '/pdv': [ROLES.GESTOR, ROLES.FUNCIONARIO],
  '/estoque': [ROLES.GESTOR, ROLES.FUNCIONARIO],
  '/produtos': [ROLES.GESTOR, ROLES.FUNCIONARIO],
  '/contas': [ROLES.GESTOR, ROLES.FUNCIONARIO],
  '/usuarios': [ROLES.GESTOR],
  '/vendas': [ROLES.GESTOR, ROLES.FUNCIONARIO],
};

export const hasPermission = (userRole, allowedRoles = []) => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};