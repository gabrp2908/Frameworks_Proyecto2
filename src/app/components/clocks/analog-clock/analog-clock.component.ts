import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeState, TimeService } from '../../../services/time.service';

@Component({
  selector: 'app-analog-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analog-clock.component.html',
  styleUrls: ['./analog-clock.component.css']
})
export class AnalogClockComponent implements OnDestroy {
  hourHand = 'translate(-100%, -50%) rotate(90deg)';
  minuteHand = 'translate(-100%, -50%) rotate(90deg)';
  secondHand = 'translate(-100%, -50%) rotate(90deg)';

  private timeSubscription: Subscription;

  constructor(private timeService: TimeService) {
    this.timeSubscription = this.timeService.getTime().subscribe(time => {
      this.updateHands(time);
    });
  }

  private updateHands(time: TimeState) {
    const secondsDegree = (time.seconds / 60) * 360 + 90;
    const minutesDegree = (time.minutes / 60) * 360 + (time.seconds / 60) * 6 + 90;
    const hoursDegree = ((time.hours % 12) / 12) * 360 + (time.minutes / 60) * 30 + 90;

    this.secondHand = `translate(-100%, -50%) rotate(${secondsDegree}deg)`;
    this.minuteHand = `translate(-100%, -50%) rotate(${minutesDegree}deg)`;
    this.hourHand = `translate(-100%, -50%) rotate(${hoursDegree}deg)`;
  }

  ngOnDestroy() {
    if(this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }
}
