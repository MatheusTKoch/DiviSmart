import axios from "axios";

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "pt-BR,pt;q=0.9",
};

/**
 * Fetches HTML decoding the body as ISO-8859-1 (latin1).
 * Fundamentus and similar Brazilian sources serve Latin-1; axios UTF-8 decode
 * corrupts accents (e.g. ITAÚSA → ITASA / replacement chars).
 */
export async function fetchHtmlLatin1(url, options = {}) {
  const { timeout = 15000, headers = {} } = options;

  const res = await axios.get(url, {
    responseType: "arraybuffer",
    timeout,
    headers: { ...DEFAULT_HEADERS, ...headers },
  });

  return Buffer.from(res.data).toString("latin1");
}
