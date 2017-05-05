import { Pipe, PipeTransform } from '@angular/core'

// data

const DEFAULT = {
  SPACE: 'space',
  RETURN: 'return',
  BACKSPACE: 'backspace',
  PLAY_PAUSE: 'play/pause',
  SEEK_TO_START: 'seek to start',
  BACKWARD: 'backward',
  FORWARD: 'forward',
  ADD_MARKER: 'add marker',
  SEEK_TO_MARKER: 'seek to marker',
  SEEK_TO_ACTIVE_MARKER: 'seek to active marker',
  MOVE_ACTIVE_MARKER: 'move active marker',
  DELETE_MARKER: 'delete marker',
  ADD_TRACK: 'add track',
  ADD_TRACK_MORE: 'add track...',
  EDIT_TRACK: 'edit track',
  DELETE_TRACK: 'delete track',
  SELECT_TRACK: 'select track...',
  ADD: 'add',
  OK: 'ok',
  CANCEL: 'cancel',
  NAME: 'name',
  YT_URL: 'YouTube video url',
  GOTO_YT: 'goto YouTube',
  TRACK: 'track',
  LYRICS_URL: 'lyrics url',
  TABS_URL: 'tabs url',
  LYRICS: 'lyrics',
  TABS: 'tabs',
  MORE_LINKS: 'more links',
  SEARCH: 'search',
  URL_FORMAT: 'format: [title1=]url1[MPP[title2=]url2]...'
}

const GERMAN = {
  SPACE: 'leertaste',
  RETURN: 'eingabetaste',
  BACKSPACE: 'rücktaste',
  PLAY_PAUSE: 'play/pause',
  SEEK_TO_START: 'zum anfang springen',
  BACKWARD: 'rückwärts',
  FORWARD: 'vorwärts',
  ADD_MARKER: 'marker hinzufügen',
  SEEK_TO_MARKER: 'zum marker springen',
  SEEK_TO_ACTIVE_MARKER: 'zum aktiven marker springen',
  MOVE_ACTIVE_MARKER: 'aktiven marker verschieben',
  DELETE_MARKER: 'marker löschen',
  ADD_TRACK: 'track hinzufügen',
  ADD_TRACK_MORE: 'track hinzufügen...',
  GOTO_YT: 'gehe zu YouTube',
  EDIT_TRACK: 'track bearbeiten',
  DELETE_TRACK: 'track löschen',
  SELECT_TRACK: 'track auswählen...',
  ADD: 'hinzufügen',
  OK: 'ok',
  CANCEL: 'abbrechen',
  NAME: 'name',
  YT_URL: 'YouTube video url',
  TRACK: 'track',
  LYRICS_URL: 'liedtext url',
  TABS_URL: 'noten url',
  LYRICS: 'liedtext',
  TABS: 'noten',
  MORE_LINKS: 'mehr links',
  SEARCH: 'suchen',
  URL_FORMAT: 'format: [titel1=]url1[MPP[titel2=]url2]...'
}

// end data

const FALLBACK_LANG = 'en'
const SUPPORTED_LANGS = {
  en: DEFAULT,
  de: GERMAN
}
let cachedLang: string

function getLang(): string {

  if (cachedLang) {
    return cachedLang
  }

  let lang: string
  const nav = <NavigatorExt>window.navigator

  if (nav.languages) {
    lang = firstSupported(nav.languages)
  }

  if (!lang) {
    lang = firstSupported([nav.userLanguage || nav.language])
  }
  if (!lang) {
    lang = FALLBACK_LANG
  }
  cachedLang = lang
  return lang
}

function firstSupported(languages: string[]): string {
  let first: string
  const n = languages.length
  for (let i = 0; i < n && !first; i++) {
    first = isSupported(languages[i])
  }
  return first
}

function isSupported(lang: string): string {
  const langKey = lang.toLowerCase().substr(0, 2)
  return SUPPORTED_LANGS[langKey] ? langKey : undefined
}

interface NavigatorExt extends Navigator {
  languages?: string[]
  userLanguage: string
  browserLanguage: string
  systemLanguage: string
}

@Pipe({
  name: 'xlate'
})
export class XlatePipe implements PipeTransform {

  transform(k: any, args?: any): any {
    const lcl = SUPPORTED_LANGS[getLang()]
    return lcl[k] || DEFAULT[k] || k
    //return lcl[k] || k;
  }
}
