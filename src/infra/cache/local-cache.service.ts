import { Injectable } from "@nestjs/common";

type CacheEntry = {
  value: unknown;
  expiresAt?: number;
};

@Injectable()
export class LocalCacheService {
  private readonly entries: Record<string, CacheEntry> = {};

  get<T>(key: string): T | null {
    const entry = this.entries[key];
    if (!entry) return null;

    if (entry.expiresAt && Date.now() >= entry.expiresAt) {
      delete this.entries[key];
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, options?: { expiresAt?: number }) {
    this.entries[key] = { value, expiresAt: options?.expiresAt };
  }

  delete(key: string) {
    delete this.entries[key];
  }
}
