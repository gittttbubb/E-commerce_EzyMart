package com.project.shopapp.services.coupon;

import com.project.shopapp.dtos.CouponDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Coupon;
import com.project.shopapp.models.CouponCondition;
import com.project.shopapp.repositories.CouponConditionRepository;
import com.project.shopapp.repositories.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDate;


@RequiredArgsConstructor
@Service
public class CouponService implements ICouponService{
    private final CouponRepository couponRepository;
    private final CouponConditionRepository couponConditionRepository;
    @Override
    public double calculateCouponValue(String couponCode, double totalAmount) {
        Coupon coupon = couponRepository.findByCode(couponCode)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        if (!coupon.isActive()) {
            throw new IllegalArgumentException("Coupon is not active");
        }
        double discount = calculateDiscount(coupon, totalAmount);
        double finalAmount = totalAmount - discount;
        return finalAmount;
    }

    private double calculateDiscount(Coupon coupon, double totalAmount) {
        List<CouponCondition> conditions = couponConditionRepository
                .findByCouponId(coupon.getId());
        double discount = 0.0;
        double updatedTotalAmount = totalAmount;
        for (CouponCondition condition : conditions) {
            //EAV(Entity - Attribute - Value) Model
            String attribute = condition.getAttribute();
            String operator = condition.getOperator();
            String value = condition.getValue();

            double percentDiscount = Double.valueOf(
                    String.valueOf(condition.getDiscountAmount()));

//            if (attribute.equals("minimum_amount")) {
//                if (operator.equals(">") && updatedTotalAmount > Double.parseDouble(value)) {
//                    discount += updatedTotalAmount * percentDiscount / 100;
//                }
//            } else if (attribute.equals("applicable_date")) {
//                LocalDate applicableDate = LocalDate.parse(value);
//                LocalDate currentDate = LocalDate.now();
//                if (operator.equalsIgnoreCase("BETWEEN")
//                        && currentDate.isEqual(applicableDate)) {
//                    discount += updatedTotalAmount * percentDiscount / 100;
//                }
//            }
            switch (attribute) {
                case "minimum_amount" -> {
                    if (operator.equals(">") || operator.equals(">=")  && updatedTotalAmount > Double.parseDouble(value)) {
                        discount += updatedTotalAmount * percentDiscount / 100;
                    }
                }
                case "applicable_date" -> {
                    LocalDate applicableDate = LocalDate.parse(value);
                    LocalDate currentDate = LocalDate.now();
                    if (operator.equalsIgnoreCase("BETWEEN") && currentDate.isEqual(applicableDate)) {
                        discount += updatedTotalAmount * percentDiscount / 100;
                    }
                }
            }
            //còn nhiều nhiều điều kiện khác nữa
            updatedTotalAmount = updatedTotalAmount - discount;
        }
        return discount;
    }

    // ================== CRUD ==================
    @Override
    @Transactional
    public Coupon createCoupon(CouponDTO couponDTO) {
        Coupon coupon = new Coupon();
        coupon.setCode(couponDTO.getCode());
        coupon.setActive(couponDTO.isActive());

        if (couponDTO.getConditions() != null) {
            couponDTO.getConditions().forEach(c -> {
                CouponCondition condition = new CouponCondition();
                condition.setAttribute(c.getAttribute());
                condition.setOperator(c.getOperator());
                condition.setValue(c.getValue());
                condition.setDiscountAmount(c.getDiscountAmount());
                condition.setCoupon(coupon);
                coupon.getConditions().add(condition);
            });
        }

        return couponRepository.save(coupon);
    }

    @Override
    @Transactional
    public Coupon updateCoupon(CouponDTO couponDTO) throws DataNotFoundException {
        if (couponDTO.getId() == null) {
            throw new IllegalArgumentException("Coupon id is required for update");
        }
        Coupon coupon = couponRepository.findById(couponDTO.getId())
                .orElseThrow(() -> new DataNotFoundException("Coupon not found with id " + couponDTO.getId()));
        coupon.setCode(couponDTO.getCode());
        coupon.setActive(couponDTO.isActive());

        // clear và set lại conditions
        coupon.getConditions().clear();
        if (couponDTO.getConditions() != null) {
            couponDTO.getConditions().forEach(c -> {
                CouponCondition condition = new CouponCondition();
                condition.setAttribute(c.getAttribute());
                condition.setOperator(c.getOperator());
                condition.setValue(c.getValue());
                condition.setDiscountAmount(c.getDiscountAmount());
                condition.setCoupon(coupon);
                coupon.getConditions().add(condition);
            });
        }

        return couponRepository.save(coupon);
    }

    @Override
    @Transactional
    public void deleteCoupon(Long id) throws DataNotFoundException {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Coupon not found with id " + id));

        couponRepository.delete(coupon);
    }

    @Override
    public Coupon getCouponById(Long id) throws DataNotFoundException {
        return couponRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Coupon not found with id " + id));
    }

    @Override
    public Page<Coupon> getAllCoupons(Pageable pageable) {
        return couponRepository.findAll(pageable);
    }
}
