import {
  CRXDE_PATH,
  METADATA_PATH,
  JCR_CONTENT,
  PROPERTIES_PATH,
  SITES_PATH,
  EDITOR_PATH,
  ASSETDETAILS_PATH,
  ASSETS_PATH,
  CONTENT_PATH,
  DAM_PATH,
  DIALOG_PATH,
  JCR_CONTENT_NAMESPACE_MANGLING
} from './constants'

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
  } else if (location.includes(DIALOG_PATH)) {
    const dialogIndex = location.indexOf(DIALOG_PATH)
    const afterDialog = location.substring(dialogIndex + DIALOG_PATH.length)
    return stripHtmlAndSelectors(extractPageResource(afterDialog))
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
  } else if (location.startsWith(CONTENT_PATH) && location !== CONTENT_PATH) {
    return stripHtmlAndSelectors(location)
  }
  return false
}

export const locateFullResource = function () {
  const location = window.location.pathname

  if (location.includes(DIALOG_PATH)) {
    const dialogIndex = location.indexOf(DIALOG_PATH)
    const afterDialog = location.substring(dialogIndex + DIALOG_PATH.length)
    return stripHtmlAndSelectors(afterDialog)
  }

  if (location.startsWith(EDITOR_PATH)) {
    const dialogResource = locateOpenDialogResource()
    if (dialogResource) {
      return dialogResource
    }
  }

  return locateResource()
}

/**
 * When a component dialog is open inside the AEM editor, the DOM contains an
 * open `<coral-dialog>` with a nested `<form>`. That form's `action` attribute
 * points at the edited resource (e.g.
 * `/content/site/page/jcr:content/par/component`). Return that resource path,
 * or `false` when no open dialog/form is present.
 */
export const locateOpenDialogResource = function () {
  if (typeof document === 'undefined') return false

  const dialogs = document.querySelectorAll('coral-dialog')
  for (const dialog of dialogs) {
    if (!isDialogOpen(dialog)) continue

    const form = dialog.querySelector('form')
    const action = form && form.getAttribute('action')
    if (!action) continue

    const resource = extractActionResource(action)
    if (resource) return resource
  }

  return false
}

function isDialogOpen(dialog) {
  if (!dialog) return false
  // Coral dialogs expose an `open` property/attribute when visible. Fall back
  // to checking visibility for non-Coral or partially-upgraded elements.
  if (dialog.open === true || dialog.hasAttribute('open')) return true
  if (dialog.open === false) return false
  return dialog.offsetParent !== null
}

function extractActionResource(action) {
  if (!action || typeof action !== 'string') return false

  let path
  try {
    path = new URL(action, window.location.href).pathname
  } catch (error) {
    path = action.replace(/^https?:\/\/[^/]+/, '').replace(/\?.*$/, '').replace(/#.*$/, '')
  }

  const contentIndex = path.indexOf(CONTENT_PATH + '/')
  if (contentIndex === -1) return false

  return path.substring(contentIndex).replace("\/_jcr_content/g", "/jcr%3Acontent/")
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
  const mangledMarker = '/' + JCR_CONTENT_NAMESPACE_MANGLING
  const encodedMarker = '/' + encodeURIComponent(JCR_CONTENT)
  const encodedRegex = new RegExp('(%2F|/)+jcr%3Acontent', 'ig')
  return path
    .replace(encodedRegex, encodedMarker)
    .replace(decodedMarker, encodedMarker)
    .replace(mangledMarker, encodedMarker)
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

function extractPageResource(path) {
  if (!path || typeof path !== 'string') return path
  
  const contentIndex = path.indexOf('/content/')
  if (contentIndex === -1) return path
  
  const afterContent = path.substring(contentIndex)
  const jcrContentIndex = afterContent.indexOf('/' + JCR_CONTENT)
  
  if (jcrContentIndex === -1) return afterContent
  
  return afterContent.substring(0, jcrContentIndex)
}

export const constructDialogUrl = function (resourcePath, resourceType) {
  if (!resourcePath || !resourceType) return null
  
  const dialogPath = `/mnt/override/apps/${resourceType}/_cq_dialog.html`
  return dialogPath + resourcePath
}

/**
 * Like `locateOpenDialogResource` but returns both the resource path and the
 * resourceType extracted from the dialog form's `action` query string.
 * Returns `{ resource, resourceType }` or `false` when no suitable open dialog
 * is found.
 */
export const locateOpenDialogInfo = function () {
  if (typeof document === 'undefined') return false

  const dialogs = document.querySelectorAll('coral-dialog')
  for (const dialog of dialogs) {
    if (!isDialogOpen(dialog)) continue

    const form = dialog.querySelector('form')
    const action = form && form.getAttribute('action')
    if (!action) continue

    const resource = extractActionResource(action)
    if (!resource) continue

    let resourceType = null
    try {
      resourceType = new URL(action, window.location.href).searchParams.get('resourceType')
    } catch (e) {
      const match = action.match(/[?&]resourceType=([^&]+)/)
      if (match) resourceType = decodeURIComponent(match[1])
    }
    if (!resourceType) {
      const resourceTypeInput = form.querySelector('input[name="./sling:resourceType"]')
      if (resourceTypeInput) resourceType = resourceTypeInput.value
    }

    if (resource && resourceType) {
      return { resource, resourceType }
    }
  }

  return false
}

export const constructFullScreenDialogUrl = function (resourcePath, resourceType) {
  const base = constructDialogUrl(resourcePath, resourceType)
  if (!base) return null
  return base + '?page=true&resourceType=' + encodeURIComponent(resourceType)
}

/**
 * When a component is selected/highlighted in the AEM page editor but no
 * dialog is open yet, AEM renders an `#EditableToolbar` with a `data-path`
 * pointing at the selected component's JCR path. Fetch that node's `.json`
 * to read `sling:resourceType`, then return `{ resource, resourceType }`.
 * Returns `false` when no component is selected or the fetch fails.
 */
export const locateSelectedEditorComponentInfo = async function () {
  if (typeof document === 'undefined') return false

  const toolbar = document.querySelector('#EditableToolbar button[data-path]')
  const path = toolbar && toolbar.dataset && toolbar.dataset.path
  if (!path || path.indexOf(CONTENT_PATH + '/') === -1) return false

  try {
    const response = await fetch(path + '.json')
    if (!response.ok) return false
    const data = await response.json()
    const resourceType = data['sling:resourceType']
    if (!resourceType) return false
    return { resource: path, resourceType }
  } catch (e) {
    return false
  }
}