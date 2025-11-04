import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TimeState {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private timeOffset = 0;
  private timeSubject = new BehaviorSubject<TimeState>(this.getCurrentTimeState());
  
  constructor() {
    this.startTimeUpdates();
  }

  private startTimeUpdates(): void {
    setInterval(() => {
      this.timeSubject.next(this.getCurrentTimeState());
    }, 1000);
  }

  private getCurrentTimeState(): TimeState {
    const now = new Date();
    now.setSeconds(now.getSeconds() + this.timeOffset);
    
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      totalSeconds: now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds(),
      date: now
    };
  }

  setTimeOffset(offset: number): void {
    this.timeOffset = offset;
    this.timeSubject.next(this.getCurrentTimeState());
  }

  getTimeOffset(): number {
    return this.timeOffset;
  }

  getTime(): Observable<TimeState> {
    return this.timeSubject.asObservable();
  }

  getCurrentTime(): TimeState {
    return this.getCurrentTimeState();
  }
}