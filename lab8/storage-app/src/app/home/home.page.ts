import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, NgIf],
})
export class HomePage {
  status: string = '';
  constructor(private storage:Storage) {}

  async ionViewWillEnter() {
    // Create the storage if it doesn't exist
   await this.storage.create();
    // Check if the status is already set
    // If it is, get the status from storage
    this.storage.get('status').then((val) => {
      this.status = val;
    });
    // OR:
    // this.status = await this.storage.get('status');
  }
}
