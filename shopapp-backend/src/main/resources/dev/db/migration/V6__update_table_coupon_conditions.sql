ALTER TABLE coupon_conditions
DROP FOREIGN KEY coupon_conditions_ibfk_1;

ALTER TABLE coupon_conditions
ADD CONSTRAINT fk_coupon_conditions_coupon
FOREIGN KEY (coupon_id) REFERENCES coupons(id)
ON DELETE CASCADE;