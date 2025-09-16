package com.project.shopapp.dtos;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CouponConditionDTO {
    private Long id; // có thể dùng khi cập nhật condition

    @NotBlank(message = "Attribute must not be blank")
    private String attribute;

    @NotBlank(message = "Operator must not be blank")
    private String operator;

    @NotBlank(message = "Value must not be blank")
    private String value;

    @NotNull(message = "Discount amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Discount amount must be greater than 0")
    private BigDecimal discountAmount;
}
