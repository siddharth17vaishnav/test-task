import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const authenticateToken = (req: any, res: any, next: any) => {
  try {
    const ACCESS_SECRET = process.env.ACCESS_SECRET;
    const authHeader = req.headers["authorization"];
    if (authHeader && ACCESS_SECRET) {
      const token = authHeader.split(" ")[1];
      const verifyToken: any = jwt.verify(token, ACCESS_SECRET);
      req.app.set("userId", verifyToken.userId);
      next();
    } else {
      res.status(401).send({ message: "Unauthenticated user!" });
    }
  } catch (err) {
    res.status(401).send({ message: "Unauthenticated user!" });
  }
};

export default authenticateToken;
