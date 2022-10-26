import { Request, Response, NextFunction } from "express";
import jwtSimple from "jwt-simple";
export function authenticate() {
  return async (req: any, res: Response, next: NextFunction) => {
    const tokenHeader = req.headers["authorization"];

    if (!tokenHeader) {
      return res.status(401).end();
    }

    const jwt = tokenHeader.replace(/^Bearer\s+/gi, "");

    try {
      const payload = jwtSimple.decode(jwt, process.env.JWT_SECRET!, false);

      console.log({ payload });
      req.user = { ...payload };
      next();
    } catch (e) {
      return res.status(401).end();
    }
  };
}
