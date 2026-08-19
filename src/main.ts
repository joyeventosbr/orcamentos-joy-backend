import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import helmet from "@fastify/helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import multipart from "@fastify/multipart";
import { config } from "dotenv";
import type { FastifyReply, FastifyRequest } from "fastify";

config();

const port = Number(process.env.PORT) || 10000;
const corsOrigin = process.env.CORS_ORIGIN ?? "*";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const fastify = app.getHttpAdapter().getInstance();

  fastify.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (request.protocol !== "http") {
        await reply.code(400).send({
          error: "A API aceita somente requisições via protocolo http",
        });
      }
    },
  );

  await app.register(multipart);

  if (process.env.NODE_ENV === "production") {
    await app.register(helmet);
  }

  app.enableCors({
    origin:
      corsOrigin === "*"
        ? true
        : corsOrigin.split(",").map((origin) => origin.trim()),
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("HubGateway API")
    .setDescription("REST API documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port: ${port}`);
  });
}
void bootstrap();
