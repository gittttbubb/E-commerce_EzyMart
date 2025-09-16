import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CouponService } from '../../../../services/coupon.service';
import { CouponDTO } from '../../../../dtos/coupon/coupon.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-coupon-add',
  templateUrl: './insert.coupon.admin.component.html',
  styleUrls: ['./insert.coupon.admin.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class InsertCouponAdminComponent {
  coupon: CouponDTO = { code: '', active: true };
  conditions: { attribute: string; operator: string; value: string; discountAmount: number }[] = [];

  constructor(private couponService: CouponService, private router: Router) {}

  addCondition() {
    this.conditions.push({ attribute: '', operator: '', value: '', discountAmount: 0 });
  }

  saveCoupon() {
    // Gửi coupon + conditions
    const payload = { ...this.coupon, conditions: this.conditions };
    this.couponService.createCoupon(payload as any).subscribe({
      next: () => this.router.navigate(['/admin/coupons']),
      error: (err) => alert(err.error?.message || 'Không thể thêm coupon')
    });
  }
  removeCondition(index: number) {
    this.conditions.splice(index, 1);
  }
  backcoupon() {
    this.router.navigate(['/admin/coupons']);
  }
}
