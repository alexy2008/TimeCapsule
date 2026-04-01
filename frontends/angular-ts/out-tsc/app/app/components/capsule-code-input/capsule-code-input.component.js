import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
function CapsuleCodeInputComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 4);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.error);
} }
export class CapsuleCodeInputComponent {
    constructor() {
        this.value = '';
        this.loading = false;
        this.error = null;
        this.valueChange = new EventEmitter();
        this.codeSubmit = new EventEmitter();
        this.code = '';
    }
    ngOnChanges() {
        this.code = this.value;
    }
    onCodeChange(val) {
        this.code = val;
        this.valueChange.emit(val);
    }
    handleSubmit() {
        if (this.code.trim().length > 0) {
            this.codeSubmit.emit(this.code.trim());
        }
    }
    handleKeyup(event) {
        if (event.key === 'Enter') {
            this.handleSubmit();
        }
    }
    static { this.ɵfac = function CapsuleCodeInputComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CapsuleCodeInputComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: CapsuleCodeInputComponent, selectors: [["app-capsule-code-input"]], inputs: { value: "value", loading: "loading", error: "error" }, outputs: { valueChange: "valueChange", codeSubmit: "codeSubmit" }, standalone: true, features: [i0.ɵɵNgOnChangesFeature, i0.ɵɵStandaloneFeature], decls: 6, vars: 4, consts: [[1, "code-input-wrapper"], [1, "input-row"], ["name", "code", "placeholder", "\u8F93\u5165 8 \u4F4D\u80F6\u56CA\u7801", "maxlength", "8", "autocomplete", "off", "spellcheck", "false", 1, "input", "code-input", 3, "ngModelChange", "keyup", "ngModel"], ["type", "button", 1, "btn", "btn-primary", 3, "click", "disabled"], [1, "error-text"]], template: function CapsuleCodeInputComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "input", 2);
            i0.ɵɵlistener("ngModelChange", function CapsuleCodeInputComponent_Template_input_ngModelChange_2_listener($event) { return ctx.onCodeChange($event); })("keyup", function CapsuleCodeInputComponent_Template_input_keyup_2_listener($event) { return ctx.handleKeyup($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "button", 3);
            i0.ɵɵlistener("click", function CapsuleCodeInputComponent_Template_button_click_3_listener() { return ctx.handleSubmit(); });
            i0.ɵɵtext(4);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(5, CapsuleCodeInputComponent_Conditional_5_Template, 2, 1, "p", 4);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngModel", ctx.code);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.loading || ctx.code.trim().length === 0);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.loading ? "\u67E5\u8BE2\u4E2D..." : "\u5F00\u542F", " ");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.error ? 5 : -1);
        } }, dependencies: [FormsModule, i1.DefaultValueAccessor, i1.NgControlStatus, i1.MaxLengthValidator, i1.NgModel], styles: [".code-input-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-2);\n}\n\n.input-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: var(--space-3);\n}\n\n.code-input[_ngcontent-%COMP%] {\n  flex: 1;\n  font-family: var(--font-mono);\n  font-size: var(--text-lg);\n  letter-spacing: 0.1em;\n  text-align: center;\n}\n\n.error-text[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  color: var(--color-error);\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CapsuleCodeInputComponent, [{
        type: Component,
        args: [{ selector: 'app-capsule-code-input', standalone: true, imports: [FormsModule], template: "<div class=\"code-input-wrapper\">\n  <div class=\"input-row\">\n    <input\n      class=\"input code-input\"\n      [ngModel]=\"code\"\n      (ngModelChange)=\"onCodeChange($event)\"\n      name=\"code\"\n      placeholder=\"\u8F93\u5165 8 \u4F4D\u80F6\u56CA\u7801\"\n      maxlength=\"8\"\n      (keyup)=\"handleKeyup($event)\"\n      autocomplete=\"off\"\n      spellcheck=\"false\"\n    />\n    <button\n      type=\"button\"\n      class=\"btn btn-primary\"\n      (click)=\"handleSubmit()\"\n      [disabled]=\"loading || code.trim().length === 0\"\n    >\n      {{ loading ? '\u67E5\u8BE2\u4E2D...' : '\u5F00\u542F' }}\n    </button>\n  </div>\n  @if (error) {\n    <p class=\"error-text\">{{ error }}</p>\n  }\n</div>\n", styles: [".code-input-wrapper {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-2);\n}\n\n.input-row {\n  display: flex;\n  gap: var(--space-3);\n}\n\n.code-input {\n  flex: 1;\n  font-family: var(--font-mono);\n  font-size: var(--text-lg);\n  letter-spacing: 0.1em;\n  text-align: center;\n}\n\n.error-text {\n  font-size: var(--text-sm);\n  color: var(--color-error);\n}\n"] }]
    }], null, { value: [{
            type: Input
        }], loading: [{
            type: Input
        }], error: [{
            type: Input
        }], valueChange: [{
            type: Output
        }], codeSubmit: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(CapsuleCodeInputComponent, { className: "CapsuleCodeInputComponent" }); })();
