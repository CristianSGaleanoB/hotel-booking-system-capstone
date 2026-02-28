import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { customCapacityIcon } from '../../../core/constants/custom-icons';
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
  capacityIcon = customCapacityIcon;
  
  constructor() {}
}
