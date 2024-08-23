import {locateResource, requirePort} from './common/utils.js'
import {ASSETS_PATH, SITES_PATH, DAM_PATH, DEFAULT_PORT} from "./common/constants";

let pagePath = locateResource();
if (pagePath) {
  if (pagePath.startsWith(DAM_PATH)) {
    debugger
    window.open(requirePort(DEFAULT_PORT) + ASSETS_PATH + pagePath.substring(0, pagePath.lastIndexOf("/")));
  } else {
    window.open(requirePort(DEFAULT_PORT) + SITES_PATH + pagePath);
  }
}