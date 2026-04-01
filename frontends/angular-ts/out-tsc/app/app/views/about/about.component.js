import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TechStackService } from '../../services/tech-stack.service';
import * as i0 from "@angular/core";
function AboutComponent_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 5);
    i0.ɵɵtext(1, "\u5F53\u524D\u65E0\u6CD5\u83B7\u53D6\u670D\u52A1\u7AEF\u6280\u672F\u6808\u8BE6\u60C5\u3002");
    i0.ɵɵelementEnd();
} }
export class AboutComponent {
    constructor() {
        this.router = inject(Router);
        this.techStackService = inject(TechStackService);
        this.techStack = this.techStackService.techStack;
        this.loading = this.techStackService.loading;
        this.error = this.techStackService.error;
        this.clickCount = signal(0);
    }
    ngOnInit() {
        this.techStackService.load();
    }
    handleSecretClick() {
        this.clickCount.update(n => n + 1);
        if (this.clickCount() >= 5) {
            this.clickCount.set(0);
            this.router.navigate(['/admin']);
        }
    }
    static { this.ɵfac = function AboutComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AboutComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AboutComponent, selectors: [["app-about"]], standalone: true, features: [i0.ɵɵStandaloneFeature], decls: 57, vars: 4, consts: [[1, "page"], [1, "container", "container-sm"], [1, "page-header"], [1, "card", "about-section"], [1, "tech-list"], [1, "text-sm", "text-secondary", "mt-4"], [1, "version-text", 3, "click"]], template: function AboutComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1");
            i0.ɵɵtext(4, "\u5173\u4E8E\u65F6\u95F4\u80F6\u56CA");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "p");
            i0.ɵɵtext(6, "\u4E00\u4E2A\u6280\u672F\u5C55\u793A\u9879\u76EE");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "div", 3)(8, "h3");
            i0.ɵɵtext(9, "\u9879\u76EE\u7B80\u4ECB");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "p");
            i0.ɵɵtext(11, " \u65F6\u95F4\u80F6\u56CA (HelloTime) \u662F\u4E00\u4E2A\u7C7B\u4F3C RealWorld \u7684\u6280\u672F\u5C55\u793A\u5E94\u7528\u3002 \u901A\u8FC7\u7EDF\u4E00\u7684 API \u89C4\u8303\u548C\u53EF\u590D\u7528\u7684\u524D\u7AEF\u6837\u5F0F\uFF0C\u5C55\u793A\u4E0D\u540C\u524D\u540E\u7AEF\u6280\u672F\u6808\u7684\u7EC4\u5408\u80FD\u529B\u3002 ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(12, "div", 3)(13, "h3");
            i0.ɵɵtext(14, "\u5F53\u524D\u6280\u672F\u6808");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "ul", 4)(16, "li")(17, "strong");
            i0.ɵɵtext(18, "\u524D\u7AEF\u6846\u67B6:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(19, " Angular 18 + TypeScript");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "li")(21, "strong");
            i0.ɵɵtext(22, "\u540E\u7AEF\u6846\u67B6:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(23);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "li")(25, "strong");
            i0.ɵɵtext(26, "\u540E\u7AEF\u8BED\u8A00:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(27);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "li")(29, "strong");
            i0.ɵɵtext(30, "\u6570\u636E\u5E93:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(31);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "li")(33, "strong");
            i0.ɵɵtext(34, "\u6837\u5F0F\u7CFB\u7EDF:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(35, " \u5171\u4EAB CSS Design Tokens");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(36, "li")(37, "strong");
            i0.ɵɵtext(38, "\u72B6\u6001\u7BA1\u7406:");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(39, " Angular Signals");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(40, AboutComponent_Conditional_40_Template, 2, 0, "p", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "div", 3)(42, "h3");
            i0.ɵɵtext(43, "\u8BBE\u8BA1\u7406\u5FF5");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "ul", 4)(45, "li");
            i0.ɵɵtext(46, "\u7EDF\u4E00\u7684 REST API \u89C4\u8303 (OpenAPI 3.0)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(47, "li");
            i0.ɵɵtext(48, "\u53EF\u590D\u7528\u7684\u524D\u7AEF\u6837\u5F0F\u7CFB\u7EDF (CSS \u81EA\u5B9A\u4E49\u5C5E\u6027)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(49, "li");
            i0.ɵɵtext(50, "\u652F\u6301\u4EAE\u8272 / \u6697\u8272\u4E3B\u9898\u5207\u6362");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(51, "li");
            i0.ɵɵtext(52, "\u524D\u540E\u7AEF\u5206\u79BB\uFF0C\u53EF\u81EA\u7531\u7EC4\u5408\u6280\u672F\u6808");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(53, "li");
            i0.ɵɵtext(54, "Angular Standalone Components\uFF0C\u65E0 NgModule");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(55, "p", 6);
            i0.ɵɵlistener("click", function AboutComponent_Template_p_click_55_listener() { return ctx.handleSecretClick(); });
            i0.ɵɵtext(56, "HelloTime v1.0.0");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            let tmp_0_0;
            let tmp_1_0;
            let tmp_2_0;
            i0.ɵɵadvance(23);
            i0.ɵɵtextInterpolate1(" ", ctx.loading() ? "\u52A0\u8F7D\u4E2D..." : ((tmp_0_0 = ctx.techStack()) == null ? null : tmp_0_0.framework) || "\u6280\u672F\u6808\u4FE1\u606F\u6682\u4E0D\u53EF\u7528", "");
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate1(" ", ctx.loading() ? "\u52A0\u8F7D\u4E2D..." : ((tmp_1_0 = ctx.techStack()) == null ? null : tmp_1_0.language) || "\u6280\u672F\u6808\u4FE1\u606F\u6682\u4E0D\u53EF\u7528", "");
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate1(" ", ctx.loading() ? "\u52A0\u8F7D\u4E2D..." : ((tmp_2_0 = ctx.techStack()) == null ? null : tmp_2_0.database) || "\u6280\u672F\u6808\u4FE1\u606F\u6682\u4E0D\u53EF\u7528", "");
            i0.ɵɵadvance(9);
            i0.ɵɵconditional(ctx.error() ? 40 : -1);
        } }, styles: [".page-header[_ngcontent-%COMP%] {\n  margin-bottom: var(--space-8);\n}\n\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: var(--text-2xl);\n  font-weight: var(--font-bold);\n  margin-bottom: var(--space-2);\n}\n\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--color-text-secondary);\n}\n\n.about-section[_ngcontent-%COMP%] {\n  margin-bottom: var(--space-6);\n}\n\n.about-section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: var(--text-lg);\n  font-weight: var(--font-semibold);\n  margin-bottom: var(--space-4);\n}\n\n.about-section[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--color-text-secondary);\n  line-height: var(--leading-relaxed);\n}\n\n.tech-list[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-2);\n}\n\n.tech-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n  padding: var(--space-2) 0;\n  border-bottom: 1px solid var(--color-border);\n}\n\n.tech-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n\n.version-text[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: var(--text-sm);\n  color: var(--color-text-tertiary);\n  margin-top: var(--space-8);\n  cursor: default;\n  user-select: none;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AboutComponent, [{
        type: Component,
        args: [{ selector: 'app-about', standalone: true, imports: [], template: "<div class=\"page\">\n  <div class=\"container container-sm\">\n    <div class=\"page-header\">\n      <h1>\u5173\u4E8E\u65F6\u95F4\u80F6\u56CA</h1>\n      <p>\u4E00\u4E2A\u6280\u672F\u5C55\u793A\u9879\u76EE</p>\n    </div>\n\n    <div class=\"card about-section\">\n      <h3>\u9879\u76EE\u7B80\u4ECB</h3>\n      <p>\n        \u65F6\u95F4\u80F6\u56CA (HelloTime) \u662F\u4E00\u4E2A\u7C7B\u4F3C RealWorld \u7684\u6280\u672F\u5C55\u793A\u5E94\u7528\u3002\n        \u901A\u8FC7\u7EDF\u4E00\u7684 API \u89C4\u8303\u548C\u53EF\u590D\u7528\u7684\u524D\u7AEF\u6837\u5F0F\uFF0C\u5C55\u793A\u4E0D\u540C\u524D\u540E\u7AEF\u6280\u672F\u6808\u7684\u7EC4\u5408\u80FD\u529B\u3002\n      </p>\n    </div>\n\n    <div class=\"card about-section\">\n      <h3>\u5F53\u524D\u6280\u672F\u6808</h3>\n      <ul class=\"tech-list\">\n        <li><strong>\u524D\u7AEF\u6846\u67B6:</strong> Angular 18 + TypeScript</li>\n        <li><strong>\u540E\u7AEF\u6846\u67B6:</strong> {{ loading() ? '\u52A0\u8F7D\u4E2D...' : techStack()?.framework || '\u6280\u672F\u6808\u4FE1\u606F\u6682\u4E0D\u53EF\u7528' }}</li>\n        <li><strong>\u540E\u7AEF\u8BED\u8A00:</strong> {{ loading() ? '\u52A0\u8F7D\u4E2D...' : techStack()?.language || '\u6280\u672F\u6808\u4FE1\u606F\u6682\u4E0D\u53EF\u7528' }}</li>\n        <li><strong>\u6570\u636E\u5E93:</strong> {{ loading() ? '\u52A0\u8F7D\u4E2D...' : techStack()?.database || '\u6280\u672F\u6808\u4FE1\u606F\u6682\u4E0D\u53EF\u7528' }}</li>\n        <li><strong>\u6837\u5F0F\u7CFB\u7EDF:</strong> \u5171\u4EAB CSS Design Tokens</li>\n        <li><strong>\u72B6\u6001\u7BA1\u7406:</strong> Angular Signals</li>\n      </ul>\n      @if (error()) {\n        <p class=\"text-sm text-secondary mt-4\">\u5F53\u524D\u65E0\u6CD5\u83B7\u53D6\u670D\u52A1\u7AEF\u6280\u672F\u6808\u8BE6\u60C5\u3002</p>\n      }\n    </div>\n\n    <div class=\"card about-section\">\n      <h3>\u8BBE\u8BA1\u7406\u5FF5</h3>\n      <ul class=\"tech-list\">\n        <li>\u7EDF\u4E00\u7684 REST API \u89C4\u8303 (OpenAPI 3.0)</li>\n        <li>\u53EF\u590D\u7528\u7684\u524D\u7AEF\u6837\u5F0F\u7CFB\u7EDF (CSS \u81EA\u5B9A\u4E49\u5C5E\u6027)</li>\n        <li>\u652F\u6301\u4EAE\u8272 / \u6697\u8272\u4E3B\u9898\u5207\u6362</li>\n        <li>\u524D\u540E\u7AEF\u5206\u79BB\uFF0C\u53EF\u81EA\u7531\u7EC4\u5408\u6280\u672F\u6808</li>\n        <li>Angular Standalone Components\uFF0C\u65E0 NgModule</li>\n      </ul>\n    </div>\n\n    <p class=\"version-text\" (click)=\"handleSecretClick()\">HelloTime v1.0.0</p>\n  </div>\n</div>\n", styles: [".page-header {\n  margin-bottom: var(--space-8);\n}\n\n.page-header h1 {\n  font-size: var(--text-2xl);\n  font-weight: var(--font-bold);\n  margin-bottom: var(--space-2);\n}\n\n.page-header p {\n  color: var(--color-text-secondary);\n}\n\n.about-section {\n  margin-bottom: var(--space-6);\n}\n\n.about-section h3 {\n  font-size: var(--text-lg);\n  font-weight: var(--font-semibold);\n  margin-bottom: var(--space-4);\n}\n\n.about-section p {\n  color: var(--color-text-secondary);\n  line-height: var(--leading-relaxed);\n}\n\n.tech-list {\n  list-style: none;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-2);\n}\n\n.tech-list li {\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n  padding: var(--space-2) 0;\n  border-bottom: 1px solid var(--color-border);\n}\n\n.tech-list li:last-child {\n  border-bottom: none;\n}\n\n.version-text {\n  text-align: center;\n  font-size: var(--text-sm);\n  color: var(--color-text-tertiary);\n  margin-top: var(--space-8);\n  cursor: default;\n  user-select: none;\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AboutComponent, { className: "AboutComponent" }); })();
