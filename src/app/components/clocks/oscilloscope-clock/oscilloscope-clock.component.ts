import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeState } from '../../../services/time.service';

@Component({
  selector: 'app-oscilloscope-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oscilloscope-clock.component.html',
  styleUrls: ['./oscilloscope-clock.component.css']
})
export class OscilloscopeClockComponent {
  @Input() currentTime!: TimeState;

  // Configuración de la pantalla
  readonly canvasWidth = 400;
  readonly canvasHeight = 200;
  readonly gridSize = 20;

  getSafeHours(): number { 
    return this.currentTime?.hours || 0; 
  }

  getSafeMinutes(): number { 
    return this.currentTime?.minutes || 0; 
  }

  getSafeSeconds(): number { 
    return this.currentTime?.seconds || 0; 
  }

  // Generar puntos para la onda cuadrada (horas)
  getSquareWavePoints(): { x: number, y: number }[] {
    const points = [];
    const hour = this.getSafeHours();
    const amplitude = 60;
    const centerY = this.canvasHeight / 2;
    
    // Crear 24 segmentos para las 24 horas
    for (let i = 0; i <= 24; i++) {
      const x = (i / 24) * this.canvasWidth;
      const isHigh = i <= hour;
      const y = centerY + (isHigh ? -amplitude : amplitude);
      
      points.push({ x, y });
      
      // Para crear el efecto escalonado, añadimos un punto extra
      if (i < 24) {
        points.push({ x: x + (this.canvasWidth / 24) - 1, y });
      }
    }
    
    return points;
  }

  // Generar puntos para la onda triangular (minutos)
  getTriangleWavePoints(): { x: number, y: number }[] {
    const points = [];
    const minute = this.getSafeMinutes();
    const amplitude = 40;
    const centerY = this.canvasHeight / 2;
    
    // Crear 60 segmentos para los 60 minutos
    for (let i = 0; i <= 60; i++) {
      const x = (i / 60) * this.canvasWidth;
      
      // Onda triangular: sube y baja suavemente
      const progress = (i % 10) / 10; // 6 ciclos completos
      let y;
      
      if (progress < 0.5) {
        // Subida
        y = centerY + amplitude - (progress * 2 * amplitude * 2);
      } else {
        // Bajada
        y = centerY - amplitude + ((progress - 0.5) * 2 * amplitude * 2);
      }
      
      // Aplicar el efecto del minuto actual
      if (i <= minute) {
        points.push({ x, y });
      }
    }
    
    return points;
  }

  // Generar puntos para la onda sinusoidal (segundos)
  getSineWavePoints(): { x: number, y: number }[] {
    const points = [];
    const second = this.getSafeSeconds();
    const amplitude = 30;
    const centerY = this.canvasHeight / 2;
    const frequency = 6; // 6 ciclos completos en la pantalla
    
    // Crear puntos suaves para la onda sinusoidal
    for (let i = 0; i <= second; i++) {
      const x = (i / 60) * this.canvasWidth;
      const radians = (i / 60) * frequency * Math.PI * 2;
      const y = centerY + Math.sin(radians) * amplitude;
      
      points.push({ x, y });
    }
    
    return points;
  }

  // Helper: convertir array de puntos a string para el atributo 'points' de <polyline>
  getPointsString(points: { x: number, y: number }[]): string {
    if (!points || points.length === 0) return '';
    return points.map(p => `${p.x},${p.y}`).join(' ');
  }

  getSquarePointsString(): string {
    return this.getPointsString(this.getSquareWavePoints());
  }

  getTrianglePointsString(): string {
    return this.getPointsString(this.getTriangleWavePoints());
  }

  getSinePointsString(): string {
    return this.getPointsString(this.getSineWavePoints());
  }

  // Obtener el color para cada onda
  getWaveColor(wave: 'hours' | 'minutes' | 'seconds'): string {
    switch (wave) {
      case 'hours': return '#ff4444';
      case 'minutes': return '#4444ff';
      case 'seconds': return '#ffff44';
      default: return '#ffffff';
    }
  }

  // Obtener la descripción de cada onda
  getWaveDescription(wave: 'hours' | 'minutes' | 'seconds'): string {
    switch (wave) {
      case 'hours': return `Onda Cuadrada - ${this.getSafeHours()} Horas`;
      case 'minutes': return `Onda Triangular - ${this.getSafeMinutes()} Minutos`;
      case 'seconds': return `Onda Sinusoidal - ${this.getSafeSeconds()} Segundos`;
      default: return '';
    }
  }

  // Obtener el ancho de línea para cada onda
  getWaveWidth(wave: 'hours' | 'minutes' | 'seconds'): number {
    switch (wave) {
      case 'hours': return 3;
      case 'minutes': return 2;
      case 'seconds': return 2;
      default: return 1;
    }
  }

  // Generar puntos para la grilla del osciloscopio
  getGridPoints(): { x: number, y: number }[] {
    const points = [];
    
    // Líneas verticales
    for (let x = this.gridSize; x < this.canvasWidth; x += this.gridSize) {
      points.push({ x, y: 0 }, { x, y: this.canvasHeight });
    }
    
    // Líneas horizontales
    for (let y = this.gridSize; y < this.canvasHeight; y += this.gridSize) {
      points.push({ x: 0, y }, { x: this.canvasWidth, y });
    }
    
    return points;
  }

  // Obtener el estado del "trigger" del osciloscopio
  getTriggerState(): string {
    const seconds = this.getSafeSeconds();
    return seconds % 4 < 2 ? 'ACTIVO' : 'STANDBY';
  }

  // Obtener el nivel de voltaje simulado
  getVoltageLevel(wave: 'hours' | 'minutes' | 'seconds'): number {
    switch (wave) {
      case 'hours': return this.getSafeHours() * 0.5;
      case 'minutes': return this.getSafeMinutes() * 0.1;
      case 'seconds': return Math.sin(this.getSafeSeconds() * 0.1) * 2;
      default: return 0;
    }
  }

  // Obtener la frecuencia simulada
  getFrequency(wave: 'hours' | 'minutes' | 'seconds'): string {
    switch (wave) {
      case 'hours': return '0.0116 Hz';
      case 'minutes': return '0.00028 Hz';
      case 'seconds': return '1 Hz';
      default: return '0 Hz';
    }
  }

  // Verificar si el punto está en el área visible
  isPointInView(x: number, y: number): boolean {
    return x >= 0 && x <= this.canvasWidth && y >= 0 && y <= this.canvasHeight;
  }
}