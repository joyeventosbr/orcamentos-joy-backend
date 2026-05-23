import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Res,
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { type FastifyReply } from "fastify";
import { CreateSettingUseCase } from "@application/settings/usecases/create/create-setting.usecase";
import { DeleteSettingUseCase } from "@application/settings/usecases/delete/delete-setting.usecase";
import { UpdateSettingUseCase } from "@application/settings/usecases/update/update-setting.usecase";
import { SettingResponseMapper } from "@application/settings/mappers/setting-response.mapper";
import { CreateSettingRequestApiDto } from "@api/dtos/settings/requests/create-setting-request.api.dto";
import { UpdateSettingRequestApiDto } from "@api/dtos/settings/requests/update-setting-request.api.dto";
import { SettingErrorApiResponseDto } from "@api/dtos/settings/responses/setting-error-api-response.dto";
import { SettingResponseDto } from "@domain/settings/dtos/setting-response.dto";
import type { ISettingRepository } from "@domain/settings/repositories/i-setting-repository";
import { Public } from "@infra/auth/jwt/decorators/public.decorator";

@ApiTags("settings")
@Controller("settings")
export class SettingsController {
  constructor(
    private readonly createSettingUseCase: CreateSettingUseCase,
    private readonly updateSettingUseCase: UpdateSettingUseCase,
    private readonly deleteSettingUseCase: DeleteSettingUseCase,
    @Inject("ISettingRepository")
    private readonly settingRepository: ISettingRepository,
  ) {}

  @Post()
  @Public()
  @ApiBody({ type: CreateSettingRequestApiDto })
  @ApiResponse({ status: 201, type: SettingResponseDto })
  @ApiResponse({ status: 409, type: SettingErrorApiResponseDto })
  async create(
    @Body() body: CreateSettingRequestApiDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.createSettingUseCase.execute(body);
    if (result.isFailure()) {
      return res
        .status(this.getErrorStatus(result.getError()))
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.CREATED).send(result.getValue());
  }

  @Get()
  @Public()
  @ApiResponse({ status: 200, type: [SettingResponseDto] })
  async getAll(@Res() res: FastifyReply) {
    const result = await this.settingRepository.getAll();
    if (result.isFailure()) {
      return res
        .status(this.getErrorStatus(result.getError()))
        .send({ error: result.getError() });
    }

    return res
      .status(HttpStatus.OK)
      .send(
        result
          .getValue()
          .map((setting) => SettingResponseMapper.toDto(setting)),
      );
  }

  @Get("key/:key")
  @Public()
  @ApiResponse({ status: 200, type: SettingResponseDto })
  @ApiResponse({ status: 404, type: SettingErrorApiResponseDto })
  async getByKey(@Param("key") key: string, @Res() res: FastifyReply) {
    const result = await this.settingRepository.getByKey(key);
    if (result.isFailure()) {
      return res
        .status(this.getErrorStatus(result.getError()))
        .send({ error: result.getError() });
    }

    const setting = result.getValue();
    if (!setting) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ error: "Parametrização não encontrada" });
    }

    return res.status(HttpStatus.OK).send(SettingResponseMapper.toDto(setting));
  }

  @Get(":id")
  @Public()
  @ApiResponse({ status: 200, type: SettingResponseDto })
  @ApiResponse({ status: 404, type: SettingErrorApiResponseDto })
  async getById(@Param("id") id: string, @Res() res: FastifyReply) {
    const result = await this.settingRepository.getById(id);
    if (result.isFailure()) {
      return res
        .status(this.getErrorStatus(result.getError()))
        .send({ error: result.getError() });
    }

    const setting = result.getValue();
    if (!setting) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ error: "Parametrização não encontrada" });
    }

    return res.status(HttpStatus.OK).send(SettingResponseMapper.toDto(setting));
  }

  @Patch(":id")
  @Public()
  @ApiBody({ type: UpdateSettingRequestApiDto })
  @ApiResponse({ status: 200, type: SettingResponseDto })
  @ApiResponse({ status: 404, type: SettingErrorApiResponseDto })
  @ApiResponse({ status: 409, type: SettingErrorApiResponseDto })
  async update(
    @Param("id") id: string,
    @Body() body: UpdateSettingRequestApiDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.updateSettingUseCase.execute({
      id,
      key: body.key,
      value: body.value,
    });
    if (result.isFailure()) {
      return res
        .status(this.getErrorStatus(result.getError()))
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.OK).send(result.getValue());
  }

  @Delete(":id")
  @Public()
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, type: SettingErrorApiResponseDto })
  async delete(@Param("id") id: string, @Res() res: FastifyReply) {
    const result = await this.deleteSettingUseCase.execute({ id });
    if (result.isFailure()) {
      return res
        .status(this.getErrorStatus(result.getError()))
        .send({ error: result.getError() });
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  private getErrorStatus(error: string): HttpStatus {
    if (error.includes("não encontrada")) return HttpStatus.NOT_FOUND;
    if (error.includes("Já existe")) return HttpStatus.CONFLICT;

    return HttpStatus.BAD_REQUEST;
  }
}
