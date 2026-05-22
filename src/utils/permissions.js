export const ROLES = {
  GESTOR: 'GESTOR',
  FUNCIONARIO: 'FUNCIONARIO',
};


export const ROUTE_PERMISSIONS = {
  '/inicio': [ROLES.GESTOR, ROLES.FUNCIONARIO],
  '/pdv': [ROLES.GESTOR, ROLES.FUNCIONARIO],
  '/estoque': [ROLES.GESTOR, ROLES.FUNCIONARIO],
  '/produtos': [ROLES.GESTOR, ROLES.FUNCIONARIO],
  '/contas': [ROLES.GESTOR],
  '/usuarios': [ROLES.GESTOR],
  '/vendas': [ROLES.GESTOR, ROLES.FUNCIONARIO],
  '/etiqueta-digital': [ROLES.GESTOR, ROLES.FUNCIONARIO],
};


export const normalizeRole = (role) => {
  if (!role) return '';


  return String(role)
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
};


export const hasPermission = (userRole, allowedRoles = []) => {
  const normalizedRole = normalizeRole(userRole);


  if (!normalizedRole) return false;
  return allowedRoles.includes(normalizedRole);
};


export const canAccessRoute = (userRole, route) => {
  const allowedRoles = ROUTE_PERMISSIONS[route];


  if (!allowedRoles) return true;
  return hasPermission(userRole, allowedRoles);
};



