import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminLoginComponent } from '../../components/admin-login/admin-login.component';
import { CapsuleTableComponent } from '../../components/capsule-table/capsule-table.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import * as i0 from "@angular/core";
function AdminComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-admin-login", 4);
    i0.ɵɵlistener("login", function AdminComponent_Conditional_5_Template_app_admin_login_login_0_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleLogin($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("loading", ctx_r1.adminService.loading())("error", ctx_r1.adminService.error());
} }
function AdminComponent_Conditional_6_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 8);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.adminService.error());
} }
function AdminComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 5)(1, "p", 6);
    i0.ɵɵtext(2, "\u5DF2\u767B\u5F55\u4E3A\u7BA1\u7406\u5458");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 7);
    i0.ɵɵlistener("click", function AdminComponent_Conditional_6_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.adminService.logout()); });
    i0.ɵɵtext(4, "\u9000\u51FA\u767B\u5F55");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(5, AdminComponent_Conditional_6_Conditional_5_Template, 2, 1, "div", 8);
    i0.ɵɵelementStart(6, "app-capsule-table", 9);
    i0.ɵɵlistener("delete", function AdminComponent_Conditional_6_Template_app_capsule_table_delete_6_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleDelete($event)); })("page", function AdminComponent_Conditional_6_Template_app_capsule_table_page_6_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.adminService.fetchCapsules($event)); })("refresh", function AdminComponent_Conditional_6_Template_app_capsule_table_refresh_6_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.adminService.fetchCapsules(ctx_r1.adminService.pageInfo().number)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "app-confirm-dialog", 10);
    i0.ɵɵlistener("confirm", function AdminComponent_Conditional_6_Template_app_confirm_dialog_confirm_7_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.confirmDelete()); })("cancel", function AdminComponent_Conditional_6_Template_app_confirm_dialog_cancel_7_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showDeleteConfirm.set(false)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.adminService.error() ? 5 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("capsules", ctx_r1.adminService.capsules())("pageInfo", ctx_r1.adminService.pageInfo())("loading", ctx_r1.adminService.loading());
    i0.ɵɵadvance();
    i0.ɵɵproperty("visible", ctx_r1.showDeleteConfirm())("message", "\u786E\u5B9A\u8981\u5220\u9664\u80F6\u56CA " + ctx_r1.deleteTarget() + " \u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\u3002");
} }
export class AdminComponent {
    constructor() {
        this.adminService = inject(AdminService);
        this.showDeleteConfirm = signal(false);
        this.deleteTarget = signal('');
    }
    ngOnInit() {
        if (this.adminService.isLoggedIn()) {
            this.adminService.fetchCapsules();
        }
    }
    async handleLogin(password) {
        try {
            await this.adminService.login(password);
            await this.adminService.fetchCapsules();
        }
        catch {
            // error state handled in service
        }
    }
    handleDelete(code) {
        this.deleteTarget.set(code);
        this.showDeleteConfirm.set(true);
    }
    async confirmDelete() {
        this.showDeleteConfirm.set(false);
        await this.adminService.deleteCapsule(this.deleteTarget());
    }
    static { this.ɵfac = function AdminComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AdminComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AdminComponent, selectors: [["app-admin"]], standalone: true, features: [i0.ɵɵStandaloneFeature], decls: 7, vars: 1, consts: [[1, "page"], [1, "container"], [1, "page-header"], [3, "loading", "error"], [3, "login", "loading", "error"], [1, "admin-bar"], [1, "admin-hint"], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], [1, "error-banner"], [3, "delete", "page", "refresh", "capsules", "pageInfo", "loading"], ["title", "\u786E\u8BA4\u5220\u9664", 3, "confirm", "cancel", "visible", "message"]], template: function AdminComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1");
            i0.ɵɵtext(4, "\u7BA1\u7406\u540E\u53F0");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(5, AdminComponent_Conditional_5_Template, 1, 2, "app-admin-login", 3)(6, AdminComponent_Conditional_6_Template, 8, 6);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(!ctx.adminService.isLoggedIn() ? 5 : 6);
        } }, dependencies: [AdminLoginComponent, CapsuleTableComponent, ConfirmDialogComponent], styles: [".page-header[_ngcontent-%COMP%] {\n  margin-bottom: var(--space-8);\n}\n\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: var(--text-2xl);\n  font-weight: var(--font-bold);\n}\n\n.admin-bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: var(--space-6);\n  padding: var(--space-3) var(--space-4);\n  background-color: var(--color-bg-secondary);\n  border-radius: var(--radius-md);\n}\n\n.admin-hint[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n}\n\n.error-banner[_ngcontent-%COMP%] {\n  background-color: #fee2e2;\n  color: var(--color-error);\n  padding: var(--space-3) var(--space-4);\n  border-radius: var(--radius-md);\n  margin-bottom: var(--space-6);\n  font-size: var(--text-sm);\n}\n\n[data-theme=\"dark\"][_ngcontent-%COMP%]   .error-banner[_ngcontent-%COMP%] {\n  background-color: #450a0a;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AdminComponent, [{
        type: Component,
        args: [{ selector: 'app-admin', standalone: true, imports: [AdminLoginComponent, CapsuleTableComponent, ConfirmDialogComponent], template: "<div class=\"page\">\n  <div class=\"container\">\n    <div class=\"page-header\">\n      <h1>\u7BA1\u7406\u540E\u53F0</h1>\n    </div>\n\n    @if (!adminService.isLoggedIn()) {\n      <app-admin-login\n        [loading]=\"adminService.loading()\"\n        [error]=\"adminService.error()\"\n        (login)=\"handleLogin($event)\"\n      />\n    } @else {\n      <div class=\"admin-bar\">\n        <p class=\"admin-hint\">\u5DF2\u767B\u5F55\u4E3A\u7BA1\u7406\u5458</p>\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"adminService.logout()\">\u9000\u51FA\u767B\u5F55</button>\n      </div>\n\n      @if (adminService.error()) {\n        <div class=\"error-banner\">{{ adminService.error() }}</div>\n      }\n\n      <app-capsule-table\n        [capsules]=\"adminService.capsules()\"\n        [pageInfo]=\"adminService.pageInfo()\"\n        [loading]=\"adminService.loading()\"\n        (delete)=\"handleDelete($event)\"\n        (page)=\"adminService.fetchCapsules($event)\"\n        (refresh)=\"adminService.fetchCapsules(adminService.pageInfo().number)\"\n      />\n\n      <app-confirm-dialog\n        [visible]=\"showDeleteConfirm()\"\n        title=\"\u786E\u8BA4\u5220\u9664\"\n        [message]=\"'\u786E\u5B9A\u8981\u5220\u9664\u80F6\u56CA ' + deleteTarget() + ' \u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\u3002'\"\n        (confirm)=\"confirmDelete()\"\n        (cancel)=\"showDeleteConfirm.set(false)\"\n      />\n    }\n  </div>\n</div>\n", styles: [".page-header {\n  margin-bottom: var(--space-8);\n}\n\n.page-header h1 {\n  font-size: var(--text-2xl);\n  font-weight: var(--font-bold);\n}\n\n.admin-bar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: var(--space-6);\n  padding: var(--space-3) var(--space-4);\n  background-color: var(--color-bg-secondary);\n  border-radius: var(--radius-md);\n}\n\n.admin-hint {\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n}\n\n.error-banner {\n  background-color: #fee2e2;\n  color: var(--color-error);\n  padding: var(--space-3) var(--space-4);\n  border-radius: var(--radius-md);\n  margin-bottom: var(--space-6);\n  font-size: var(--text-sm);\n}\n\n[data-theme=\"dark\"] .error-banner {\n  background-color: #450a0a;\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AdminComponent, { className: "AdminComponent" }); })();
