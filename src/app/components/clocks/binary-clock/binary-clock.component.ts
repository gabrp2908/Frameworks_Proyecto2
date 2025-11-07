import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeState } from '../../../services/time.service';

@Component({
  selector: 'app-binary-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './binary-clock.component.html',
  styleUrls: ['./binary-clock.component.css']
})
export class BinaryClockComponent {
  @Input() currentTime!: TimeState;

  toBinary(num: number, digits: number): string {
    return num.toString(2).padStart(digits, '0');
  }

  getSafeHours(): number { return this.currentTime?.hours || 0; }
  getSafeMinutes(): number { return this.currentTime?.minutes || 0; }
  getSafeSeconds(): number { return this.currentTime?.seconds || 0; }
}