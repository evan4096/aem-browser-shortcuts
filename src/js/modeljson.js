import {
  constructFullScreenDialogUrl,
  locateFullResource,
  locateOpenDialogInfo, locateSelectedEditorComponentInfo,
  normalizeJcrContentEncoding,
  requirePort
} from "./common/utils";
import { CONTENT_PATH, CRXDE_PATH, DEFAULT_PORT } from "./common/constants";

/* check if coming from editor with full resource identified */
const info = locateOpenDialogInfo() || await locateSelectedEditorComponentInfo();
let pagePath;
if (info && info.resource) {
  pagePath = info.resource;
} else {
  pagePath = locateFullResource();
}

/* check if coming from crx/de */
const locationPath = window.location.pathname;
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
