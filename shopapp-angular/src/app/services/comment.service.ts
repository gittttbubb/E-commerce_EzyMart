import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Comment } from '../models/comment';
import { ApiResponse } from '../responses/api.response';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getCommentsByProduct(productId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/comments?product_id=${productId}`);
  }

  getCommentsByUserAndProduct(userId: number, productId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/comments?user_id=${userId}&product_id=${productId}`);
  }

  addComment(comment: Partial<Comment>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/comments`, comment);
  }

  updateComment(commentId: number, comment: Partial<Comment>): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/comments/${commentId}`, comment);
  }

  deleteComment(commentId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/comments/${commentId}`);
  }
}
