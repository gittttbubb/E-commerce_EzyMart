package com.project.shopapp.services.coupon;

import com.project.shopapp.dtos.CouponDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICouponService {
    double calculateCouponValue(String couponCode, double totalAmount);

    Coupon createCoupon(CouponDTO dto);
    Coupon updateCoupon(CouponDTO dto)throws DataNotFoundException;
    void deleteCoupon(Long id)throws DataNotFoundException;
    Coupon getCouponById(Long id)throws DataNotFoundException;
    Page<Coupon> getAllCoupons(Pageable pageable);

}
