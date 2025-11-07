import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeState } from '../../../services/time.service';

@Component({
  selector: 'app-bars-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bars-clock.component.html',
  styleUrls: ['./bars-clock.component.css']
})
export class BarsClockComponent {
  @Input() currentTime!: TimeState;

  getSafeHours(): number { 
    return this.currentTime?.hours || 0; 
  }

  getSafeMinutes(): number { 
    return this.currentTime?.minutes || 0; 
  }

  getSafeSeconds(): number { 
    return this.currentTime?.seconds || 0; 
  }

  getBarProgress(unit: 'hours' | 'minutes' | 'seconds'): number {
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

  getBarColor(unit: 'hours' | 'minutes' | 'seconds'): string {
    const progress = this.getBarProgress(unit);
    
    if (progress < 25) return '#ff6b6b';
    if (progress < 50) return '#ffa726'; 
    if (progress < 75) return '#29b6f6'; 
    return '#66bb6a'; 
  }

  getBarAnimationDelay(unit: 'hours' | 'minutes' | 'seconds'): string {
    switch (unit) {
      case 'hours': return '0s';
      case 'minutes': return '0.1s';
      case 'seconds': return '0.2s';
      default: return '0s';
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

  getMarks(unit: 'hours' | 'minutes' | 'seconds'): { position: number }[] {
    const maxValue = this.getMaxValue(unit);
    const marks = [];
    
    for (let i = 1; i < 4; i++) {
      marks.push({
        position: (i * 25)
      });
    }
    
    return marks;
  }
}