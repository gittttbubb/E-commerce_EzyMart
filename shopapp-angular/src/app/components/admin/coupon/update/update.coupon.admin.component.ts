import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CouponService } from '../../../../services/coupon.service';
import { CouponDTO } from '../../../../dtos/coupon/coupon.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coupon-detail',
  templateUrl: './update.coupon.admin.component.html',
  styleUrls: ['./update.coupon.admin.component.css'],
    imports: [
    CommonModule,
    FormsModule
  ]
})
export class UpdateCouponAdminComponent implements OnInit {
  coupon: CouponDTO | null = null;
  conditions: { id?: number; attribute: string; operator: string; value: string; discountAmount: number }[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private couponService: CouponService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCoupon(id);
  }

  loadCoupon(id: number) {
    this.couponService.getCouponById(id).subscribe({
      next: (res) => {
        this.coupon = res.data;
        this.conditions = (res.data as any).conditions || [];
      },
      error: (err) => alert(err.error?.message || 'Không thể tải chi tiết coupon')
    });
  }

  updateCoupon() {
    if (!this.coupon?.id) return;
    const payload = { ...this.coupon, conditions: this.conditions };
    debugger
    this.couponService.updateCoupon(this.coupon.id, payload as any).subscribe({
      next: () => this.router.navigate(['/admin/coupons']),
      error: (err) => alert(err.error?.message || 'Không thể cập nhật coupon')
    });
  }

  addCondition() {
    this.conditions.push({ attribute: '', operator: '', value: '', discountAmount: 0 });
  }
  removeCondition(index: number) {
    this.conditions.splice(index, 1);
  }
  backcoupon() {
    this.router.navigate(['/admin/coupons']);
  }
}
