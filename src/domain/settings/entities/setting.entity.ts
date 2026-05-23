import { Result } from "@shared/result";

export class Setting {
  private constructor(
    public id: string,
    public key: string,
    public value: string,
    public createdAt: Date,
    public updatedAt?: Date,
  ) {}

  static create(input: { key: string; value: string }): Result<Setting> {
    const key = input.key?.trim();
    const value = input.value?.trim();

    if (!key) {
      return Result.failure("Chave da parametrização é obrigatória");
    }

    if (!value) {
      return Result.failure("Valor da parametrização é obrigatório");
    }

    return Result.success(new Setting("", key, value, new Date()));
  }

  static read(input: {
    id: string;
    key: string;
    value: string;
    createdAt: Date;
    updatedAt?: Date;
  }): Setting {
    return new Setting(
      input.id,
      input.key,
      input.value,
      input.createdAt,
      input.updatedAt,
    );
  }

  update(input: { key?: string; value?: string }): Result<Setting> {
    if (input.key !== undefined) {
      const key = input.key.trim();
      if (!key) {
        return Result.failure("Chave da parametrização é obrigatória");
      }

      this.key = key;
    }

    if (input.value !== undefined) {
      const value = input.value.trim();
      if (!value) {
        return Result.failure("Valor da parametrização é obrigatório");
      }

      this.value = value;
    }

    this.updatedAt = new Date();
    return Result.success(this);
  }
}
