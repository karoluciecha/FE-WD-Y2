import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListcomponentComponent } from './listcomponent/listcomponent.component'; // Import listcomponentComponent

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListcomponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'data-binding-app';

  // Double click event to hide/show h2 element binded to image
  hide: boolean = true;
  onImageDblClick() {
    // Toggle hide
    this.hide = !this.hide;
  }

  // Number of clicks event binded to button
  numberClicks: number = 0;
  onButtonClick() {
    // Increment number of clicks
    this.numberClicks++;
  }

}
