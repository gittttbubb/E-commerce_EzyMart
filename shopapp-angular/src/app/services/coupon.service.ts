import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category';
import { UpdateCategoryDTO } from '../dtos/category/update.category.dto';
import { InsertCategoryDTO } from '../dtos/category/insert.category.dto';
import { ApiResponse } from '../responses/api.response';
import { CouponDTO } from '../dtos/coupon/coupon.dto';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }
  calculateCouponValue(couponCode: string, totalAmount: number): Observable<ApiResponse> {
    const url = `${this.apiBaseUrl}/coupons/calculate`;
    const params = new HttpParams()
      .set('couponCode', couponCode)
      .set('totalAmount', totalAmount.toString());

    return this.http.get<ApiResponse>(url, { params });
  }

 // === Admin: CRUD coupon ===
  getAllCoupons(page: number = 0, size: number = 10): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/coupons?page=${page}&size=${size}`);
  }

  getCouponById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/coupons/${id}`);
  }

  createCoupon(coupon: CouponDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/coupons`, coupon);
  }

  updateCoupon(id: number, coupon: CouponDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/coupons`, coupon);
  }

  deleteCoupon(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/coupons/${id}`);
  }

}