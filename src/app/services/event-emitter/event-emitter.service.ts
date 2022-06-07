import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  private eventEmitters: Map<string, EventEmitter<any>> = new Map();

  constructor() { }

  getEmitter(key: string) {
    if (!this.eventEmitters.has(key)) {
      this.eventEmitters.set(key, new EventEmitter<any>());
    }
    return this.eventEmitters.get(key);
  }

}
