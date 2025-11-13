import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeState } from '../../../services/time.service';

@Component({
  selector: 'app-digital-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './digital-clock.component.html',
  styleUrls: ['./digital-clock.component.css']
})
export class DigitalClockComponent {
  @Input() currentTime!: TimeState;

  // Mapa de segmentos encendidos para cada número 0-9
  // Segmentos: a,b,c,d,e,f,g (en orden)
  segmentMap: { [key: number]: string[] } = {
    0: ['a', 'b', 'c', 'd', 'e', 'f'],
    1: ['b', 'c'],
    2: ['a', 'b', 'g', 'e', 'd'],
    3: ['a', 'b', 'g', 'c', 'd'],
    4: ['f', 'g', 'b', 'c'],
    5: ['a', 'f', 'g', 'c', 'd'],
    6: ['a', 'f', 'e', 'd', 'c', 'g'],
    7: ['a', 'b', 'c'],
    8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    9: ['a', 'b', 'c', 'd', 'f', 'g']
  };

  getSafeHours(): number {
    return this.currentTime?.hours || 0;
  }

  getSafeMinutes(): number {
    return this.currentTime?.minutes || 0;
  }

  getSafeSeconds(): number {
    return this.currentTime?.seconds || 0;
  }

  // Devuelve los dígitos como arrays para display (2 dígitos para horas, minutos, segundos)
  getDigits(num: number): number[] {
    return num < 10 ? [0, num] : [Math.floor(num / 10), num % 10];
  }

  // Determina si un segmento está encendido para el dígito dado
  isSegmentOn(digit: number, segment: string): boolean {
    const on = this.segmentMap[digit] || [];
    return on.includes(segment);
  }
}
