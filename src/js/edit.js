import {locateResource, requirePort} from "./common/utils";
import {ASSETDETAILS_PATH, DEFAULT_PORT, EDITOR_PATH, DOT_HTML, CONTENT_PATH, DAM_PATH} from "./common/constants";

let pagePath = locateResource()
if( pagePath && pagePath !== CONTENT_PATH)
  if(pagePath.startsWith(DAM_PATH)) {
    window.open(requirePort(DEFAULT_PORT) + ASSETDETAILS_PATH + pagePath)
  } else {
    window.open(requirePort(DEFAULT_PORT) + EDITOR_PATH + pagePath + DOT_HTML )
  }
