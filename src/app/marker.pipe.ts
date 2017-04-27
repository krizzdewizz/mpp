import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'marker'
})
export class MarkerPipe implements PipeTransform {

  transform(secs: number, args?: any): any {
    const m = Math.floor(secs / 60)
    let s: any = Math.floor(secs % 60)
    if (s < 10) {
      s = '0' + s
    }
    return m + ':' + s
  }

}
