import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons } from '@ionic/angular/standalone';
// IonBackButton, IonButton, IonButtons are imported to use the back button in the toolbar

@Component({
  selector: 'app-ulster',
  templateUrl: './ulster.page.html',
  styleUrls: ['./ulster.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButton, IonButtons],
  // And also added here to use the back button on the page
})
export class UlsterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
