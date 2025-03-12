import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons } from '@ionic/angular/standalone';

@Component({
  selector: 'app-muster',
  templateUrl: './muster.page.html',
  styleUrls: ['./muster.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButton, IonButtons]
})
export class MusterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
