import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface QuotePost {
  content: { rendered: string };
  title: { rendered: string };
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = 'https://quotesondesign.com/wp-json/wp/v2/posts/?per_page=100';

  constructor(private http: HttpClient) {}

  getQuotes(): Observable<QuotePost[]> {
    return this.http.get<QuotePost[]>(this.apiUrl);
  }
}