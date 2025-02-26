import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule to use ngFor

@Component({
  selector: 'app-listcomponent', // Selector is used in the HTML file to call the component
  imports: [CommonModule], // Import CommonModule to use ngFor
  templateUrl: './listcomponent.component.html',
  styleUrl: './listcomponent.component.css'
})
export class ListcomponentComponent {

  // List of presidents for the listcomponent
  presidents: any [] = [
    {name: 'Joe Biden', term: '2021-2025'},
    {name: 'Donald Trump', term: '2017-2021'},
    {name: 'Barack Obama', term: '2009-2017'},
    {name: 'George W. Bush', term: '2001-2009'},
    {name: 'Bill Clinton', term: '1993-2001'},
    {name: 'George H. W. Bush', term: '1989-1993'},
    {name: 'Ronald Reagan', term: '1981-1989'},
    {name: 'Jimmy Carter', term: '1977-1981'},
    {name: 'Gerald Ford', term: '1974-1977'},
  ];
}
