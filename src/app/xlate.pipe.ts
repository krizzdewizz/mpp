import { Pipe, PipeTransform } from '@angular/core'

// data

const DEFAULT = {
  SPACE: 'space',
  RETURN: 'return',
  BACKSPACE: 'backspace',
  PLAY_PAUSE: 'play/pause',
  SEEK_TO_START: 'seek to start',
  BACKWARD_FORWARD: 'backward/forward',
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
  BACKWARD_FORWARD: 'vorwärts/rückwärts',
  ADD_MARKER: 'marker hinzufügen',
  SEEK_TO_MARKER: 'zum marker springen',
  SEEK_TO_ACTIVE_MARKER: 'zum aktiven marker springen',
  MOVE_ACTIVE_MARKER: 'aktiven marker verschieben',
  DELETE_MARKER: 'marker löschen',
  ADD_TRACK: 'track hinzufügen',
  ADD_TRACK_MORE: 'track hinzufügen...',
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


@Pipe({
  name: 'xlate'
})
export class XlatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return GERMAN[value]
  }
}
