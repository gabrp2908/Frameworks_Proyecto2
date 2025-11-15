import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeState } from '../../../services/time.service';

@Component({
  selector: 'app-solar-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solar-clock.component.html',
  styleUrls: ['./solar-clock.component.css']
})
export class SolarClockComponent {
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

  // Calcular posición del sol (rotación circular)
  getSunPosition(): { transform: string, opacity: number } {
    const hour = this.getSafeHours();
    const angle = (hour / 24) * 360;
    
    let opacity = 1;
    if (hour < 6 || hour > 20) opacity = 0.3;
    else if (hour < 7 || hour > 19) opacity = 0.7;
    
    return {
      transform: `rotate(${angle}deg) translate(150px) rotate(-${angle}deg)`,
      opacity: opacity
    };
  }

  // Calcular color del cielo basado en la hora
  getSkyGradient(): string {
    const hour = this.getSafeHours();
    
    if (hour >= 5 && hour < 7) {
      return 'linear-gradient(180deg, #ff7e5f 0%, #feb47b 50%, #87CEEB 100%)';
    } else if (hour >= 7 && hour < 17) {
      return 'linear-gradient(180deg, #87CEEB 0%, #98d8ff 100%)';
    } else if (hour >= 17 && hour < 19) {
      return 'linear-gradient(180deg, #ff6b6b 0%, #ffa726 50%, #2c3e50 100%)';
    } else {
      return 'linear-gradient(180deg, #2c3e50 0%, #34495e 50%, #8e44ad 100%)';
    }
  }

  // FLORES: Representan MINUTOS (cada 2 minutos = 1 flor)
  getFlowerCount(): number {
    return Math.floor(this.getSafeMinutes() / 2); // 0-30 flores
  }

  getFlowers(): number[] {
    return Array.from({ length: this.getFlowerCount() }, (_, i) => i);
  }

  getFlowerPosition(index: number): { left: string } {
    const left = 5 + (index * (90 / 30));
    return { left: `${left}%` };
  }

  getFlowerColor(index: number): string {
    const colors = ['#ff6b6b', '#ffa726', '#66bb6a', '#42a5f5', '#ab47bc'];
    return colors[index % colors.length];
  }

  // NUBES: Comportamiento exacto según rangos de segundos
  getCloudCount(): number {
    const seconds = this.getSafeSeconds();
    if (seconds < 10) return 0;   // 0-9 seg: 0 nubes
    if (seconds < 20) return 1;   // 10-19 seg: 1 nube
    if (seconds < 30) return 2;   // 20-29 seg: 2 nubes
    if (seconds < 40) return 3;   // 30-39 seg: 3 nubes
    if (seconds < 50) return 4;   // 40-49 seg: 4 nubes
    return 5;                     // 50-59 seg: 5 nubes
  }

  getClouds(): number[] {
    return Array.from({ length: this.getCloudCount() }, (_, i) => i);
  }

  getCloudPosition(index: number): { 
    left: string,
    top: string
  } {
    const seconds = this.getSafeSeconds();

    // La nube i entra en (i+1)*10 segundos: 10, 20, 30, 40, 50
    const startTime = (index + 1) * 10;
    const endTime = 59; // todas terminan en 59

    // Si aún no es su turno, está fuera de escena
    if (seconds < startTime) {
      const heights = [20, 30, 40, 25, 35];
      const top = heights[index % heights.length];
      return { left: '-8%', top: `${top}%` };
    }

    // Si ya pasó el segundo 59, la nube está fuera de escena (derecha)
    if (seconds > endTime) {
      return { left: '120%', top: '100%' };
    }

    // Duración de recorrido = desde su salida hasta el segundo 59
    const duration = endTime - startTime;

    // Tiempo transcurrido desde que salió
    const elapsed = seconds - startTime;

    // Factores de velocidad ajustados (más lentos para las primeras 4)
    const speedFactors = [0.85, 0.85, 0.9, 0.95, 1]; 
    const factor = speedFactors[index] || 1;

    // Progreso normalizado (0 → salida, 1 → final en 59s)
    const progress = Math.min((elapsed / duration) * factor, 1);

    // Movimiento horizontal desde -8% hasta 120%
    const left = -8 + (progress * (120 - (-8)));

    // Alturas fijas para cada nube
    const heights = [20, 30, 40, 25, 35];
    const top = heights[index % heights.length];

    return {
      left: `${left}%`,
      top: `${top}%`
    };
  }

  getCloudSize(index: number): string {
    const sizes = ['small', 'medium', 'large', 'medium', 'small'];
    return sizes[index % sizes.length];
  }

  getStarIntensity(): number {
    const hour = this.getSafeHours();
    if (hour >= 20 || hour < 5) return 1;
    if (hour >= 19 || hour < 6) return 0.5;
    return 0;
  }

  getStars(): number[] {
    const intensity = this.getStarIntensity();
    return Array.from({ length: Math.floor(intensity * 30) }, (_, i) => i);
  }

  getStarPosition(index: number): { left: string, top: string } {
    const left = (index * 8) % 95;
    const top = (index * 5) % 50;
    return { left: `${left}%`, top: `${top}%` };
  }
}