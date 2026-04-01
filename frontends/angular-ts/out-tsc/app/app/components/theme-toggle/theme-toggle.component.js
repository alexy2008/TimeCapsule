import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import * as i0 from "@angular/core";
function ThemeToggleComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1, "\uD83C\uDF19");
    i0.ɵɵelementEnd();
} }
function ThemeToggleComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1, "\u2600\uFE0F");
    i0.ɵɵelementEnd();
} }
export class ThemeToggleComponent {
    constructor() {
        this.themeService = inject(ThemeService);
    }
    static { this.ɵfac = function ThemeToggleComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ThemeToggleComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ThemeToggleComponent, selectors: [["app-theme-toggle"]], standalone: true, features: [i0.ɵɵStandaloneFeature], decls: 3, vars: 2, consts: [["type", "button", 1, "theme-toggle", 3, "click", "title"]], template: function ThemeToggleComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "button", 0);
            i0.ɵɵlistener("click", function ThemeToggleComponent_Template_button_click_0_listener() { return ctx.themeService.toggle(); });
            i0.ɵɵtemplate(1, ThemeToggleComponent_Conditional_1_Template, 2, 0, "span")(2, ThemeToggleComponent_Conditional_2_Template, 2, 0, "span");
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵproperty("title", ctx.themeService.theme() === "light" ? "\u5207\u6362\u5230\u6697\u8272\u6A21\u5F0F" : "\u5207\u6362\u5230\u4EAE\u8272\u6A21\u5F0F");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.themeService.theme() === "light" ? 1 : 2);
        } }, styles: [".theme-toggle[_ngcontent-%COMP%] {\n  background: none;\n  border: 1px solid var(--color-border);\n  border-radius: var(--radius-md);\n  cursor: pointer;\n  padding: var(--space-1) var(--space-2);\n  font-size: var(--text-base);\n  line-height: 1;\n  transition: background-color var(--transition-fast), border-color var(--transition-fast);\n  color: var(--color-text);\n}\n\n.theme-toggle[_ngcontent-%COMP%]:hover {\n  background-color: var(--color-bg-secondary);\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ThemeToggleComponent, [{
        type: Component,
        args: [{ selector: 'app-theme-toggle', standalone: true, imports: [], template: "<button\n  class=\"theme-toggle\"\n  (click)=\"themeService.toggle()\"\n  [title]=\"themeService.theme() === 'light' ? '\u5207\u6362\u5230\u6697\u8272\u6A21\u5F0F' : '\u5207\u6362\u5230\u4EAE\u8272\u6A21\u5F0F'\"\n  type=\"button\"\n>\n  @if (themeService.theme() === 'light') {\n    <span>\uD83C\uDF19</span>\n  } @else {\n    <span>\u2600\uFE0F</span>\n  }\n</button>\n", styles: [".theme-toggle {\n  background: none;\n  border: 1px solid var(--color-border);\n  border-radius: var(--radius-md);\n  cursor: pointer;\n  padding: var(--space-1) var(--space-2);\n  font-size: var(--text-base);\n  line-height: 1;\n  transition: background-color var(--transition-fast), border-color var(--transition-fast);\n  color: var(--color-text);\n}\n\n.theme-toggle:hover {\n  background-color: var(--color-bg-secondary);\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ThemeToggleComponent, { className: "ThemeToggleComponent" }); })();
