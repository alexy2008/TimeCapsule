import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
function ConfirmDialogComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 1);
    i0.ɵɵlistener("click", function ConfirmDialogComponent_Conditional_0_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.cancel.emit()); });
    i0.ɵɵelementStart(1, "div", 2);
    i0.ɵɵlistener("click", function ConfirmDialogComponent_Conditional_0_Template_div_click_1_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(2, "h3", 3);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 4);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 5)(7, "button", 6);
    i0.ɵɵlistener("click", function ConfirmDialogComponent_Conditional_0_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.cancel.emit()); });
    i0.ɵɵtext(8, "\u53D6\u6D88");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "button", 7);
    i0.ɵɵlistener("click", function ConfirmDialogComponent_Conditional_0_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.confirm.emit()); });
    i0.ɵɵtext(10, "\u786E\u8BA4");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.message);
} }
export class ConfirmDialogComponent {
    constructor() {
        this.visible = false;
        this.title = '';
        this.message = '';
        this.confirm = new EventEmitter();
        this.cancel = new EventEmitter();
    }
    static { this.ɵfac = function ConfirmDialogComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ConfirmDialogComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ConfirmDialogComponent, selectors: [["app-confirm-dialog"]], inputs: { visible: "visible", title: "title", message: "message" }, outputs: { confirm: "confirm", cancel: "cancel" }, standalone: true, features: [i0.ɵɵStandaloneFeature], decls: 1, vars: 1, consts: [[1, "overlay"], [1, "overlay", 3, "click"], [1, "dialog", "card", 3, "click"], [1, "dialog-title"], [1, "dialog-message"], [1, "dialog-actions"], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], ["type", "button", 1, "btn", "btn-primary", 3, "click"]], template: function ConfirmDialogComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, ConfirmDialogComponent_Conditional_0_Template, 11, 2, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.visible ? 0 : -1);
        } }, styles: [".overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  background-color: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 100;\n  padding: var(--space-4);\n}\n\n.dialog[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 440px;\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-4);\n}\n\n.dialog-title[_ngcontent-%COMP%] {\n  font-size: var(--text-lg);\n  font-weight: var(--font-semibold);\n}\n\n.dialog-message[_ngcontent-%COMP%] {\n  color: var(--color-text-secondary);\n  line-height: var(--leading-relaxed);\n}\n\n.dialog-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: var(--space-3);\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ConfirmDialogComponent, [{
        type: Component,
        args: [{ selector: 'app-confirm-dialog', standalone: true, imports: [], template: "@if (visible) {\n  <div class=\"overlay\" (click)=\"cancel.emit()\">\n    <div class=\"dialog card\" (click)=\"$event.stopPropagation()\">\n      <h3 class=\"dialog-title\">{{ title }}</h3>\n      <p class=\"dialog-message\">{{ message }}</p>\n      <div class=\"dialog-actions\">\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"cancel.emit()\">\u53D6\u6D88</button>\n        <button type=\"button\" class=\"btn btn-primary\" (click)=\"confirm.emit()\">\u786E\u8BA4</button>\n      </div>\n    </div>\n  </div>\n}\n", styles: [".overlay {\n  position: fixed;\n  inset: 0;\n  background-color: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 100;\n  padding: var(--space-4);\n}\n\n.dialog {\n  width: 100%;\n  max-width: 440px;\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-4);\n}\n\n.dialog-title {\n  font-size: var(--text-lg);\n  font-weight: var(--font-semibold);\n}\n\n.dialog-message {\n  color: var(--color-text-secondary);\n  line-height: var(--leading-relaxed);\n}\n\n.dialog-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: var(--space-3);\n}\n"] }]
    }], null, { visible: [{
            type: Input
        }], title: [{
            type: Input
        }], message: [{
            type: Input
        }], confirm: [{
            type: Output
        }], cancel: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ConfirmDialogComponent, { className: "ConfirmDialogComponent" }); })();
