import { Result } from "@shared/result";
import { IntegrationStatus } from "../enums/integration-status.enum";

export class Integration {
  private constructor(
    public id: string,
    public status: IntegrationStatus,
    public createdAt: Date,
    public payload: Record<string, any>,
    public description?: string,
    public error?: string,
    public response?: Record<string, any>,
  ) {}

  static create({
    payload,
    description,
  }: {
    payload: Record<string, any>;
    description?: string;
  }): Result<Integration> {
    if (!payload) {
      return Result.failure("Payload é obrigatório");
    }

    const integration = new Integration(
      "",
      IntegrationStatus.PENDING,
      new Date(Date.now()),
      payload,
      description,
      undefined,
      undefined,
    );

    return Result.success(integration);
  }

  static read(integrationData: {
    id: string;
    status: IntegrationStatus;
    createdAt: Date;
    payload: Record<string, any>;
    updatedAt?: Date;
    description?: string;
    error?: string;
    response?: Record<string, any>;
  }): Integration {
    return new Integration(
      integrationData.id,
      integrationData.status,
      integrationData.createdAt,
      integrationData.payload,
      integrationData.description,
      integrationData.error,
      integrationData.response,
    );
  }

  updatePayload(newPayload: Record<string, any>): Result<void> {
    if (!newPayload) {
      return Result.failure("Payload é obrigatório");
    }

    this.payload = newPayload;

    return Result.success();
  }

  updateSuccessStatus(response?: Record<string, any>): Result<void> {
    this.status = IntegrationStatus.SUCCESS;
    this.error = "";
    this.response = response;

    return Result.success();
  }

  updateFailureStatus(error?: string): Result<void> {
    this.status = IntegrationStatus.FAILED;
    this.error = error;

    return Result.success();
  }
}
