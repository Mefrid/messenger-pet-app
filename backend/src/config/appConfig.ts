import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env?.["NODE_ENV"]}` });

export const config = {
  port: Number(process.env?.["PORT"]),
  allowedHost: process.env?.["ALLOWED_HOST"],
  accessTokenSecret: process.env?.["JWT_ACCESS_SECRET"]!,
  refreshTokenSecret: process.env?.["JWT_REFRESH_SECRET"]!,
  database: {
    host: process.env?.["DB_HOST"],
    port: Number(process.env?.["DB_PORT"]),
    user: process.env?.["DB_USER"],
    password: process.env?.["DB_PASSWORD"],
    database: process.env?.["DB_NAME"],
  },
};
