import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { customUserIcon } from '../../../core/constants/custom-icons';
import { RoomSuggestion } from '../../../core/interfaces/roomSuggestion.interface';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './room.html',
  styleUrl: './room.scss',
})
export class Room {
  @Input() room!: RoomSuggestion;
  customUser = customUserIcon;
  
  constructor() {}
}
