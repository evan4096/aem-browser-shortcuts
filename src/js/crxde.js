import {locateResource, requirePort} from './common/utils';
import {CRXDE_PATH, CRXDE_PORT, JCR_CONTENT} from "./common/constants";

let pagePath = locateResource();
if( pagePath ) window.open(requirePort(CRXDE_PORT) + CRXDE_PATH + '#' + pagePath + '/' + encodeURIComponent(JCR_CONTENT));
