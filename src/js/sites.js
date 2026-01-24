import {locateResource, requirePort, stripJcrContentPath} from './common/utils.js'
import {ASSETS_PATH, SITES_PATH, DAM_PATH, DEFAULT_PORT} from "./common/constants";

let pagePath = locateResource();
if (pagePath) {
  const sanitizedPath = stripJcrContentPath(pagePath)
  if (sanitizedPath.startsWith(DAM_PATH)) {
    window.open(requirePort(DEFAULT_PORT) + ASSETS_PATH + sanitizedPath.substring(0, sanitizedPath.lastIndexOf("/")));
  } else {
    window.open(requirePort(DEFAULT_PORT) + SITES_PATH + sanitizedPath);
  }
}