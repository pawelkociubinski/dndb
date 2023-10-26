import dotenv from "dotenv";
import Pino from "pino";
import PinoHttp from "pino-http";
import z from "zod";

dotenv.config();

const ENVSchema = z.object({
  JWT_SECRET: z.string(),
  DOMAIN: z.string().default("localhost"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
});

export const parsedENV = ENVSchema.safeParse(process.env);

if (!parsedENV.success) {
  console.error(parsedENV.error.issues);
  process.exit(1);
}

export const config = parsedENV.data;

// https://www.youtube.com/watch?v=q1im-hMlKhM
// https://twitter.com/mattpocockuk/status/1615110808219918352?lang=en&ref=catalins.tech
type ENVSchemaType = z.infer<typeof ENVSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ENVSchemaType {}
  }
}

export const logger = Pino.default();
export const httpLogger = PinoHttp.default({
  logger,
});
