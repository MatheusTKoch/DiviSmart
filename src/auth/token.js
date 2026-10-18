import crypto from "crypto";

export const AUTH_TOKEN_MAX_AGE = 10 * 3600000;

const encodeTokenPart = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

export const createAuthToken = ({
  userId,
  isDemo = false,
  canLogout = true,
  carteiraId = null,
  maxAge = AUTH_TOKEN_MAX_AGE,
}) => {
  const payload = encodeTokenPart({
    userId,
    isDemo,
    canLogout,
    carteiraId,
    exp: Date.now() + maxAge,
  });
  const signature = crypto
    .createHmac("sha256", process.env.SESSION_SECRET)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
};

export const verifyAuthToken = (token) => {
  if (!token || typeof token !== "string") return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
};

export const readAuthToken = (req) => {
  const authorization = req.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) return null;
  return verifyAuthToken(authorization.slice(7));
};
