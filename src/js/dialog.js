import { locateFullResource, constructDialogUrl, requirePort } from "./common/utils";
import { CONTENT_PATH, CRXDE_PATH, DEFAULT_PORT } from "./common/constants";

const locationPath = window.location.pathname;
let resourcePath = locateFullResource();
let resourceType = null;

if (locationPath === CRXDE_PATH) {
  const hash = window.location.hash || "";
  const rawPath = hash.replace(/^#/, "").replace(/\?.*$/, "");
  if (rawPath) {
    resourcePath = decodeURIComponent(rawPath);
  }
}

if (resourcePath && resourcePath !== CONTENT_PATH) {
  const url = new URL(window.location.href);
  resourceType = url.searchParams.get("resourceType");
  
  if (resourceType) {
    const dialogUrl = constructDialogUrl(resourcePath, resourceType);
    if (dialogUrl) {
      window.open(requirePort(DEFAULT_PORT) + dialogUrl);
    }
  }
}
