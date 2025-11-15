import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeState } from '../../../services/time.service';

@Component({
  selector: 'app-cube-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cube-clock.component.html',
  styleUrls: ['./cube-clock.component.css']
})
export class CubeClockComponent implements OnChanges {
  @Input() currentTime!: TimeState;

  rotationHours: number = 0;
  rotationMinutes: number = 0;
  rotationSeconds: number = 0;

  lastHour: number = -1;
  lastMinute: number = -1;
  lastSecond: number = -1;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentTime']) {
      const time = changes['currentTime'].currentValue;
      
      // Solo rotar cuando el valor realmente cambia
      if (time.hours !== this.lastHour) {
        this.rotationHours += 90;
        this.lastHour = time.hours;
      }
      if (time.minutes !== this.lastMinute) {
        this.rotationMinutes += 90;
        this.lastMinute = time.minutes;
      }
      if (time.seconds !== this.lastSecond) {
        this.rotationSeconds += 90;
        this.lastSecond = time.seconds;
      }
    }
  }

  formatNumber(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }

  // Para ciclo de 4 caras (frontal + derecha + posterior + izquierda)
  getHourFaceValue(faceOffset: number): string {
    const currentHour = this.currentTime.hours;
    const faceIndex = Math.floor((this.rotationHours / 90 + faceOffset) % 4);
    
    // Calcular el valor basado en la cara actual
    let value;
    switch (faceIndex) {
      case 0: // Frente - hora actual
        value = currentHour;
        break;
      case 1: // Derecha - hora + 6
        value = (currentHour + 6) % 24;
        break;
      case 2: // Atrás - hora + 12
        value = (currentHour + 12) % 24;
        break;
      case 3: // Izquierda - hora + 18
        value = (currentHour + 18) % 24;
        break;
      default:
        value = currentHour;
    }
    
    return this.formatNumber(value);
  }

  getMinuteFaceValue(faceOffset: number): string {
    const currentMinute = this.currentTime.minutes;
    const faceIndex = Math.floor((this.rotationMinutes / 90 + faceOffset) % 4);
    
    let value;
    switch (faceIndex) {
      case 0: // Frente - minuto actual
        value = currentMinute;
        break;
      case 1: // Derecha - minuto + 15
        value = (currentMinute + 15) % 60;
        break;
      case 2: // Atrás - minuto + 30
        value = (currentMinute + 30) % 60;
        break;
      case 3: // Izquierda - minuto + 45
        value = (currentMinute + 45) % 60;
        break;
      default:
        value = currentMinute;
    }
    
    return this.formatNumber(value);
  }

  getSecondFaceValue(faceOffset: number): string {
    const currentSecond = this.currentTime.seconds;
    const faceIndex = Math.floor((this.rotationSeconds / 90 + faceOffset) % 4);
    
    let value;
    switch (faceIndex) {
      case 0: // Frente - segundo actual
        value = currentSecond;
        break;
      case 1: // Derecha - segundo + 15
        value = (currentSecond + 15) % 60;
        break;
      case 2: // Atrás - segundo + 30
        value = (currentSecond + 30) % 60;
        break;
      case 3: // Izquierda - segundo + 45
        value = (currentSecond + 45) % 60;
        break;
      default:
        value = currentSecond;
    }
    
    return this.formatNumber(value);
  }

  // Método auxiliar para obtener la rotación normalizada
  getNormalizedRotation(rotation: number): number {
    return rotation % 360;
  }
}