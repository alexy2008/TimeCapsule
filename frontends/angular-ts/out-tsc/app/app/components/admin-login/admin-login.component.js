import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
function AdminLoginComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 6);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.error);
} }
export class AdminLoginComponent {
    constructor() {
        this.loading = false;
        this.error = null;
        this.login = new EventEmitter();
        this.password = '';
    }
    handleLogin() {
        if (this.password) {
            this.login.emit(this.password);
        }
    }
    static { this.ɵfac = function AdminLoginComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AdminLoginComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AdminLoginComponent, selectors: [["app-admin-login"]], inputs: { loading: "loading", error: "error" }, outputs: { login: "login" }, standalone: true, features: [i0.ɵɵStandaloneFeature], decls: 11, vars: 4, consts: [[1, "login-wrapper"], [1, "login-form", "card", 3, "ngSubmit"], [1, "login-title"], [1, "form-group"], ["for", "admin-password", 1, "input-label"], ["id", "admin-password", "name", "password", "type", "password", "placeholder", "\u8F93\u5165\u7BA1\u7406\u5458\u5BC6\u7801", "autocomplete", "current-password", 1, "input", 3, "ngModelChange", "ngModel"], [1, "error-text"], ["type", "submit", 1, "btn", "btn-primary", "btn-lg", "submit-btn", 3, "disabled"]], template: function AdminLoginComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "form", 1);
            i0.ɵɵlistener("ngSubmit", function AdminLoginComponent_Template_form_ngSubmit_1_listener() { return ctx.handleLogin(); });
            i0.ɵɵelementStart(2, "h2", 2);
            i0.ɵɵtext(3, "\u7BA1\u7406\u5458\u767B\u5F55");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "div", 3)(5, "label", 4);
            i0.ɵɵtext(6, "\u5BC6\u7801");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "input", 5);
            i0.ɵɵtwoWayListener("ngModelChange", function AdminLoginComponent_Template_input_ngModelChange_7_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.password, $event) || (ctx.password = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(8, AdminLoginComponent_Conditional_8_Template, 2, 1, "p", 6);
            i0.ɵɵelementStart(9, "button", 7);
            i0.ɵɵtext(10);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("ngModel", ctx.password);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.error ? 8 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.loading || !ctx.password);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.loading ? "\u767B\u5F55\u4E2D..." : "\u767B\u5F55", " ");
        } }, dependencies: [FormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.NgModel, i1.NgForm], styles: [".login-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding: var(--space-8) 0;\n}\n\n.login-form[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 400px;\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-5);\n}\n\n.login-title[_ngcontent-%COMP%] {\n  font-size: var(--text-xl);\n  font-weight: var(--font-semibold);\n  text-align: center;\n}\n\n.form-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-2);\n}\n\n.input-label[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  font-weight: var(--font-medium);\n}\n\n.error-text[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  color: var(--color-error);\n}\n\n.submit-btn[_ngcontent-%COMP%] {\n  width: 100%;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AdminLoginComponent, [{
        type: Component,
        args: [{ selector: 'app-admin-login', standalone: true, imports: [FormsModule], template: "<div class=\"login-wrapper\">\n  <form class=\"login-form card\" (ngSubmit)=\"handleLogin()\">\n    <h2 class=\"login-title\">\u7BA1\u7406\u5458\u767B\u5F55</h2>\n    <div class=\"form-group\">\n      <label class=\"input-label\" for=\"admin-password\">\u5BC6\u7801</label>\n      <input\n        id=\"admin-password\"\n        [(ngModel)]=\"password\"\n        name=\"password\"\n        type=\"password\"\n        class=\"input\"\n        placeholder=\"\u8F93\u5165\u7BA1\u7406\u5458\u5BC6\u7801\"\n        autocomplete=\"current-password\"\n      />\n    </div>\n    @if (error) {\n      <p class=\"error-text\">{{ error }}</p>\n    }\n    <button\n      type=\"submit\"\n      class=\"btn btn-primary btn-lg submit-btn\"\n      [disabled]=\"loading || !password\"\n    >\n      {{ loading ? '\u767B\u5F55\u4E2D...' : '\u767B\u5F55' }}\n    </button>\n  </form>\n</div>\n", styles: [".login-wrapper {\n  display: flex;\n  justify-content: center;\n  padding: var(--space-8) 0;\n}\n\n.login-form {\n  width: 100%;\n  max-width: 400px;\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-5);\n}\n\n.login-title {\n  font-size: var(--text-xl);\n  font-weight: var(--font-semibold);\n  text-align: center;\n}\n\n.form-group {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-2);\n}\n\n.input-label {\n  font-size: var(--text-sm);\n  font-weight: var(--font-medium);\n}\n\n.error-text {\n  font-size: var(--text-sm);\n  color: var(--color-error);\n}\n\n.submit-btn {\n  width: 100%;\n}\n"] }]
    }], null, { loading: [{
            type: Input
        }], error: [{
            type: Input
        }], login: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AdminLoginComponent, { className: "AdminLoginComponent" }); })();
