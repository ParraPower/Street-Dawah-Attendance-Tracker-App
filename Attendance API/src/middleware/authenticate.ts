export const authenticate = (req: any, res: any, next: () => any) => {
  // Example: check JWT token
  
  if (process.env.BYPASS_AUTHN) {
    req.user = { id: 1, role: "ADMIN" };
    next();
    return;
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  // Decode and attach user to request (mocked here)
  req.user = { id: 1, role: "ADMIN" };
  next();
};
