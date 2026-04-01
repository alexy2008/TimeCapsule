import { Component, inject } from '@angular/core';
import { TechStackService } from '../../services/tech-stack.service';
import * as i0 from "@angular/core";
export class AppFooterComponent {
    constructor() {
        this.techStackService = inject(TechStackService);
        this.techStack = this.techStackService.techStack;
        this.loading = this.techStackService.loading;
        this.error = this.techStackService.error;
    }
    ngOnInit() {
        this.techStackService.load();
    }
    static { this.ɵfac = function AppFooterComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppFooterComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppFooterComponent, selectors: [["app-footer"]], standalone: true, features: [i0.ɵɵStandaloneFeature], decls: 7, vars: 1, consts: [[1, "footer"], [1, "container", "footer-inner"], [1, "footer-text"], [1, "tech-stack"]], template: function AppFooterComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "footer", 0)(1, "div", 1)(2, "p", 2)(3, "span");
            i0.ɵɵtext(4, "Powered By:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "span", 3);
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate1(" ", ctx.loading() ? "\u52A0\u8F7D\u4E2D..." : ctx.error() || !ctx.techStack() ? "\u6280\u672F\u6808\u4FE1\u606F\u6682\u4E0D\u53EF\u7528" : "Angular 18 | " + ctx.techStack().framework + " | " + ctx.techStack().language + " | " + ctx.techStack().database, " ");
        } }, styles: [".footer[_ngcontent-%COMP%] {\n  padding: var(--space-6) 0;\n  border-top: 1px solid var(--color-border);\n  transition: border-color var(--transition-base);\n}\n\n.footer-inner[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.footer-text[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n}\n\n.tech-stack[_ngcontent-%COMP%] {\n  margin-left: var(--space-3);\n  color: var(--color-text-tertiary);\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppFooterComponent, [{
        type: Component,
        args: [{ selector: 'app-footer', standalone: true, imports: [], template: "<footer class=\"footer\">\n  <div class=\"container footer-inner\">\n    <p class=\"footer-text\">\n      <span>Powered By:</span>\n      <span class=\"tech-stack\">\n        {{ loading() ? '\u52A0\u8F7D\u4E2D...' : error() || !techStack() ? '\u6280\u672F\u6808\u4FE1\u606F\u6682\u4E0D\u53EF\u7528' : 'Angular 18 | ' + techStack()!.framework + ' | ' + techStack()!.language + ' | ' + techStack()!.database }}\n      </span>\n    </p>\n  </div>\n</footer>\n", styles: [".footer {\n  padding: var(--space-6) 0;\n  border-top: 1px solid var(--color-border);\n  transition: border-color var(--transition-base);\n}\n\n.footer-inner {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.footer-text {\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n}\n\n.tech-stack {\n  margin-left: var(--space-3);\n  color: var(--color-text-tertiary);\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppFooterComponent, { className: "AppFooterComponent" }); })();
