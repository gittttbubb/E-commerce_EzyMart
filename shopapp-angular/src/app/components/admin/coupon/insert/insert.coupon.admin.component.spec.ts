import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsertCouponAdminComponent} from './insert.coupon.admin.component';

describe('Insert.coupon.adminComponent', () => {
  let component: InsertCouponAdminComponent;
  let fixture: ComponentFixture<InsertCouponAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InsertCouponAdminComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertCouponAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
