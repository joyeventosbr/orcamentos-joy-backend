import { Integration } from "@domain/integrations/entities/integration.entity";
import { IntegrationSchema } from "../typeorm/schemas/integration.schema";

export class IntegrationMapper {
  static toSchema(entity: Integration): IntegrationSchema {
    const schema = new IntegrationSchema();

    schema.id = entity.id;
    schema.status = entity.status;
    schema.payload = entity.payload;
    schema.createdAt = entity.createdAt;
    schema.description = entity.description;
    schema.error = entity.error;
    schema.response = entity.response;

    return schema;
  }

  static toEntity(schema: IntegrationSchema): Integration {
    return Integration.read({
      id: schema.id,
      status: schema.status,
      payload: schema.payload,
      createdAt: schema.createdAt,
      description: schema.description,
      error: schema.error,
      response: schema.response,
    });
  }

  static toSchemaList(entities: Integration[]): IntegrationSchema[] {
    return entities.map((entity) => this.toSchema(entity));
  }

  static toEntityList(schemas: IntegrationSchema[]): Integration[] {
    return schemas.map((schema) => this.toEntity(schema));
  }
}
