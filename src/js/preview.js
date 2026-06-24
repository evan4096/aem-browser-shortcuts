import {locateResource, requirePort, stripJcrContentPath} from "./common/utils"
import {CONTENT_PATH, DEFAULT_PORT, DOT_HTML} from "./common/constants";

let pagePath = locateResource()
if (pagePath && pagePath !== CONTENT_PATH) {
  const sanitizedPath = stripJcrContentPath(pagePath)
  window.open(requirePort(DEFAULT_PORT) + sanitizedPath + DOT_HTML + '?wcmmode=disabled');
}
