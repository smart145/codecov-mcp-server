import { URL } from "node:url";

const DEFAULT_CODECOV_API_BASE_URL = "https://api.codecov.io/api/v2";

function normalizeCodecovApiHostnameToBaseUrl(hostname: string): string {
  const raw = hostname.trim();
  if (!raw) return DEFAULT_CODECOV_API_BASE_URL;

  // Accept hostnames with or without scheme; default to https.
  const withScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(raw)
    ? raw
    : `https://${raw}`;

  const url = new URL(withScheme);

  // Force API v2 base path for hostname-style configuration.
  url.pathname = "/api/v2";
  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/+$/, "");
}

function normalizeCodecovApiBaseUrl(value: string): string {
  const raw = value.trim();
  if (!raw) return DEFAULT_CODECOV_API_BASE_URL;

  // Accept either:
  // - full base URL: https://codecov.example.com/api/v2
  // - bare host:     codecov.example.com
  // If no scheme is provided, assume https.
  const withScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(raw)
    ? raw
    : `https://${raw}`;

  const url = new URL(withScheme);

  // If user only provided a host (or root path), default to Codecov API v2 path.
  const trimmedPath = url.pathname.replace(/\/+$/, "");
  if (trimmedPath === "" || trimmedPath === "/") {
    url.pathname = "/api/v2";
  } else {
    url.pathname = trimmedPath;
  }

  // Ensure we don't carry query/hash in the base URL.
  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/+$/, "");
}

const baseUrlFromEnv =
  process.env.CODECOV_API_BASE_URL?.trim() ||
  (process.env.CODECOV_API_HOSTNAME
    ? normalizeCodecovApiHostnameToBaseUrl(process.env.CODECOV_API_HOSTNAME)
    : DEFAULT_CODECOV_API_BASE_URL);

export const CODECOV_API_BASE_URL = normalizeCodecovApiBaseUrl(baseUrlFromEnv);

export const DEFAULT_SERVICE = "github";

export const VALID_SERVICES = ["github", "gitlab", "bitbucket"] as const;

export type Service = (typeof VALID_SERVICES)[number];

export const DEFAULT_PAGE_SIZE = 25;

export const MAX_PAGE_SIZE = 100;

export const DEFAULT_PORT = 3000;
