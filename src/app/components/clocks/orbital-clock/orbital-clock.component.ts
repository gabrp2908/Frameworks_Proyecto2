import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeState } from '../../../services/time.service';

interface Planet {
  type: 'hour' | 'minute' | 'second';
  size: number;
  color: string;
  orbitRadius: number;
  rotation: number;
  label: string;
  glowColor: string;
  position: { x: number, y: number };
}

@Component({
  selector: 'app-orbital-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orbital-clock.component.html',
  styleUrls: ['./orbital-clock.component.css']
})
export class OrbitalClockComponent implements OnInit, OnDestroy {
  @Input() currentTime!: TimeState;
  
  private animationFrameId: number = 0;
  
  planets: Planet[] = [];
  stars: {x: number, y: number, size: number, opacity: number}[] = [];

  ngOnInit() {
    this.generateStars();
    this.updatePlanets();
    this.startAnimation();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private generateStars() {
    this.stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3
    }));
  }

  private startAnimation() {
    const animate = () => {
      this.updatePlanets();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  private updatePlanets() {
    const centerX = 200;
    const centerY = 200; 

    this.planets = [
      {
        type: 'hour',
        size: 35,
        color: '#FF6B6B',
        orbitRadius: 120,
        rotation: this.getSafeHours() * 15,
        label: `${this.getSafeHours().toString().padStart(2, '0')}H`,
        glowColor: 'rgba(255, 107, 107, 0.6)',
        position: this.calculatePlanetPosition(centerX, centerY, 120, this.getSafeHours() * 15)
      },
      {
        type: 'minute', 
        size: 28,
        color: '#4834D4',
        orbitRadius: 80,
        rotation: this.getSafeMinutes() * 6,
        label: `${this.getSafeMinutes().toString().padStart(2, '0')}M`,
        glowColor: 'rgba(72, 52, 212, 0.6)',
        position: this.calculatePlanetPosition(centerX, centerY, 80, this.getSafeMinutes() * 6)
      },
      {
        type: 'second',
        size: 22,
        color: '#00D2D3',
        orbitRadius: 40,
        rotation: this.getSafeSeconds() * 6,
        label: `${this.getSafeSeconds().toString().padStart(2, '0')}S`,
        glowColor: 'rgba(0, 210, 211, 0.6)',
        position: this.calculatePlanetPosition(centerX, centerY, 40, this.getSafeSeconds() * 6)
      }
    ];
  }

  private calculatePlanetPosition(centerX: number, centerY: number, radius: number, angle: number): { x: number, y: number } {
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + Math.cos(rad) * radius,
      y: centerY + Math.sin(rad) * radius
    };
  }

  getSafeHours(): number { 
    return this.currentTime?.hours || 0; 
  }

  getSafeMinutes(): number { 
    return this.currentTime?.minutes || 0; 
  }

  getSafeSeconds(): number { 
    return this.currentTime?.seconds || 0; 
  }
}