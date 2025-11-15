import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TimeService, TimeState } from '../../services/time.service';

// Importar componentes de visualizadores
import { AnalogClockComponent } from '../clocks/analog-clock/analog-clock.component';
import { BinaryClockComponent } from '../clocks/binary-clock/binary-clock.component';
import { BarsClockComponent } from '../clocks/bars-clock/bars-clock.component';
import { OrbitalClockComponent } from '../clocks/orbital-clock/orbital-clock.component';
import { SandClockComponent } from '../clocks/sand-clock/sand-clock.component';
import { DigitalClockComponent } from '../clocks/digital-clock/digital-clock.component';
import { BuildingClockComponent } from '../clocks/building-clock/building-clock.component';
import { OscilloscopeClockComponent } from '../clocks/oscilloscope-clock/oscilloscope-clock.component';
import { SolarClockComponent } from '../clocks/solar-clock/solar-clock.component';

interface Visualizer {
  value: string;
  label: string;
  description: string;
  component: Type<any>;
}

@Component({
  selector: 'app-time-visualizer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AnalogClockComponent,
    BinaryClockComponent,
    BarsClockComponent,
    OrbitalClockComponent,
    SandClockComponent,
    DigitalClockComponent,
    BuildingClockComponent,
    OscilloscopeClockComponent,
    SolarClockComponent,
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
    description: 'Un reloj analógico clásico con manecillas que se actualizan cada segundo',
    component: AnalogClockComponent
    },
    { 
      value: 'binary', 
      label: 'Reloj Binario', 
      description: 'Tiempo representado en código binario',
      component: BinaryClockComponent
    },
    { 
      value: 'bars', 
      label: 'Reloj de Barras', 
      description: 'Barras que crecen con cada unidad de tiempo',
      component: BarsClockComponent
    },
    { 
      value: 'orbital', 
      label: 'Reloj Planetario', 
      description: 'Planetas orbitando representando el tiempo',
      component: OrbitalClockComponent
    },
    {
      value: 'sand',
      label: 'Reloj de Arena',
      description: 'Reloj de arena con rellenos que representan horas, minutos y segundos',
      component: SandClockComponent
    },
    {
      value: 'digital',
      label: 'Reloj Digital',
      description: 'Reloj digital que emplea display de 7 segmentos para la visualización de horas, minutos y segundos',
      component: DigitalClockComponent
    },
    {
      value: 'building',
      label: 'Edificio con Ventanas Iluminadas',
      description: 'Un edificio con 24 pisos los cuales representan las horas del día. Cada piso cuenta con 60 ventanas que se iluminan al pasar los minutos',
      component: BuildingClockComponent
    },
    {
      value: 'oscilloscope',
      label: 'Osciloscopio',
      description: 'Un osciloscopio digital que permite la visualización del tiempo con una onda de pulsos cuadrados (horas), una onda triangular (minutos) y una onda sinusoidal (segundos)',
      component: OscilloscopeClockComponent
    },
    {
      value: 'solar',
      label: 'Reloj Solar',
      description: 'Un paisaje donde el Sol se posiciona según la hora, las Flores florecen cada dos minutos y las Nubes aparecen en el cielo cen intervalos de 10 segundos',
      component: SolarClockComponent
    },
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

  getCurrentVisualizer(): Type<any> | null {
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