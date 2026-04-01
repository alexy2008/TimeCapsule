import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CapsuleService } from '../../services/capsule.service';
import { CapsuleFormComponent } from '../../components/capsule-form/capsule-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import * as i0 from "@angular/core";
const _c0 = a0 => ["/open", a0];
function CreateComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 3)(1, "div", 4);
    i0.ɵɵtext(2, "\u2705");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h2");
    i0.ɵɵtext(4, "\u80F6\u56CA\u521B\u5EFA\u6210\u529F\uFF01");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 5);
    i0.ɵɵtext(6, "\u4F60\u7684\u80F6\u56CA\u7801\u662F\uFF1A");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "p", 6);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 7);
    i0.ɵɵtext(10, "\u8BF7\u8BB0\u4F4F\u8FD9\u4E2A\u80F6\u56CA\u7801\uFF0C\u5B83\u662F\u5F00\u542F\u80F6\u56CA\u7684\u552F\u4E00\u51ED\u8BC1");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "div", 8)(12, "button", 9);
    i0.ɵɵlistener("click", function CreateComponent_Conditional_7_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.copyCode()); });
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "a", 10);
    i0.ɵɵtext(15, "\u67E5\u770B\u80F6\u56CA");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r1.created().code);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.copied() ? "\u5DF2\u590D\u5236\uFF01" : "\u590D\u5236\u80F6\u56CA\u7801", " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(3, _c0, ctx_r1.created().code));
} }
function CreateComponent_Conditional_8_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.error());
} }
function CreateComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵtemplate(0, CreateComponent_Conditional_8_Conditional_0_Template, 2, 1, "div", 11);
    i0.ɵɵelementStart(1, "app-capsule-form", 12);
    i0.ɵɵlistener("formSubmit", function CreateComponent_Conditional_8_Template_app_capsule_form_formSubmit_1_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleSubmit($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "app-confirm-dialog", 13);
    i0.ɵɵlistener("confirm", function CreateComponent_Conditional_8_Template_app_confirm_dialog_confirm_2_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.confirmCreate()); })("cancel", function CreateComponent_Conditional_8_Template_app_confirm_dialog_cancel_2_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.showConfirm.set(false)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r1.error() ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("loading", ctx_r1.loading());
    i0.ɵɵadvance();
    i0.ɵɵproperty("visible", ctx_r1.showConfirm())("message", "\u786E\u5B9A\u8981\u521B\u5EFA\u6807\u9898\u4E3A\u300C" + ((tmp_4_0 = (tmp_4_0 = ctx_r1.pendingForm()) == null ? null : tmp_4_0.title) !== null && tmp_4_0 !== undefined ? tmp_4_0 : "") + "\u300D\u7684\u65F6\u95F4\u80F6\u56CA\u5417\uFF1F");
} }
export class CreateComponent {
    constructor() {
        this.capsuleService = inject(CapsuleService);
        this.loading = this.capsuleService.loading;
        this.error = this.capsuleService.error;
        this.created = signal(null);
        this.showConfirm = signal(false);
        this.pendingForm = signal(null);
        this.copied = signal(false);
    }
    handleSubmit(form) {
        this.pendingForm.set(form);
        this.showConfirm.set(true);
    }
    async confirmCreate() {
        this.showConfirm.set(false);
        const form = this.pendingForm();
        if (!form)
            return;
        try {
            const result = await this.capsuleService.create(form);
            this.created.set(result);
        }
        catch {
            // error state handled in service
        }
    }
    copyCode() {
        const cap = this.created();
        if (cap) {
            navigator.clipboard.writeText(cap.code).then(() => {
                this.copied.set(true);
                setTimeout(() => this.copied.set(false), 2000);
            });
        }
    }
    static { this.ɵfac = function CreateComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CreateComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: CreateComponent, selectors: [["app-create"]], standalone: true, features: [i0.ɵɵProvidersFeature([CapsuleService]), i0.ɵɵStandaloneFeature], decls: 9, vars: 1, consts: [[1, "page"], [1, "container", "container-sm"], [1, "page-header"], [1, "card", "success-card"], [1, "success-icon"], [1, "hint"], [1, "capsule-code"], [1, "hint-small"], [1, "success-actions"], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "routerLink"], [1, "error-banner"], [3, "formSubmit", "loading"], ["title", "\u786E\u8BA4\u521B\u5EFA", 3, "confirm", "cancel", "visible", "message"]], template: function CreateComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1");
            i0.ɵɵtext(4, "\u521B\u5EFA\u65F6\u95F4\u80F6\u56CA");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "p");
            i0.ɵɵtext(6, "\u5C01\u5B58\u4F60\u7684\u5FC3\u610F\uFF0C\u5728\u672A\u6765\u5F00\u542F");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(7, CreateComponent_Conditional_7_Template, 16, 5, "div", 3)(8, CreateComponent_Conditional_8_Template, 3, 4);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵconditional(ctx.created() ? 7 : 8);
        } }, dependencies: [RouterLink, CapsuleFormComponent, ConfirmDialogComponent], styles: [".page-header[_ngcontent-%COMP%] {\n  margin-bottom: var(--space-8);\n}\n\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: var(--text-2xl);\n  font-weight: var(--font-bold);\n  margin-bottom: var(--space-2);\n}\n\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--color-text-secondary);\n}\n\n.error-banner[_ngcontent-%COMP%] {\n  background-color: #fee2e2;\n  color: var(--color-error);\n  padding: var(--space-3) var(--space-4);\n  border-radius: var(--radius-md);\n  margin-bottom: var(--space-6);\n  font-size: var(--text-sm);\n}\n\n[data-theme=\"dark\"][_ngcontent-%COMP%]   .error-banner[_ngcontent-%COMP%] {\n  background-color: #450a0a;\n}\n\n.success-card[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: var(--space-10);\n}\n\n.success-icon[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  margin-bottom: var(--space-4);\n}\n\n.success-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: var(--text-2xl);\n  font-weight: var(--font-bold);\n  margin-bottom: var(--space-4);\n}\n\n.hint[_ngcontent-%COMP%] {\n  color: var(--color-text-secondary);\n  margin-bottom: var(--space-2);\n}\n\n.capsule-code[_ngcontent-%COMP%] {\n  font-family: var(--font-mono);\n  font-size: var(--text-3xl);\n  font-weight: var(--font-bold);\n  color: var(--color-primary);\n  letter-spacing: 0.2em;\n  margin-bottom: var(--space-3);\n}\n\n.hint-small[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n  margin-bottom: var(--space-6);\n}\n\n.success-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: var(--space-4);\n  flex-wrap: wrap;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CreateComponent, [{
        type: Component,
        args: [{ selector: 'app-create', standalone: true, imports: [RouterLink, CapsuleFormComponent, ConfirmDialogComponent], providers: [CapsuleService], template: "<div class=\"page\">\n  <div class=\"container container-sm\">\n    <div class=\"page-header\">\n      <h1>\u521B\u5EFA\u65F6\u95F4\u80F6\u56CA</h1>\n      <p>\u5C01\u5B58\u4F60\u7684\u5FC3\u610F\uFF0C\u5728\u672A\u6765\u5F00\u542F</p>\n    </div>\n\n    @if (created()) {\n      <div class=\"card success-card\">\n        <div class=\"success-icon\">\u2705</div>\n        <h2>\u80F6\u56CA\u521B\u5EFA\u6210\u529F\uFF01</h2>\n        <p class=\"hint\">\u4F60\u7684\u80F6\u56CA\u7801\u662F\uFF1A</p>\n        <p class=\"capsule-code\">{{ created()!.code }}</p>\n        <p class=\"hint-small\">\u8BF7\u8BB0\u4F4F\u8FD9\u4E2A\u80F6\u56CA\u7801\uFF0C\u5B83\u662F\u5F00\u542F\u80F6\u56CA\u7684\u552F\u4E00\u51ED\u8BC1</p>\n        <div class=\"success-actions\">\n          <button type=\"button\" class=\"btn btn-secondary\" (click)=\"copyCode()\">\n            {{ copied() ? '\u5DF2\u590D\u5236\uFF01' : '\u590D\u5236\u80F6\u56CA\u7801' }}\n          </button>\n          <a [routerLink]=\"['/open', created()!.code]\" class=\"btn btn-primary\">\u67E5\u770B\u80F6\u56CA</a>\n        </div>\n      </div>\n    } @else {\n      @if (error()) {\n        <div class=\"error-banner\">{{ error() }}</div>\n      }\n      <app-capsule-form [loading]=\"loading()\" (formSubmit)=\"handleSubmit($event)\" />\n      <app-confirm-dialog\n        [visible]=\"showConfirm()\"\n        title=\"\u786E\u8BA4\u521B\u5EFA\"\n        [message]=\"'\u786E\u5B9A\u8981\u521B\u5EFA\u6807\u9898\u4E3A\u300C' + (pendingForm()?.title ?? '') + '\u300D\u7684\u65F6\u95F4\u80F6\u56CA\u5417\uFF1F'\"\n        (confirm)=\"confirmCreate()\"\n        (cancel)=\"showConfirm.set(false)\"\n      />\n    }\n  </div>\n</div>\n", styles: [".page-header {\n  margin-bottom: var(--space-8);\n}\n\n.page-header h1 {\n  font-size: var(--text-2xl);\n  font-weight: var(--font-bold);\n  margin-bottom: var(--space-2);\n}\n\n.page-header p {\n  color: var(--color-text-secondary);\n}\n\n.error-banner {\n  background-color: #fee2e2;\n  color: var(--color-error);\n  padding: var(--space-3) var(--space-4);\n  border-radius: var(--radius-md);\n  margin-bottom: var(--space-6);\n  font-size: var(--text-sm);\n}\n\n[data-theme=\"dark\"] .error-banner {\n  background-color: #450a0a;\n}\n\n.success-card {\n  text-align: center;\n  padding: var(--space-10);\n}\n\n.success-icon {\n  font-size: 3rem;\n  margin-bottom: var(--space-4);\n}\n\n.success-card h2 {\n  font-size: var(--text-2xl);\n  font-weight: var(--font-bold);\n  margin-bottom: var(--space-4);\n}\n\n.hint {\n  color: var(--color-text-secondary);\n  margin-bottom: var(--space-2);\n}\n\n.capsule-code {\n  font-family: var(--font-mono);\n  font-size: var(--text-3xl);\n  font-weight: var(--font-bold);\n  color: var(--color-primary);\n  letter-spacing: 0.2em;\n  margin-bottom: var(--space-3);\n}\n\n.hint-small {\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n  margin-bottom: var(--space-6);\n}\n\n.success-actions {\n  display: flex;\n  justify-content: center;\n  gap: var(--space-4);\n  flex-wrap: wrap;\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(CreateComponent, { className: "CreateComponent" }); })();
