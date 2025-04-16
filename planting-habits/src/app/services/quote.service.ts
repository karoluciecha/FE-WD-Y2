import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface representing the structure of each quote post returned from the API
interface QuotePost {
  content: { rendered: string }; // Quote content
  title: { rendered: string }; // Quote author
}

@Injectable({
  providedIn: 'root' // Makes the service available application-wide
})
export class QuoteService {
  // API endpoint providing 100 quote posts from the Quotes on Design API
  private apiUrl = 'https://quotesondesign.com/wp-json/wp/v2/posts/?per_page=100';

  constructor(private http: HttpClient) {}

  // Fetches an array of quote posts as an observable (async)
  getQuotes(): Observable<QuotePost[]> {
    return this.http.get<QuotePost[]>(this.apiUrl);
  }
}