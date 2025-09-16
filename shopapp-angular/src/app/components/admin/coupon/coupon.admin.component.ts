import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../../services/coupon.service';
import { CouponDTO } from '../../../dtos/coupon/coupon.dto';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-coupon',
  templateUrl: './coupon.admin.component.html',
  styleUrls: ['./coupon.admin.component.css'],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class CouponAdminComponent implements OnInit {
  coupons: CouponDTO[] = [];
  searchTerm: string = '';
  errorMessage: string | null = null;

  // phân trang
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;

  constructor(private couponService: CouponService, private router: Router) {}

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(page: number = this.currentPage) {
    this.couponService.getAllCoupons(page, this.pageSize).subscribe({
      next: (res) => {
        this.coupons = res.data.content;
        this.totalPages = res.data.totalPages;
        this.currentPage = res.data.number; // backend trả về số trang hiện tại
      },
      error: (err) => this.errorMessage = err.error?.message || 'Không tải được danh sách coupon'
    });
  }

  searchCoupons() {
    if (this.searchTerm.trim()) {
      this.coupons = this.coupons.filter(c => c.code.includes(this.searchTerm.trim()));
    } else {
      this.loadCoupons();
    }
  }

  addCoupon() {
    this.router.navigate(['/admin/coupons/insert']);
  }

  viewDetail(id: number) {
    this.router.navigate([`/admin/coupons/update/${id}`]);
  }

  deleteCoupon(id: number) {
    if (!confirm('Bạn có chắc muốn xóa coupon này?')) return;
    this.couponService.deleteCoupon(id).subscribe({
      next: () => this.loadCoupons(),
      error: (err) => this.errorMessage = err.error?.message || 'Không thể xóa coupon'
    });
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.loadCoupons(page);
    }
  }
}
