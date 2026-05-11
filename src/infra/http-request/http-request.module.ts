import { Module } from "@nestjs/common";
import axios, { type AxiosInstance } from "axios";
import { AXIOS_INSTANCE } from "./http-request.constants";
import { HttpRequestService } from "./http-request.service";

@Module({
  providers: [
    {
      provide: AXIOS_INSTANCE,
      useFactory: (): AxiosInstance => {
        const timeoutMs = Number(process.env.HTTP_TIMEOUT_MS ?? 30000);
        return axios.create({
          timeout: timeoutMs,
        });
      },
    },
    HttpRequestService,
  ],
  exports: [HttpRequestService, AXIOS_INSTANCE],
})
export class HttpRequestModule {}
