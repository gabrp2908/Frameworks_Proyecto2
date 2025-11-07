import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TimeService, TimeState } from '../../services/time.service';

// Importar componentes de visualizadores
import { AnalogClockComponent } from '../clocks/analog-clock/analog-clock.component';
import { BinaryClockComponent } from '../clocks/binary-clock/binary-clock.component';


interface Visualizer {
  value: string;
  label: string;
  description: string;
  component: any;
}

@Component({
  selector: 'app-time-visualizer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AnalogClockComponent,
    BinaryClockComponent,
  ],
  templateUrl: './time-visualizer.component.html',
  styleUrls: ['./time-visualizer.component.css']
})
export class TimeVisualizerComponent implements OnInit, OnDestroy {
  currentTime: TimeState;
  timeOffset: number = 0;
  selectedVisualizer: string = 'binary';
  private timeSubscription: Subscription | undefined;

  visualizers: Visualizer[] = [
    {
    value: 'analog',
    label: 'Reloj Analógico',
    description: 'Un reloj analógico clásico con manecillas que se actualizan cada segundo.',
    component: AnalogClockComponent
    },
    { 
      value: 'binary', 
      label: 'Reloj Binario', 
      description: 'Tiempo representado en código binario',
      component: BinaryClockComponent
    }
  ];

  constructor(private timeService: TimeService) {
    this.currentTime = this.timeService.getCurrentTime();
  }

  ngOnInit() {
    this.timeSubscription = this.timeService.getTime().subscribe(time => {
      this.currentTime = time;
    });
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  onTimeOffsetChange(event: any): void {
    this.timeOffset = parseInt(event.target.value);
    this.timeService.setTimeOffset(this.timeOffset);
  }

  getVisualizerName(value: string): string {
    const visualizer = this.visualizers.find(viz => viz.value === value);
    return visualizer ? visualizer.label : 'Visualizador';
  }

  getVisualizerDescription(value: string): string {
    const visualizer = this.visualizers.find(viz => viz.value === value);
    return visualizer ? visualizer.description : 'Descripción no disponible';
  }

  getCurrentVisualizer(): any {
    const visualizer = this.visualizers.find(viz => viz.value === this.selectedVisualizer);
    return visualizer ? visualizer.component : null;
  }

  getFormattedTime(): string {
    if (!this.currentTime?.date) return '00:00:00';
    const hours = this.currentTime.hours.toString().padStart(2, '0');
    const minutes = this.currentTime.minutes.toString().padStart(2, '0');
    const seconds = this.currentTime.seconds.toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}