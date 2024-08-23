import {locateResource, requirePort} from "./common/utils"
import {CONTENT_PATH, DEFAULT_PORT, DOT_HTML} from "./common/constants";

let pagePath = locateResource()
debugger
if( pagePath && pagePath !== CONTENT_PATH) window.open(requirePort(DEFAULT_PORT) + pagePath + DOT_HTML + '?wcmmode=disabled');
