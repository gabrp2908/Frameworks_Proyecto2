import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeState } from '../../../services/time.service';

@Component({
  selector: 'app-building-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './building-clock.component.html',
  styleUrls: ['./building-clock.component.css']
})
export class BuildingClockComponent {
  @Input() currentTime!: TimeState;

  // Total de pisos y ventanas
  readonly totalFloors = 24;
  readonly windowsPerFloor = 59; 

  getSafeHours(): number { 
    return this.currentTime?.hours || 0; 
  }

  getSafeMinutes(): number { 
    return this.currentTime?.minutes || 0; 
  }

  getSafeSeconds(): number { 
    return this.currentTime?.seconds || 0; 
  }

  // Generar array de pisos (de 23 a 0 para que el piso 0 sea la planta baja)
  getFloors(): number[] {
    return Array.from({ length: this.totalFloors }, (_, i) => this.totalFloors - 1 - i);
  }

  // Generar array de ventanas por piso
  getWindows(floorIndex: number): number[] {
    return Array.from({ length: this.windowsPerFloor }, (_, i) => i);
  }

  // Determinar si una ventana debe estar iluminada - LOGICA MEJORADA
  isWindowLit(floorIndex: number, windowIndex: number): boolean {
    const currentHour = this.getSafeHours();
    const currentMinute = this.getSafeMinutes();
    
    // El piso actual corresponde a la hora actual
    // Invertimos el índice porque los pisos se muestran de arriba hacia abajo
    const floorNumber = this.totalFloors - 1 - floorIndex;
    
    if (floorNumber === currentHour) {
      // En el piso de la hora actual, las ventanas se iluminan según los minutos
      return windowIndex <= currentMinute;
    } else if (floorNumber < currentHour) {
      // Pisos con horas anteriores - todas las ventanas iluminadas
      return true;
    }
    
    // Pisos con horas futuras - todas apagadas
    return false;
  }

  // Determinar si es la ventana del minuto actual
  isCurrentMinuteWindow(floorIndex: number, windowIndex: number): boolean {
    const currentHour = this.getSafeHours();
    const currentMinute = this.getSafeMinutes();
    const floorNumber = this.totalFloors - 1 - floorIndex;
    
    return floorNumber === currentHour && windowIndex === currentMinute;
  }

  // Determinar si la luz de la entrada debe estar parpadeando (segundos pares)
  isEntranceLightOn(): boolean {
    return this.getSafeSeconds() % 2 === 0;
  }

  // Obtener la hora formateada para mostrar
  getFormattedTime(): string {
    const hours = this.getSafeHours().toString().padStart(2, '0');
    const minutes = this.getSafeMinutes().toString().padStart(2, '0');
    const seconds = this.getSafeSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  // Obtener descripción del estado actual
  getStatusDescription(): string {
    const hour = this.getSafeHours();
    const minute = this.getSafeMinutes();
    const floorLabel = hour === 0 ? 'Planta Baja' : `Piso ${hour}`;
    const litWindows = minute + 1;
    
    return `Hora ${hour}:${minute.toString().padStart(2, '0')} - ${floorLabel} con ${litWindows} ventanas iluminadas`;
  }
  
  getEntranceLightClass(): string {
    return this.isEntranceLightOn() ? 'entrance-light-on' : 'entrance-light-off';
  }
}