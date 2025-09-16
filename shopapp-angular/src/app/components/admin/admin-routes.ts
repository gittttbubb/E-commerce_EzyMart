import { AdminComponent } from "./admin.component";
import { OrderAdminComponent } from "./order/order.admin.component";
import { DetailOrderAdminComponent } from "./detail-order/detail.order.admin.component";
import { Route, Router,Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProductAdminComponent } from "./product/product.admin.component";
import { CategoryAdminComponent } from "./category/category.admin.component";
import { UpdateProductAdminComponent } from "./product/update/update.product.admin.component";
import { InsertProductAdminComponent } from "./product/insert/insert.product.admin.component";
import { InsertCategoryAdminComponent } from "./category/insert/insert.category.admin.component";
import { UpdateCategoryAdminComponent } from "./category/update/update.category.admin.component";
import { UserAdminComponent } from "./user/user.admin.component";
import { CouponAdminComponent } from "./coupon/coupon.admin.component";
import { InsertCouponAdminComponent } from "./coupon/insert/insert.coupon.admin.component";
import { UpdateCouponAdminComponent } from "./coupon/update/update.coupon.admin.component";

export const adminRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            {
                path: 'orders',
                component: OrderAdminComponent
            },            
            {
                path: 'products',
                component: ProductAdminComponent
            },
            {
                path: 'categories',
                component: CategoryAdminComponent
            },
            {
                path: 'coupons',
                component: CouponAdminComponent
            },
            //sub path
            {
                path: 'orders/:id',
                component: DetailOrderAdminComponent
            },
            {
                path: 'products/update/:id',
                component: UpdateProductAdminComponent
            },
            {
                path: 'products/insert',
                component: InsertProductAdminComponent
            },
            //categories            
            {
                path: 'categories/update/:id',
                component: UpdateCategoryAdminComponent
            },
            {
                path: 'categories/insert',
                component: InsertCategoryAdminComponent
            },
            {
                path: 'coupons/insert',
                component: InsertCouponAdminComponent
            },
            {
                path: 'coupons/update/:id',
                component: UpdateCouponAdminComponent
            },
            {
                path: 'users',
                component: UserAdminComponent
            },  
        ]
    }
];
/*
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
*/
