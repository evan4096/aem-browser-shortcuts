import {
  locateFullResource,
  locateOpenDialogInfo, locateSelectedEditorComponentInfo,
  normalizeJcrContentEncoding,
  requirePort
} from './common/utils';
import {
  DEFAULT_PORT,
  REPOBROWSER_PATH
} from "./common/constants";

/* check if coming from editor with full resource identified */
const info = locateOpenDialogInfo() || await locateSelectedEditorComponentInfo();
let pagePath;
if (info && info.resource) {
  pagePath = info.resource;
} else {
  pagePath = locateFullResource();
}

if (pagePath) {
  const normalizedPath = normalizeJcrContentEncoding(pagePath);
  window.open(requirePort(DEFAULT_PORT) + REPOBROWSER_PATH + '#' + normalizedPath);
}
