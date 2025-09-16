package com.project.shopapp.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CouponDTO {
    private Long id;

    @NotBlank(message = "Coupon code must not be blank")
    private String code;

    private boolean active;

    @Valid
    private List<CouponConditionDTO> conditions;
}
