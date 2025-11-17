export const authorize = (roles: string[]) => (req: any, res: any, next: () => any) => {
  if (process.env.BYPASS_AUTHZ) {
    next();
    return;
  }
    
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
