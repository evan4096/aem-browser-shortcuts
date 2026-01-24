import { locateResource, normalizeJcrContentEncoding, requirePort } from "./common/utils";
import { CONTENT_PATH, CRXDE_PATH, DEFAULT_PORT } from "./common/constants";

const locationPath = window.location.pathname;
let pagePath = locateResource();

if (locationPath === CRXDE_PATH) {
  const hash = window.location.hash || "";
  const rawPath = hash.replace(/^#/, "").replace(/\?.*$/, "");
  if (rawPath) {
    pagePath = decodeURIComponent(rawPath);
  }
}
if (pagePath && pagePath !== CONTENT_PATH) {
  const normalizedPath = normalizeJcrContentEncoding(pagePath);
  window.open(requirePort(DEFAULT_PORT) + normalizedPath + ".model.json");
}
