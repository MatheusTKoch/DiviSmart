import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAuthToken,
  readAuthToken,
  verifyAuthToken,
} from "../../src/auth/token.js";

describe("auth token helpers", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-session-secret";
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-01T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    delete process.env.SESSION_SECRET;
  });

  it("cria e valida um token HMAC válido", () => {
    const token = createAuthToken({
      userId: 42,
      isDemo: false,
      canLogout: true,
      carteiraId: 7,
    });

    const data = verifyAuthToken(token);
    expect(data).toMatchObject({
      userId: 42,
      isDemo: false,
      canLogout: true,
      carteiraId: 7,
    });
    expect(data!.exp).toBeGreaterThan(Date.now());
  });

  it("readAuthToken lê o Bearer do request", () => {
    const token = createAuthToken({ userId: 1 });
    const req = {
      get: (header: string) =>
        header === "Authorization" ? `Bearer ${token}` : undefined,
    };

    expect(readAuthToken(req)).toMatchObject({ userId: 1 });
  });

  it("rejeita token com assinatura inválida", () => {
    const token = createAuthToken({ userId: 1 });
    const [payload] = token.split(".");
    expect(verifyAuthToken(`${payload}.assinatura-invalida`)).toBeNull();
  });

  it("rejeita token malformado", () => {
    expect(verifyAuthToken("sem-ponto")).toBeNull();
    expect(verifyAuthToken("")).toBeNull();
    expect(verifyAuthToken(null as unknown as string)).toBeNull();
  });

  it("rejeita token expirado", () => {
    const token = createAuthToken({ userId: 9, maxAge: 1000 });
    vi.advanceTimersByTime(1001);
    expect(verifyAuthToken(token)).toBeNull();
  });

  it("rejeita Authorization sem Bearer", () => {
    const token = createAuthToken({ userId: 1 });
    const req = {
      get: () => token,
    };
    expect(readAuthToken(req)).toBeNull();
  });
});
