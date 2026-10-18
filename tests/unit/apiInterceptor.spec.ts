import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

describe("api response interceptor 401", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("auth_token", "token-fake");
    vi.resetModules();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("remove auth_token do localStorage em resposta 401", async () => {
    const api = (await import("../../src/api/main")).default;
    const errorHandlers = (api.interceptors.response as unknown as {
      handlers: Array<{
        rejected?: (error: AxiosError) => Promise<unknown>;
      }>;
    }).handlers;

    const rejected = errorHandlers.find((h) => h.rejected)?.rejected;
    expect(rejected).toBeTypeOf("function");

    const error = {
      response: { status: 401 },
      config: {} as InternalAxiosRequestConfig,
      isAxiosError: true,
      name: "AxiosError",
      message: "Unauthorized",
      toJSON: () => ({}),
    } as AxiosError;

    await expect(rejected!(error)).rejects.toBe(error);
    expect(localStorage.getItem("auth_token")).toBeNull();
  });

  it("não remove auth_token em outros status", async () => {
    const api = (await import("../../src/api/main")).default;
    const errorHandlers = (api.interceptors.response as unknown as {
      handlers: Array<{
        rejected?: (error: AxiosError) => Promise<unknown>;
      }>;
    }).handlers;

    const rejected = errorHandlers.find((h) => h.rejected)?.rejected;
    const error = {
      response: { status: 500 },
      config: {} as InternalAxiosRequestConfig,
      isAxiosError: true,
      name: "AxiosError",
      message: "Server Error",
      toJSON: () => ({}),
    } as AxiosError;

    await expect(rejected!(error)).rejects.toBe(error);
    expect(localStorage.getItem("auth_token")).toBe("token-fake");
  });
});
