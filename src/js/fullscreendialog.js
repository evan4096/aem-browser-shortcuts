import { locateOpenDialogInfo, constructFullScreenDialogUrl, requirePort } from "./common/utils";
import { DEFAULT_PORT } from "./common/constants";

const info = locateOpenDialogInfo();
if (info && info.resource && info.resourceType) {
  const url = constructFullScreenDialogUrl(info.resource, info.resourceType);
  if (url) {
    window.open(requirePort(DEFAULT_PORT) + url);
  }
}
