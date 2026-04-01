import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
function CapsuleFormComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 4);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.errors.title);
} }
function CapsuleFormComponent_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 4);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.errors.content);
} }
function CapsuleFormComponent_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 4);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.errors.creator);
} }
function CapsuleFormComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 4);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.errors.openAt);
} }
export class CapsuleFormComponent {
    constructor() {
        this.loading = false;
        this.formSubmit = new EventEmitter();
        this.form = {
            title: '',
            content: '',
            creator: '',
            openAt: '',
        };
        this.errors = {
            title: '',
            content: '',
            creator: '',
            openAt: '',
        };
    }
    get minDateTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    }
    validate() {
        let valid = true;
        this.errors = { title: '', content: '', creator: '', openAt: '' };
        if (!this.form.title.trim()) {
            this.errors.title = '请输入标题';
            valid = false;
        }
        if (!this.form.content.trim()) {
            this.errors.content = '请输入内容';
            valid = false;
        }
        if (!this.form.creator.trim()) {
            this.errors.creator = '请输入发布者昵称';
            valid = false;
        }
        if (!this.form.openAt) {
            this.errors.openAt = '请选择开启时间';
            valid = false;
        }
        else if (new Date(this.form.openAt) <= new Date()) {
            this.errors.openAt = '开启时间必须在未来';
            valid = false;
        }
        return valid;
    }
    handleSubmit() {
        if (this.validate()) {
            this.formSubmit.emit({ ...this.form });
        }
    }
    static { this.ɵfac = function CapsuleFormComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CapsuleFormComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: CapsuleFormComponent, selectors: [["app-capsule-form"]], inputs: { loading: "loading" }, outputs: { formSubmit: "formSubmit" }, standalone: true, features: [i0.ɵɵStandaloneFeature], decls: 24, vars: 19, consts: [[1, "capsule-form", 3, "ngSubmit"], [1, "form-group"], ["for", "title", 1, "input-label"], ["id", "title", "name", "title", "placeholder", "\u7ED9\u65F6\u95F4\u80F6\u56CA\u53D6\u4E2A\u540D\u5B57", "maxlength", "100", 1, "input", 3, "ngModelChange", "ngModel"], [1, "error-text"], ["for", "content", 1, "input-label"], ["id", "content", "name", "content", "placeholder", "\u5199\u4E0B\u4F60\u60F3\u5BF9\u672A\u6765\u8BF4\u7684\u8BDD...", "rows", "5", 1, "input", 3, "ngModelChange", "ngModel"], [1, "form-row"], ["for", "creator", 1, "input-label"], ["id", "creator", "name", "creator", "placeholder", "\u4F60\u7684\u6635\u79F0", "maxlength", "30", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "openAt", 1, "input-label"], ["id", "openAt", "name", "openAt", "type", "datetime-local", 1, "input", 3, "ngModelChange", "ngModel", "min"], ["type", "submit", 1, "btn", "btn-primary", "btn-lg", "submit-btn", 3, "disabled"]], template: function CapsuleFormComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "form", 0);
            i0.ɵɵlistener("ngSubmit", function CapsuleFormComponent_Template_form_ngSubmit_0_listener() { return ctx.handleSubmit(); });
            i0.ɵɵelementStart(1, "div", 1)(2, "label", 2);
            i0.ɵɵtext(3, "\u6807\u9898");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "input", 3);
            i0.ɵɵtwoWayListener("ngModelChange", function CapsuleFormComponent_Template_input_ngModelChange_4_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.form.title, $event) || (ctx.form.title = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(5, CapsuleFormComponent_Conditional_5_Template, 2, 1, "p", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "div", 1)(7, "label", 5);
            i0.ɵɵtext(8, "\u5185\u5BB9");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "textarea", 6);
            i0.ɵɵtwoWayListener("ngModelChange", function CapsuleFormComponent_Template_textarea_ngModelChange_9_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.form.content, $event) || (ctx.form.content = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(10, CapsuleFormComponent_Conditional_10_Template, 2, 1, "p", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "div", 7)(12, "div", 1)(13, "label", 8);
            i0.ɵɵtext(14, "\u53D1\u5E03\u8005");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "input", 9);
            i0.ɵɵtwoWayListener("ngModelChange", function CapsuleFormComponent_Template_input_ngModelChange_15_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.form.creator, $event) || (ctx.form.creator = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(16, CapsuleFormComponent_Conditional_16_Template, 2, 1, "p", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "div", 1)(18, "label", 10);
            i0.ɵɵtext(19, "\u5F00\u542F\u65F6\u95F4");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "input", 11);
            i0.ɵɵtwoWayListener("ngModelChange", function CapsuleFormComponent_Template_input_ngModelChange_20_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.form.openAt, $event) || (ctx.form.openAt = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(21, CapsuleFormComponent_Conditional_21_Template, 2, 1, "p", 4);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(22, "button", 12);
            i0.ɵɵtext(23);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵclassProp("input-error", ctx.errors.title);
            i0.ɵɵtwoWayProperty("ngModel", ctx.form.title);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.errors.title ? 5 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵclassProp("input-error", ctx.errors.content);
            i0.ɵɵtwoWayProperty("ngModel", ctx.form.content);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.errors.content ? 10 : -1);
            i0.ɵɵadvance(5);
            i0.ɵɵclassProp("input-error", ctx.errors.creator);
            i0.ɵɵtwoWayProperty("ngModel", ctx.form.creator);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.errors.creator ? 16 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵclassProp("input-error", ctx.errors.openAt);
            i0.ɵɵtwoWayProperty("ngModel", ctx.form.openAt);
            i0.ɵɵproperty("min", ctx.minDateTime);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.errors.openAt ? 21 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.loading ? "\u521B\u5EFA\u4E2D..." : "\u5C01\u5B58\u65F6\u95F4\u80F6\u56CA", " ");
        } }, dependencies: [FormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.MaxLengthValidator, i1.NgModel, i1.NgForm], styles: [".capsule-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-5);\n}\n\n.form-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-2);\n}\n\n.input-label[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  font-weight: var(--font-medium);\n  color: var(--color-text);\n}\n\n.form-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: var(--space-4);\n}\n\n.error-text[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  color: var(--color-error);\n  margin-top: var(--space-1);\n}\n\n.submit-btn[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: var(--space-2);\n}\n\n@media (max-width: 640px) {\n  .form-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n\n\n\n[data-theme=\"dark\"][_nghost-%COMP%]   input[type=\"datetime-local\"][_ngcontent-%COMP%]::-webkit-calendar-picker-indicator, [data-theme=\"dark\"]   [_nghost-%COMP%]   input[type=\"datetime-local\"][_ngcontent-%COMP%]::-webkit-calendar-picker-indicator {\n  filter: invert(1);\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CapsuleFormComponent, [{
        type: Component,
        args: [{ selector: 'app-capsule-form', standalone: true, imports: [FormsModule], template: "<form class=\"capsule-form\" (ngSubmit)=\"handleSubmit()\">\n  <div class=\"form-group\">\n    <label class=\"input-label\" for=\"title\">\u6807\u9898</label>\n    <input\n      id=\"title\"\n      [(ngModel)]=\"form.title\"\n      name=\"title\"\n      class=\"input\"\n      [class.input-error]=\"errors.title\"\n      placeholder=\"\u7ED9\u65F6\u95F4\u80F6\u56CA\u53D6\u4E2A\u540D\u5B57\"\n      maxlength=\"100\"\n    />\n    @if (errors.title) {\n      <p class=\"error-text\">{{ errors.title }}</p>\n    }\n  </div>\n\n  <div class=\"form-group\">\n    <label class=\"input-label\" for=\"content\">\u5185\u5BB9</label>\n    <textarea\n      id=\"content\"\n      [(ngModel)]=\"form.content\"\n      name=\"content\"\n      class=\"input\"\n      [class.input-error]=\"errors.content\"\n      placeholder=\"\u5199\u4E0B\u4F60\u60F3\u5BF9\u672A\u6765\u8BF4\u7684\u8BDD...\"\n      rows=\"5\"\n    ></textarea>\n    @if (errors.content) {\n      <p class=\"error-text\">{{ errors.content }}</p>\n    }\n  </div>\n\n  <div class=\"form-row\">\n    <div class=\"form-group\">\n      <label class=\"input-label\" for=\"creator\">\u53D1\u5E03\u8005</label>\n      <input\n        id=\"creator\"\n        [(ngModel)]=\"form.creator\"\n        name=\"creator\"\n        class=\"input\"\n        [class.input-error]=\"errors.creator\"\n        placeholder=\"\u4F60\u7684\u6635\u79F0\"\n        maxlength=\"30\"\n      />\n      @if (errors.creator) {\n        <p class=\"error-text\">{{ errors.creator }}</p>\n      }\n    </div>\n\n    <div class=\"form-group\">\n      <label class=\"input-label\" for=\"openAt\">\u5F00\u542F\u65F6\u95F4</label>\n      <input\n        id=\"openAt\"\n        [(ngModel)]=\"form.openAt\"\n        name=\"openAt\"\n        type=\"datetime-local\"\n        class=\"input\"\n        [class.input-error]=\"errors.openAt\"\n        [min]=\"minDateTime\"\n      />\n      @if (errors.openAt) {\n        <p class=\"error-text\">{{ errors.openAt }}</p>\n      }\n    </div>\n  </div>\n\n  <button type=\"submit\" class=\"btn btn-primary btn-lg submit-btn\" [disabled]=\"loading\">\n    {{ loading ? '\u521B\u5EFA\u4E2D...' : '\u5C01\u5B58\u65F6\u95F4\u80F6\u56CA' }}\n  </button>\n</form>\n", styles: [".capsule-form {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-5);\n}\n\n.form-group {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-2);\n}\n\n.input-label {\n  font-size: var(--text-sm);\n  font-weight: var(--font-medium);\n  color: var(--color-text);\n}\n\n.form-row {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: var(--space-4);\n}\n\n.error-text {\n  font-size: var(--text-sm);\n  color: var(--color-error);\n  margin-top: var(--space-1);\n}\n\n.submit-btn {\n  width: 100%;\n  margin-top: var(--space-2);\n}\n\n@media (max-width: 640px) {\n  .form-row {\n    grid-template-columns: 1fr;\n  }\n}\n\n/* \u6697\u8272\u6A21\u5F0F\u4E0B\u53CD\u8F6C\u65E5\u671F\u9009\u62E9\u5668\u56FE\u6807\u989C\u8272 */\n:host-context([data-theme=\"dark\"]) input[type=\"datetime-local\"]::-webkit-calendar-picker-indicator {\n  filter: invert(1);\n}\n"] }]
    }], null, { loading: [{
            type: Input
        }], formSubmit: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(CapsuleFormComponent, { className: "CapsuleFormComponent" }); })();
