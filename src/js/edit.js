import {locateResource, requirePort, stripJcrContentPath} from "./common/utils";
import {ASSETDETAILS_PATH, DEFAULT_PORT, EDITOR_PATH, DOT_HTML, CONTENT_PATH, DAM_PATH} from "./common/constants";

let pagePath = locateResource()
if (pagePath && pagePath !== CONTENT_PATH) {
  const sanitizedPath = stripJcrContentPath(pagePath)
  if (sanitizedPath.startsWith(DAM_PATH)) {
    window.open(requirePort(DEFAULT_PORT) + ASSETDETAILS_PATH + sanitizedPath)
  } else {
    window.open(requirePort(DEFAULT_PORT) + EDITOR_PATH + sanitizedPath + DOT_HTML )
  }
}
