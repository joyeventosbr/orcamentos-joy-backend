import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { InfraModule } from "@infra/infra.module";
import { ApiModule } from "@api/api.module";
import { UseCasesModule } from "@application/usecases.module";

@Module({
  imports: [InfraModule, ApiModule, UseCasesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
