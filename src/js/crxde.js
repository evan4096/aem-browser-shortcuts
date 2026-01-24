import {locateResource, normalizeJcrContentEncoding, requirePort} from './common/utils';
import {
  CRXDE_PATH,
  CRXDE_PORT,
  DEFAULT_PORT,
  JCR_CONTENT
} from "./common/constants";

let pagePath = locateResource();
if (pagePath) {
  const normalizedPath = normalizeJcrContentEncoding(pagePath);
  const hasJcrContent = /\/jcr(?:%3A|:)content/i.test(normalizedPath);
  const suffix = hasJcrContent ? '' : '/' + encodeURIComponent(JCR_CONTENT);
  window.open(requirePort(DEFAULT_PORT) + CRXDE_PATH + '#' + normalizedPath + suffix);
}
