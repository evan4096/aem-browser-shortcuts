import {
  locateFullResource,
  locateOpenDialogInfo, locateSelectedEditorComponentInfo,
  normalizeJcrContentEncoding,
  requirePort
} from './common/utils';
import {
  CRXDE_PATH,
  DEFAULT_PORT,
  JCR_CONTENT
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
  console.error(pagePath + " <=> " + normalizeJcrContentEncoding(pagePath))

  //const hasJcrContent = /\/jcr(?:%3A|:)content/i.test(normalizedPath);
  //const suffix = hasJcrContent ? '' : '/' + encodeURIComponent(JCR_CONTENT);
  //window.open(requirePort(DEFAULT_PORT) + CRXDE_PATH + '#' + normalizedPath + suffix);
  window.open(requirePort(DEFAULT_PORT) + CRXDE_PATH + '#' + normalizedPath);
}
