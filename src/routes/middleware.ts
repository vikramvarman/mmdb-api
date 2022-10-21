import { Request, Response, NextFunction } from "express";
import jwtSimple from "jwt-simple";
export function authenticate() {
  return async (req: any, res: Response, next: NextFunction) => {
    const tokenHeader = req.headers["authorization"];

    console.log({ tokenHeader });

    if (!tokenHeader) {
      return res.status(401).end();
    }

    const jwt = tokenHeader.replace(/^Bearer\s+/gi, "");

    console.log({ jwt });

    try {
      const payload = jwtSimple.decode(jwt, process.env.JWT_SECRET!, false);
      req.user = { ...payload.user };
      next();
    } catch (e) {
      return res.status(401).end();
    }
  };
}
