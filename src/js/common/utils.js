import {CRXDE_PATH, METADATA_PATH, JCR_CONTENT,PROPERTIES_PATH,SITES_PATH,EDITOR_PATH,ASSETDETAILS_PATH,ASSETS_PATH,CONTENT_PATH} from './constants'

export const locateResource = function () {

  const location = window.location.pathname
  const hash = window.location.hash
  const search = window.location.search

  if (location === CRXDE_PATH) {
    return hash.replace('#', '').replace(/\?.*$/, '').replace(new RegExp('/' + encodeURIComponent(JCR_CONTENT) + '.*$'), '')
  } else if (location === METADATA_PATH) {
    return search.replace(/^.*item=(.*)&?.*$/, '$1')
  } else if (location === PROPERTIES_PATH) {
    return decodeURIComponent(search.replace(/\?item=/, ''))
  } else if (location.startsWith(SITES_PATH)) {
    let resource = checkedResource()
    return resource ? resource : location.replace(SITES_PATH, '')
  } else if (location.startsWith(EDITOR_PATH)) {
    return chopHtml(location.replace(EDITOR_PATH, ''))
  } else if (location.startsWith(ASSETDETAILS_PATH)) {
    return location.replace(ASSETDETAILS_PATH, '')
  } else if (location.startsWith(ASSETS_PATH)) {
    let resource = checkedResource()
    return resource ? resource : location.replace(ASSETS_PATH, '')
  } else if (location.startsWith(CONTENT_PATH) && location != CONTENT_PATH) {
    return chopHtml(location)
  }
  return false
}

export const requirePort = function (requiredPort) {
  let port = window.location.port
  if (requiredPort && port !== requiredPort) {
    let fragment = requiredPort.length ? ":" + requiredPort : ""
    return window.location.protocol + "//" + window.location.hostname + fragment
  } else {
    return ''
  }
}
export const chopHtml = path => {
  return path.replace(/\.html$/, '')
}

function checkedResource(){
  let selection = document.querySelectorAll('.foundation-collection-item.foundation-selections-item.is-selected')
  if (selection.length > 0) {
    return selection[0].attributes['data-granite-collection-item-id'].nodeValue
  }
  return false
}