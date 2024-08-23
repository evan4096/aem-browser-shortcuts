import {locateResource, requirePort} from "./common/utils";
import {DEFAULT_PORT, PROPERTIES_PATH, METADATA_PATH, DAM_PATH, CONTENT_PATH} from "./common/constants";

let pagePath = locateResource();
if (pagePath && pagePath !== CONTENT_PATH) {
  if (pagePath.startsWith(DAM_PATH)) {
    window.open(requirePort(DEFAULT_PORT) + METADATA_PATH + "?_charset_=utf-8&item=" + pagePath);
  } else {
    window.open(requirePort(DEFAULT_PORT) + PROPERTIES_PATH + "?item=" + encodeURIComponent(pagePath))
  }
}