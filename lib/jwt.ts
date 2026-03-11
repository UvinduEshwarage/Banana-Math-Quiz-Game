import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}


export interface JwtPayload {
  userId: string;
  email: string;
  name:string;
}

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};