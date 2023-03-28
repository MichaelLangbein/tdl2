import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToTimestring'
})
export class SecondsToTimestringPipe implements PipeTransform {

  transform(seconds: number | undefined, ...args: unknown[]): string {
    if (!seconds) return '';
    return secondsToTimestring(seconds);
  }

}

export function secondsToTimestring(seconds: number) {
  const m = Math.floor(seconds / 60) % 60;
  const h = Math.floor(seconds / (60 * 60)) % 24;
  const d = Math.floor(seconds / (24 * 60 * 60));
  return `${d} days ${h} hours ${m} minutes`;
}