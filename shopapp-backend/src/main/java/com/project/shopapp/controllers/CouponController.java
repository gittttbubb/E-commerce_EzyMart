package com.project.shopapp.controllers;

import com.project.shopapp.dtos.CouponDTO;
import com.project.shopapp.models.Coupon;
import com.project.shopapp.responses.ResponseObject;
import com.project.shopapp.responses.coupon.CouponCalculationResponse;
import com.project.shopapp.services.coupon.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.beans.PropertyEditorSupport;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/coupons")
//@Validated
//Dependency Injection
@RequiredArgsConstructor
public class CouponController {
    private final CouponService couponService;

    @GetMapping("/calculate")
    public ResponseEntity<ResponseObject> calculateCouponValue(
            @RequestParam("couponCode") String couponCode,
            @RequestParam("totalAmount") double totalAmount) {
        double finalAmount = couponService.calculateCouponValue(couponCode, totalAmount);
        CouponCalculationResponse couponCalculationResponse = CouponCalculationResponse.builder()
                .result(finalAmount)
                .build();
        return ResponseEntity.ok(new ResponseObject(
                "Calculate coupon successfully",
                HttpStatus.OK,
                couponCalculationResponse
        ));
    }
//    @GetMapping("/calculate")
//    public ResponseEntity<ResponseObject> calculateCouponValue(
//            @RequestParam("couponCode") String couponCode,
//            @RequestParam("totalAmount") String totalAmountStr) {
//
//        // Bỏ dấu chấm ngăn cách nghìn, rồi parse double
//        String cleanAmount = totalAmountStr
//                .replace(".", "")   // bỏ dấu ngăn cách nghìn
//                .replace("₫", "")   // bỏ ký hiệu tiền
//                .replaceAll("\\s+", ""); // bỏ khoảng trắng
//
//        double totalAmount = Double.parseDouble(cleanAmount);
//
//        double finalAmount = couponService.calculateCouponValue(couponCode, totalAmount);
//
//        CouponCalculationResponse couponCalculationResponse = CouponCalculationResponse.builder()
//                .result(finalAmount)
//                .build();
//
//        return ResponseEntity.ok(new ResponseObject(
//                "Calculate coupon successfully",
//                HttpStatus.OK,
//                couponCalculationResponse
//        ));
//    }
    // ================= CRUD API =================
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseObject> createCoupon(@Valid @RequestBody CouponDTO couponDTO) {
        Coupon coupon = couponService.createCoupon(couponDTO);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Coupon created successfully")
                        .data(coupon)
                        .build()
        );
    }

    @PutMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseObject> updateCoupon(@Valid @RequestBody CouponDTO couponDTO) throws Exception {
        Coupon coupon = couponService.updateCoupon(couponDTO);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Coupon updated successfully")
                        .data(coupon)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseObject> deleteCoupon(@PathVariable Long id) throws Exception {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Coupon deleted successfully")
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getCoupon(@PathVariable Long id) throws Exception {
        Coupon coupon = couponService.getCouponById(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Coupon retrieved successfully")
                        .data(coupon)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllCoupons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Coupon> coupons = couponService.getAllCoupons(PageRequest.of(page, size));
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Coupons retrieved successfully")
                        .data(coupons)
                        .build()
        );
    }
}
