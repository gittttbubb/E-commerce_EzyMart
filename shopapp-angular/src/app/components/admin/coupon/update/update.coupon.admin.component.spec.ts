import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCouponAdminComponent } from './update.coupon.admin.component';

describe('UpdateCouponAdminComponent', () => {
  let component: UpdateCouponAdminComponent;
  let fixture: ComponentFixture<UpdateCouponAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UpdateCouponAdminComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCouponAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
