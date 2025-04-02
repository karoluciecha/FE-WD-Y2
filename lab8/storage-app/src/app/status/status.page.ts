import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonList, IonItem, IonLabel, IonRadio, IonRadioGroup, IonButton } from '@ionic/angular/standalone';
// Needed to store data in the browser
import { Storage } from '@ionic/storage-angular';
// Needed to navigate to the home page
import { Router } from '@angular/router';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
  standalone: true,
  imports: [IonButton, IonRadioGroup, IonRadio, IonLabel, IonItem, IonList, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class StatusPage implements OnInit {
  status: string = '';

  // Have to add storage to the constructor to be able to use it in the class
  // Also add router to be able to navigate back to the home page
  constructor(private storage: Storage, private router: Router) { }

  ngOnInit() {
  }

  // This function is called when the page is about to be displayed
  async ionViewWillEnter() {
    // Create the storage if it doesn't exist
    await this.storage.create();

    // Check if the status is already set
    // If it is, get the status from storage
    this.storage.get('status').then((val) => {
      this.status = val;
    });
  }

  async saveStatus() {
    // Save the status to storage
    await this.storage.set('status', this.status);

    // Log the status to the console
    console.log('Status saved:', this.status);

    // Go back to the home page
    this.router.navigate(['/home']);
  }

  clearStatus() {
    // Clear the status from storage
    this.storage.remove('status').then(() => {
      console.log('Status cleared');
      this.status = ''; // Clear the status in the UI
    });
  }
}
