export const ROLES = {
  GESTOR: 'GESTOR',
  FUNCIONARIO: 'FUNCIONARIO',
};

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
export const ROUTE_PERMISSIONS = {
  '/inicio': [ROLES.GESTOR, ROLES.FUNCIONARIO],
  '/pdv': [ROLES.GESTOR, ROLES.FUNCIONARIO],
  '/estoque': [ROLES.GESTOR, ROLES.FUNCIONARIO],
  '/produtos': [ROLES.GESTOR, ROLES.FUNCIONARIO],
<<<<<<< HEAD
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



=======
  '/contas': [ROLES.GESTOR, ROLES.FUNCIONARIO],
  '/usuarios': [ROLES.GESTOR],
  '/vendas': [ROLES.GESTOR, ROLES.FUNCIONARIO],
};

export const hasPermission = (userRole, allowedRoles = []) => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
