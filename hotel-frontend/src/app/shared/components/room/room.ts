import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { customCapacityIcon, customCheckIcon } from '../../../core/constants/custom-icons';
import { RoomSuggestion } from '../../../core/interfaces/roomSuggestion.interface';
import { Room as RoomInterface } from '../../../core/interfaces/room.interface';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './room.html',
  styleUrl: './room.scss',
})
export class RoomComponent {
  @Input() room!: RoomSuggestion | RoomInterface;
  @Input() isSuggested = false;
  @Input() isSelected = false;
  @Input() showSelection = false;
  
  @Output() select = new EventEmitter<void>();

  capacityIcon = customCapacityIcon;
  checkIcon = customCheckIcon;
  
  constructor() {}

  onSelect() {
    if (this.showSelection) {
      this.select.emit();
    }
  }
}
