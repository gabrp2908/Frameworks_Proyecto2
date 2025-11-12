import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeState } from '../../../services/time.service';

@Component({
  selector: 'app-sand-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sand-clock.component.html',
  styleUrls: ['./sand-clock.component.css']
})
export class SandClockComponent implements OnChanges {
  @Input() currentTime!: TimeState;

  flipFlags = { hours: false, minutes: false, seconds: false };

  getSafeHours(): number { 
    return this.currentTime?.hours || 0; 
  }

  getSafeMinutes(): number { 
    return this.currentTime?.minutes || 0; 
  }

  getSafeSeconds(): number { 
    return this.currentTime?.seconds || 0; 
  }

  getSandProgress(unit: 'hours' | 'minutes' | 'seconds'): number {
    switch (unit) {
      case 'hours': 
        return (this.getSafeHours() / 24) * 100;
      case 'minutes': 
        return (this.getSafeMinutes() / 60) * 100;
      case 'seconds': 
        return (this.getSafeSeconds() / 60) * 100;
      default: 
        return 0;
    }
  }

  getSandColor(unit: 'hours' | 'minutes' | 'seconds'): string {
    switch (unit) {
      case 'hours': return '#ff6b6b'; 
      case 'minutes': return '#29b6f6'; 
      case 'seconds': return '#ffd54f'; 
      default: return '#ffffff';
    }
  }

  getUnitLabel(unit: 'hours' | 'minutes' | 'seconds'): string {
    switch (unit) {
      case 'hours': return 'HORAS';
      case 'minutes': return 'MINUTOS';
      case 'seconds': return 'SEGUNDOS';
      default: return '';
    }
  }

  getMaxValue(unit: 'hours' | 'minutes' | 'seconds'): number {
    switch (unit) {
      case 'hours': return 24;
      case 'minutes': return 60;
      case 'seconds': return 60;
      default: return 0;
    }
  }

  getCurrentValue(unit: 'hours' | 'minutes' | 'seconds'): number {
    switch (unit) {
      case 'hours': return this.getSafeHours();
      case 'minutes': return this.getSafeMinutes();
      case 'seconds': return this.getSafeSeconds();
      default: return 0;
    }
  }

  getFormattedValue(value: number, unit: 'hours' | 'minutes' | 'seconds'): string {
    return unit === 'hours' 
      ? value.toString().padStart(2, '0')
      : value.toString().padStart(2, '0');
  }

  ngOnChanges(changes: SimpleChanges) {
  if (!changes['currentTime']) return;
  const prev: TimeState | undefined = changes['currentTime'].previousValue;
  const curr: TimeState | undefined = changes['currentTime'].currentValue;

    if (!prev || !curr) return;

    if (prev.seconds !== 0 && curr.seconds === 0) {
      this.triggerFlip('seconds');
    }
    if (prev.minutes !== 0 && curr.minutes === 0) {
      this.triggerFlip('minutes');
    }
    if (prev.hours !== 0 && curr.hours === 0) {
      this.triggerFlip('hours');
    }
  }

  private triggerFlip(unit: 'hours' | 'minutes' | 'seconds') {
    this.flipFlags[unit] = true;
    setTimeout(() => this.flipFlags[unit] = false, 700);
  }
}