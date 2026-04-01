import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.label;
function CountdownClockComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 0)(1, "span", 2);
    i0.ɵɵtext(2, "\uD83C\uDF89");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "\u65F6\u95F4\u5DF2\u5230\uFF0C\u80F6\u56CA\u5373\u5C06\u5F00\u542F\u2026");
    i0.ɵɵelementEnd()();
} }
function CountdownClockComponent_Conditional_1_For_5_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 9);
    i0.ɵɵtext(1, ":");
    i0.ɵɵelementEnd();
} }
function CountdownClockComponent_Conditional_1_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5)(1, "div", 6)(2, "span", 7);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "span", 8);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, CountdownClockComponent_Conditional_1_For_5_Conditional_6_Template, 2, 0, "span", 9);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const unit_r1 = ctx.$implicit;
    const ɵ$index_18_r2 = ctx.$index;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r2.pad(unit_r1.value));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(unit_r1.label);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ɵ$index_18_r2 < ctx_r2.units().length - 1 ? 6 : -1);
} }
function CountdownClockComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 1)(1, "p", 3);
    i0.ɵɵtext(2, "\u8DDD\u79BB\u5F00\u542F\u8FD8\u6709");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 4);
    i0.ɵɵrepeaterCreate(4, CountdownClockComponent_Conditional_1_For_5_Template, 7, 3, "div", 5, _forTrack0);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r2.units());
} }
export class CountdownClockComponent {
    constructor() {
        this.expired = new EventEmitter();
        this.days = signal(0);
        this.hours = signal(0);
        this.minutes = signal(0);
        this.seconds = signal(0);
        this.isExpired = signal(false);
        this.timer = null;
        this.expiredTimer = null;
        this.units = computed(() => [
            { value: this.days(), label: '天' },
            { value: this.hours(), label: '时' },
            { value: this.minutes(), label: '分' },
            { value: this.seconds(), label: '秒' },
        ]);
    }
    ngOnInit() {
        this.tick();
        this.timer = setInterval(() => this.tick(), 1000);
    }
    ngOnDestroy() {
        if (this.timer)
            clearInterval(this.timer);
        if (this.expiredTimer)
            clearTimeout(this.expiredTimer);
    }
    tick() {
        const diff = new Date(this.targetIso).getTime() - Date.now();
        if (diff <= 0) {
            this.days.set(0);
            this.hours.set(0);
            this.minutes.set(0);
            this.seconds.set(0);
            if (!this.isExpired()) {
                this.isExpired.set(true);
                if (this.timer)
                    clearInterval(this.timer);
                this.expiredTimer = setTimeout(() => this.expired.emit(), 3000);
            }
            return;
        }
        const totalSeconds = Math.floor(diff / 1000);
        this.days.set(Math.floor(totalSeconds / 86400));
        this.hours.set(Math.floor((totalSeconds % 86400) / 3600));
        this.minutes.set(Math.floor((totalSeconds % 3600) / 60));
        this.seconds.set(totalSeconds % 60);
    }
    pad(n) {
        return String(n).padStart(2, '0');
    }
    static { this.ɵfac = function CountdownClockComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CountdownClockComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: CountdownClockComponent, selectors: [["app-countdown-clock"]], inputs: { targetIso: "targetIso" }, outputs: { expired: "expired" }, standalone: true, features: [i0.ɵɵStandaloneFeature], decls: 2, vars: 1, consts: [[1, "expired-msg"], [1, "clock"], [1, "expired-icon"], [1, "clock-title"], [1, "units"], [1, "unit-group"], [1, "clock-card"], [1, "number"], [1, "label"], [1, "colon"]], template: function CountdownClockComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, CountdownClockComponent_Conditional_0_Template, 5, 0, "div", 0)(1, CountdownClockComponent_Conditional_1_Template, 6, 0, "div", 1);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isExpired() ? 0 : 1);
        } }, dependencies: [CommonModule], styles: [".clock[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: var(--space-6) var(--space-4);\n  gap: var(--space-4);\n}\n\n.clock-title[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n  letter-spacing: 0.05em;\n  margin: 0;\n}\n\n.units[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: var(--space-2);\n}\n\n.unit-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  align-items: flex-start;\n  gap: var(--space-2);\n}\n\n.clock-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 64px;\n  height: 72px;\n  background: var(--color-bg-secondary);\n  border: 1px solid var(--color-border);\n  border-radius: var(--radius-lg);\n  box-shadow: var(--shadow-sm);\n  position: relative;\n  overflow: hidden;\n}\n\n.clock-card[_ngcontent-%COMP%]::after {\n  content: '';\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 50%;\n  height: 1px;\n  background: var(--color-border);\n}\n\n.number[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: var(--font-bold);\n  font-variant-numeric: tabular-nums;\n  color: var(--color-text);\n  line-height: 1;\n  z-index: 1;\n}\n\n.label[_ngcontent-%COMP%] {\n  font-size: var(--text-xs);\n  color: var(--color-text-secondary);\n  margin-top: var(--space-1);\n  align-self: flex-end;\n  padding-bottom: var(--space-1);\n}\n\n.colon[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: var(--font-bold);\n  color: var(--color-text-secondary);\n  line-height: 1;\n  align-self: flex-start;\n  margin-top: 18px;\n}\n\n.unit-group[_ngcontent-%COMP%]:last-child   .clock-card[_ngcontent-%COMP%] {\n  border-color: var(--color-primary);\n  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-bg-secondary));\n}\n\n.unit-group[_ngcontent-%COMP%]:last-child   .number[_ngcontent-%COMP%] {\n  color: var(--color-primary);\n}\n\n.expired-msg[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--space-2);\n  padding: var(--space-4);\n  color: var(--color-success);\n  font-size: var(--text-base);\n}\n\n.expired-icon[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n}\n\n@media (max-width: 400px) {\n  .clock-card[_ngcontent-%COMP%] {\n    width: 52px;\n    height: 60px;\n  }\n  .number[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CountdownClockComponent, [{
        type: Component,
        args: [{ selector: 'app-countdown-clock', standalone: true, imports: [CommonModule], template: "@if (isExpired()) {\n  <div class=\"expired-msg\">\n    <span class=\"expired-icon\">\uD83C\uDF89</span>\n    <span>\u65F6\u95F4\u5DF2\u5230\uFF0C\u80F6\u56CA\u5373\u5C06\u5F00\u542F\u2026</span>\n  </div>\n} @else {\n  <div class=\"clock\">\n    <p class=\"clock-title\">\u8DDD\u79BB\u5F00\u542F\u8FD8\u6709</p>\n    <div class=\"units\">\n      @for (unit of units(); track unit.label; let i = $index) {\n        <div class=\"unit-group\">\n          <div class=\"clock-card\">\n            <span class=\"number\">{{ pad(unit.value) }}</span>\n          </div>\n          <span class=\"label\">{{ unit.label }}</span>\n          @if (i < units().length - 1) {\n            <span class=\"colon\">:</span>\n          }\n        </div>\n      }\n    </div>\n  </div>\n}\n", styles: [".clock {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: var(--space-6) var(--space-4);\n  gap: var(--space-4);\n}\n\n.clock-title {\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n  letter-spacing: 0.05em;\n  margin: 0;\n}\n\n.units {\n  display: flex;\n  align-items: flex-start;\n  gap: var(--space-2);\n}\n\n.unit-group {\n  display: flex;\n  flex-direction: row;\n  align-items: flex-start;\n  gap: var(--space-2);\n}\n\n.clock-card {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 64px;\n  height: 72px;\n  background: var(--color-bg-secondary);\n  border: 1px solid var(--color-border);\n  border-radius: var(--radius-lg);\n  box-shadow: var(--shadow-sm);\n  position: relative;\n  overflow: hidden;\n}\n\n.clock-card::after {\n  content: '';\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 50%;\n  height: 1px;\n  background: var(--color-border);\n}\n\n.number {\n  font-size: 2rem;\n  font-weight: var(--font-bold);\n  font-variant-numeric: tabular-nums;\n  color: var(--color-text);\n  line-height: 1;\n  z-index: 1;\n}\n\n.label {\n  font-size: var(--text-xs);\n  color: var(--color-text-secondary);\n  margin-top: var(--space-1);\n  align-self: flex-end;\n  padding-bottom: var(--space-1);\n}\n\n.colon {\n  font-size: 2rem;\n  font-weight: var(--font-bold);\n  color: var(--color-text-secondary);\n  line-height: 1;\n  align-self: flex-start;\n  margin-top: 18px;\n}\n\n.unit-group:last-child .clock-card {\n  border-color: var(--color-primary);\n  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-bg-secondary));\n}\n\n.unit-group:last-child .number {\n  color: var(--color-primary);\n}\n\n.expired-msg {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--space-2);\n  padding: var(--space-4);\n  color: var(--color-success);\n  font-size: var(--text-base);\n}\n\n.expired-icon {\n  font-size: 1.5rem;\n}\n\n@media (max-width: 400px) {\n  .clock-card {\n    width: 52px;\n    height: 60px;\n  }\n  .number {\n    font-size: 1.5rem;\n  }\n}\n"] }]
    }], null, { targetIso: [{
            type: Input,
            args: [{ required: true }]
        }], expired: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(CountdownClockComponent, { className: "CountdownClockComponent" }); })();
