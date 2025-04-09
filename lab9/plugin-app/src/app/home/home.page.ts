import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
// Needed for native browser support
import { Browser } from '@capacitor/browser';
// Needed for geolocation support
import { Geolocation } from '@capacitor/geolocation';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule],
})
export class HomePage {
  // Variables to store location data
  location: any = "";
  latitude: number = 0;
  longitude: number = 0;

  constructor() {}

  // Function to open the system browser
  async openBrowser() {
    await Browser.open({ url: 'https://capacitorjs.com' });
  }

  // Function to get user location
  async getLocation() {
    this.location = await Geolocation.getCurrentPosition();
    this.latitude = this.location.coords.latitude;
    this.longitude = this.location.coords.longitude;
    console.log('Current position:', this.location);
  }

  // Function to get the current position when page is loaded
  ngOnInit() {
    this.getLocation();
  }
}
