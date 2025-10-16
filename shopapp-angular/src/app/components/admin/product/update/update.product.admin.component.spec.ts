import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateProductAdminComponent } from './update.product.admin.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from '../../../../services/category.service';

describe('UpdateProductAdminComponent', () => {
  let component: UpdateProductAdminComponent;
  let fixture: ComponentFixture<UpdateProductAdminComponent>;
  let httpTestingController: HttpTestingController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UpdateProductAdminComponent,   // Standalone component
        HttpClientTestingModule        // Mock HttpClient
      ],
      providers: [CategoryService]
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    categoryService = TestBed.inject(CategoryService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProductAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Đảm bảo không còn request nào chưa được xử lý
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCategories from CategoryService with page and size', () => {
    const mockCategories = [
      { id: 1, name: 'Category A' },
      { id: 2, name: 'Category B' }
    ];

    const page = 0;
    const size = 10;

    categoryService.getCategories(page, size).subscribe(response => {
         expect(response.data.length).toBe(2);
    expect(response.data).toEqual(mockCategories);
    expect(response.message).toBe('success');
    expect(response.status).toBe('OK');
    });

    // Kiểm tra request đúng URL và method
    const req = httpTestingController.expectOne(`/api/categories?page=${page}&size=${size}`);
    expect(req.request.method).toEqual('GET');

    // Trả về dữ liệu giả
    req.flush(mockCategories);
  });
});
