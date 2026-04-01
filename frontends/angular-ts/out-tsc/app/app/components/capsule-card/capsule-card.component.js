import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CountdownClockComponent } from '../countdown-clock/countdown-clock.component';
import * as i0 from "@angular/core";
function CapsuleCardComponent_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 6)(1, "p", 8);
    i0.ɵɵtext(2, "\u5185\u5BB9");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 9);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.capsule.content);
} }
function CapsuleCardComponent_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 7)(1, "p", 10);
    i0.ɵɵtext(2, "\uD83D\uDD12");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 11);
    i0.ɵɵtext(4, "\u80F6\u56CA\u5C1A\u672A\u5230\u5F00\u542F\u65F6\u95F4");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "app-countdown-clock", 12);
    i0.ɵɵlistener("expired", function CapsuleCardComponent_Conditional_19_Template_app_countdown_clock_expired_5_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.expired.emit()); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("targetIso", ctx_r0.capsule.openAt);
} }
export class CapsuleCardComponent {
    constructor() {
        this.expired = new EventEmitter();
    }
    formatTime(iso) {
        return new Date(iso).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
    static { this.ɵfac = function CapsuleCardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CapsuleCardComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: CapsuleCardComponent, selectors: [["app-capsule-card"]], inputs: { capsule: "capsule" }, outputs: { expired: "expired" }, standalone: true, features: [i0.ɵɵStandaloneFeature], decls: 20, vars: 11, consts: [[1, "card", "capsule-card"], [1, "card-header"], [1, "card-title"], [1, "badge"], [1, "capsule-meta"], [1, "capsule-times"], [1, "capsule-content"], [1, "capsule-locked"], [1, "content-label"], [1, "content-text"], [1, "lock-icon"], [1, "lock-text"], [3, "expired", "targetIso"]], template: function CapsuleCardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "h3", 2);
            i0.ɵɵtext(3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "span", 3);
            i0.ɵɵtext(5);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 4)(7, "span");
            i0.ɵɵtext(8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "span");
            i0.ɵɵtext(10, "\u80F6\u56CA\u7801: ");
            i0.ɵɵelementStart(11, "code");
            i0.ɵɵtext(12);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(13, "div", 5)(14, "span");
            i0.ɵɵtext(15);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "span");
            i0.ɵɵtext(17);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(18, CapsuleCardComponent_Conditional_18_Template, 5, 1, "div", 6)(19, CapsuleCardComponent_Conditional_19_Template, 6, 1, "div", 7);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.capsule.title);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("badge-success", ctx.capsule.opened)("badge-warning", !ctx.capsule.opened);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.capsule.opened ? "\u5DF2\u5F00\u542F" : "\u672A\u5230\u65F6\u95F4", " ");
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1("\u53D1\u5E03\u8005: ", ctx.capsule.creator, "");
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.capsule.code);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1("\u521B\u5EFA\u4E8E: ", ctx.formatTime(ctx.capsule.createdAt), "");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1("\u5F00\u542F\u4E8E: ", ctx.formatTime(ctx.capsule.openAt), "");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.capsule.opened && ctx.capsule.content ? 18 : !ctx.capsule.opened ? 19 : -1);
        } }, dependencies: [CountdownClockComponent], styles: [".capsule-card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-4);\n}\n\n.card-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: var(--space-3);\n}\n\n.card-title[_ngcontent-%COMP%] {\n  font-size: var(--text-xl);\n  font-weight: var(--font-semibold);\n  color: var(--color-text);\n}\n\n\n.capsule-meta[_ngcontent-%COMP%], \n.capsule-times[_ngcontent-%COMP%] {\n  display: flex;\n  gap: var(--space-4);\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n  flex-wrap: wrap;\n}\n\ncode[_ngcontent-%COMP%] {\n  font-family: var(--font-mono);\n  background-color: var(--color-bg-secondary);\n  padding: 0 var(--space-1);\n  border-radius: var(--radius-sm);\n}\n\n.capsule-content[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--color-border);\n  padding-top: var(--space-4);\n}\n\n.content-label[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  font-weight: var(--font-medium);\n  color: var(--color-text-secondary);\n  margin-bottom: var(--space-2);\n}\n\n.content-text[_ngcontent-%COMP%] {\n  color: var(--color-text);\n  line-height: var(--leading-relaxed);\n  white-space: pre-wrap;\n}\n\n.capsule-locked[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: var(--space-6) 0;\n  border-top: 1px solid var(--color-border);\n}\n\n.lock-icon[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  margin-bottom: var(--space-2);\n}\n\n.lock-text[_ngcontent-%COMP%] {\n  font-size: var(--text-base);\n  color: var(--color-text-secondary);\n  margin-bottom: var(--space-1);\n}\n\n.lock-remaining[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  color: var(--color-text-tertiary);\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CapsuleCardComponent, [{
        type: Component,
        args: [{ selector: 'app-capsule-card', standalone: true, imports: [CountdownClockComponent], template: "<div class=\"card capsule-card\">\n  <div class=\"card-header\">\n    <h3 class=\"card-title\">{{ capsule.title }}</h3>\n    <span class=\"badge\" [class.badge-success]=\"capsule.opened\" [class.badge-warning]=\"!capsule.opened\">\n      {{ capsule.opened ? '\u5DF2\u5F00\u542F' : '\u672A\u5230\u65F6\u95F4' }}\n    </span>\n  </div>\n\n  <div class=\"capsule-meta\">\n    <span>\u53D1\u5E03\u8005: {{ capsule.creator }}</span>\n    <span>\u80F6\u56CA\u7801: <code>{{ capsule.code }}</code></span>\n  </div>\n\n  <div class=\"capsule-times\">\n    <span>\u521B\u5EFA\u4E8E: {{ formatTime(capsule.createdAt) }}</span>\n    <span>\u5F00\u542F\u4E8E: {{ formatTime(capsule.openAt) }}</span>\n  </div>\n\n  @if (capsule.opened && capsule.content) {\n    <div class=\"capsule-content\">\n      <p class=\"content-label\">\u5185\u5BB9</p>\n      <p class=\"content-text\">{{ capsule.content }}</p>\n    </div>\n  } @else if (!capsule.opened) {\n    <div class=\"capsule-locked\">\n      <p class=\"lock-icon\">\uD83D\uDD12</p>\n      <p class=\"lock-text\">\u80F6\u56CA\u5C1A\u672A\u5230\u5F00\u542F\u65F6\u95F4</p>\n      <app-countdown-clock [targetIso]=\"capsule.openAt\" (expired)=\"expired.emit()\" />\n    </div>\n  }\n</div>\n", styles: [".capsule-card {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-4);\n}\n\n.card-header {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: var(--space-3);\n}\n\n.card-title {\n  font-size: var(--text-xl);\n  font-weight: var(--font-semibold);\n  color: var(--color-text);\n}\n\n\n.capsule-meta,\n.capsule-times {\n  display: flex;\n  gap: var(--space-4);\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n  flex-wrap: wrap;\n}\n\ncode {\n  font-family: var(--font-mono);\n  background-color: var(--color-bg-secondary);\n  padding: 0 var(--space-1);\n  border-radius: var(--radius-sm);\n}\n\n.capsule-content {\n  border-top: 1px solid var(--color-border);\n  padding-top: var(--space-4);\n}\n\n.content-label {\n  font-size: var(--text-sm);\n  font-weight: var(--font-medium);\n  color: var(--color-text-secondary);\n  margin-bottom: var(--space-2);\n}\n\n.content-text {\n  color: var(--color-text);\n  line-height: var(--leading-relaxed);\n  white-space: pre-wrap;\n}\n\n.capsule-locked {\n  text-align: center;\n  padding: var(--space-6) 0;\n  border-top: 1px solid var(--color-border);\n}\n\n.lock-icon {\n  font-size: 2rem;\n  margin-bottom: var(--space-2);\n}\n\n.lock-text {\n  font-size: var(--text-base);\n  color: var(--color-text-secondary);\n  margin-bottom: var(--space-1);\n}\n\n.lock-remaining {\n  font-size: var(--text-sm);\n  color: var(--color-text-tertiary);\n}\n"] }]
    }], null, { capsule: [{
            type: Input,
            args: [{ required: true }]
        }], expired: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(CapsuleCardComponent, { className: "CapsuleCardComponent" }); })();
