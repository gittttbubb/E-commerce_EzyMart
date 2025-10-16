import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCategoryAdminComponent } from './update.category.admin.component';

describe('UpdateCategoryAdminComponent', () => {
  let component: UpdateCategoryAdminComponent;
  let fixture: ComponentFixture<UpdateCategoryAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UpdateCategoryAdminComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCategoryAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
