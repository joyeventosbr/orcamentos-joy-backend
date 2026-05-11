import { Inject, Injectable } from "@nestjs/common";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  Method,
  RawAxiosRequestHeaders,
} from "axios";
import { AXIOS_INSTANCE } from "./http-request.constants";
import { Result } from "@shared/result";

@Injectable()
export class HttpRequestService {
  constructor(
    @Inject(AXIOS_INSTANCE) private readonly axiosInstance: AxiosInstance,
  ) {}

  async get<TResponse>(
    url: string,
    options?: {
      headers?: RawAxiosRequestHeaders;
      params?: Record<string, unknown>;
    },
  ): Promise<Result<TResponse>> {
    const result = await this.execute<TResponse>({
      method: "GET",
      url,
      headers: options?.headers,
      params: options?.params,
    });
    if (result.isFailure()) {
      return Result.failure(result.getError());
    }

    return Result.success<TResponse>(result.getValue());
  }

  async delete<TResponse>(
    url: string,
    options?: {
      headers?: RawAxiosRequestHeaders;
      params?: Record<string, unknown>;
    },
  ): Promise<Result<TResponse>> {
    const result = await this.execute<Result<TResponse>>({
      method: "DELETE",
      url,
      headers: options?.headers,
      params: options?.params,
    });
    if (result.isFailure()) {
      return Result.failure(result.getError());
    }

    return Result.success<TResponse>(result.getValue().data);
  }

  async post<TResponse>(
    url: string,
    data?: unknown,
    options?: {
      headers?: RawAxiosRequestHeaders;
      params?: Record<string, unknown>;
    },
  ): Promise<Result<TResponse>> {
    const result = await this.execute<TResponse>({
      method: "POST",
      url,
      data,
      headers: options?.headers,
      params: options?.params,
    });
    if (result.isFailure()) {
      return Result.failure(result.getError());
    }

    return Result.success<TResponse>(result.getValue());
  }

  async put<TResponse>(
    url: string,
    data?: unknown,
    options?: {
      headers?: RawAxiosRequestHeaders;
      params?: Record<string, unknown>;
    },
  ): Promise<Result<TResponse>> {
    const result = await this.execute<TResponse>({
      method: "PUT",
      url,
      data,
      headers: options?.headers,
      params: options?.params,
    });
    if (result.isFailure()) {
      return Result.failure(result.getError());
    }

    return Result.success<TResponse>(result.getValue());
  }

  private async execute<TResponse>(config: {
    method: Method;
    url: string;
    data?: unknown;
    headers?: RawAxiosRequestHeaders;
    params?: Record<string, unknown>;
  }): Promise<Result<TResponse>> {
    try {
      const response = await this.axiosInstance.request({
        method: config.method,
        url: config.url,
        data: config.data,
        headers: config.headers,
        params: config.params,
      } as AxiosRequestConfig);

      return Result.success(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;

      const status = axiosError.response?.status;
      const data = axiosError.response?.data;

      const details =
        data !== undefined
          ? typeof data === "string"
            ? data
            : JSON.stringify(data)
          : axiosError.message;

      return Result.failure(
        `HttpRequest failed${status ? ` (${status})` : ""}: ${details}`,
      );
    }
  }
}
