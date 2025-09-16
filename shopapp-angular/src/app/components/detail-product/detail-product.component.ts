import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { environment } from '../../../environments/environment';
import { ProductImage } from '../../models/product.image';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from '../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../base/base.component';
import { UserResponse } from '../../responses/user/user.response';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-detail-product',
    templateUrl: './detail-product.component.html',
    styleUrls: ['./detail-product.component.scss'],
    imports: [
        FooterComponent,
        HeaderComponent,
        CommonModule,
        NgbModule,
        FormsModule
    ]
})

export class DetailProductComponent extends BaseComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isPressedAddToCart: boolean = false;  


  ngOnInit() {
    // Lấy productId từ URL      
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    
    debugger
    //this.cartService.clearCart();
    //const idParam = 9 //fake tạm 1 giá trị
    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (apiResponse: ApiResponse) => {
          // Lấy danh sách ảnh sản phẩm và thay đổi URL
          const response = apiResponse.data
          debugger
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
            });
          }
          debugger
          this.product = response
          // Bắt đầu với ảnh đầu tiên
          this.showImage(0);
          this.loadComments();
        },
        complete: () => {
          debugger;
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.showToast({
            error: error,
            defaultMsg: 'Lỗi tải chi tiết sản phẩm',
            title: 'Lỗi Sản Phẩm'
          });
        }
      });
    } else {
      this.toastService.showToast({
        error: null,
        defaultMsg: 'ID sản phẩm không hợp lệ',
        title: 'Lỗi Dữ Liệu'
      });
    }
  }
  showImage(index: number): void {
    debugger
    if (this.product && this.product.product_images &&
      this.product.product_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ        
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    debugger
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }
  nextImage(): void {
    debugger
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }
  addToCart(): void {
    debugger
    this.isPressedAddToCart = true;
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
    } else {
      // Xử lý khi product là null
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');
    }
  }

  increaseQuantity(): void {
    debugger
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  getTotalPrice(): number {
    if (this.product) {
      return this.product.price * this.quantity;
    }
    return 0;
  }
  buyNow(): void {
    if (this.isPressedAddToCart == false) {
      this.addToCart();
    }
    this.router.navigate(['/orders']);
  }

// COMMENT
comments: Comment[] = [];
newComment: string = '';
editingCommentId: number | null = null;
editingContent: string = '';
currentUser = this.userService.getUserResponseFromLocalStorage();

constructor(
  private commentService: CommentService
) {
  super();
}

private loadComments() {
  this.commentService.getCommentsByProduct(this.productId).subscribe({
    next: (res) => {
      this.comments = res.data as Comment[];
    },
    error: (err) => console.error(err)
  });
}

addComment() {
  debugger

  if (!this.newComment.trim() || !this.currentUser) return;
  debugger

  const commentData = {
    content: this.newComment,
    user_id: this.currentUser.id,
    product_id: this.productId
  };

  this.commentService.addComment(commentData).subscribe({
    next: () => {
      this.newComment = '';
      this.loadComments();
    }
  });
}

startEdit(comment: Comment) {
  this.editingCommentId = comment.id;
  this.editingContent = comment.content;
}

saveEdit(comment: Comment) {
  if (!this.editingContent.trim()) return;

  this.commentService.updateComment(comment.id, {
    ...comment,
    content: this.editingContent
  }).subscribe({
    next: () => {
      this.editingCommentId = null;
      this.loadComments();
    }
  }); 
}

cancelEdit() {
  this.editingCommentId = null;
  this.editingContent = '';
}

deleteComment(commentId: number) {
  if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

  this.commentService.deleteComment(commentId).subscribe({
    next: () => this.loadComments()
  });
}

isCommentOwner(comment: Comment): boolean {
  return this.currentUser?.id === comment.user.id;
}
}
