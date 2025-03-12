import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
// RuterLink is imported to use the routerLink directive to change the page when the item is clicked

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, RouterLink],
  // And also added here to be able to change the page when the item is clicked
})
export class HomePage {
  constructor() {}
}
