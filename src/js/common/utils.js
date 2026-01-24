import {CRXDE_PATH, METADATA_PATH, JCR_CONTENT,PROPERTIES_PATH,SITES_PATH,EDITOR_PATH,ASSETDETAILS_PATH,ASSETS_PATH,CONTENT_PATH, DAM_PATH} from './constants'

export const locateResource = function () {

  const location = window.location.pathname
  const hash = window.location.hash
  const search = window.location.search

  if (location === CRXDE_PATH) {
    return stripHtmlAndSelectors(hash.replace('#', '').replace(/\?.*$/, '').replace(new RegExp('/' + encodeURIComponent(JCR_CONTENT) + '.*$'), ''))
  } else if (location === METADATA_PATH) {
    return search.replace(/^.*item=(.*)&?.*$/, '$1')
  } else if (location === PROPERTIES_PATH) {
    return decodeURIComponent(search.replace(/\?item=/, ''))
  } else if (location.startsWith(SITES_PATH)) {
    let resource = checkedResource()
    return resource ? stripHtmlAndSelectors(resource) : stripHtmlAndSelectors(location.replace(SITES_PATH, ''))
  } else if (location.startsWith(EDITOR_PATH)) {
    return stripHtmlAndSelectors(location.replace(EDITOR_PATH, ''))
  } else if (location.startsWith(ASSETDETAILS_PATH)) {
    return location.replace(ASSETDETAILS_PATH, '')
  } else if (location.startsWith(ASSETS_PATH)) {
    let resource = checkedResource()
    return resource ? stripHtmlAndSelectors(resource) : stripHtmlAndSelectors(location.replace(ASSETS_PATH, ''))
  } else if (location.startsWith(CONTENT_PATH) && location != CONTENT_PATH) {
    return stripHtmlAndSelectors(location)
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

export const stripJcrContentPath = function (path) {
  if (!path || typeof path !== 'string') return path

  const decodedPath = safeDecodePath(path)
  const marker = '/' + JCR_CONTENT
  const decodedIndex = decodedPath.indexOf(marker)
  if (decodedIndex === -1) return path

  const encodedMarker = encodeURIComponent(marker)
  const encodedIndex = path.indexOf(encodedMarker)
  if (encodedIndex !== -1) return path.substring(0, encodedIndex)

  const rawIndex = path.indexOf(marker)
  if (rawIndex !== -1) return path.substring(0, rawIndex)

  return path.substring(0, decodedIndex)
}

export const normalizeJcrContentEncoding = function (path) {
  if (!path || typeof path !== 'string') return path
  const decodedMarker = '/' + JCR_CONTENT
  const encodedMarker = '/' + encodeURIComponent(JCR_CONTENT)
  const encodedRegex = new RegExp('(%2F|/)+jcr%3Acontent', 'ig')
  return path
    .replace(encodedRegex, encodedMarker)
    .replace(decodedMarker, encodedMarker)
}

function safeDecodePath(path) {
  try {
    return decodeURIComponent(path)
  } catch (error) {
    return path
  }
}
export const chopHtml = path => {
  return path.replace(/\.html$/, '')
}

/**
 * For AEM page URLs like `/content/foo/page.print.a4.html` (or with suffix),
 * return the underlying resource path `/content/foo/page`.
 *
 * This intentionally only normalizes `.html` page URLs and avoids touching DAM
 * assets like `/content/dam/.../image.png`.
 */
function stripHtmlAndSelectors(path) {
  if (!path || typeof path !== 'string') return path

  const modelJsonSuffix = '.model.json'
  if (path.endsWith(modelJsonSuffix)) {
    return path.slice(0, -modelJsonSuffix.length)
  }
  if (path.startsWith(DAM_PATH)) return path

  // Drop `.html` and any suffix after it (e.g. `.html/suffix/...`)
  const htmlIndex = path.indexOf('.html')
  if (htmlIndex === -1) return path

  const base = path.substring(0, htmlIndex)
  const lastSlash = base.lastIndexOf('/')
  if (lastSlash === -1) return base

  const lastSegment = base.substring(lastSlash + 1)
  const withoutSelectors = lastSegment.split('.')[0]
  return base.substring(0, lastSlash + 1) + withoutSelectors
}

function checkedResource(){
  let selection = document.querySelectorAll('.foundation-collection-item.foundation-selections-item.is-selected')
  if (selection.length > 0) {
    return selection[0].attributes['data-granite-collection-item-id'].nodeValue
  }
  return false
}