import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TechStackService } from '../../services/tech-stack.service';
import * as i0 from "@angular/core";
export class HomeComponent {
    constructor() {
        this.techStackService = inject(TechStackService);
        this.techStack = this.techStackService.techStack;
        this.loading = this.techStackService.loading;
        this.error = this.techStackService.error;
        this.frontendDescription = 'Angular 18 · TypeScript';
    }
    ngOnInit() {
        this.techStackService.load();
    }
    get backendDescription() {
        if (this.loading()) {
            return '加载中...';
        }
        if (this.error() || !this.techStack()) {
            return '技术栈信息暂不可用';
        }
        return `${this.techStack().framework} · ${this.techStack().language} · ${this.techStack().database}`;
    }
    static { this.ɵfac = function HomeComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HomeComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: HomeComponent, selectors: [["app-home"]], standalone: true, features: [i0.ɵɵStandaloneFeature], decls: 54, vars: 2, consts: [[1, "page"], [1, "container"], [1, "hero"], ["src", "/favicon.svg", "alt", "\u65F6\u95F4\u80F6\u56CA", 1, "hero-logo"], [1, "hero-title"], [1, "hero-subtitle"], [1, "hero-actions"], ["routerLink", "/create", 1, "action-btn"], [1, "action-btn-create"], [1, "action-main"], [1, "action-icon"], [1, "action-label"], [1, "action-desc"], ["routerLink", "/open", 1, "action-btn"], [1, "action-btn-open"], [1, "features"], [1, "feature-card", "card"], [1, "tech-card-title"], [1, "tech-block"], ["aria-label", "\u524D\u7AEF\u6280\u672F\u6808\u56FE\u6807", 1, "tech-logo-group"], [1, "tech-logo-item"], ["src", "/frontend.svg", "alt", "Angular Logo", 1, "tech-logo"], ["src", "/typescript-logo.svg", "alt", "TypeScript Logo", 1, "tech-logo"], [1, "tech-label"], ["aria-hidden", "true", 1, "tech-divider"], ["aria-label", "\u540E\u7AEF\u6280\u672F\u6808\u56FE\u6807", 1, "tech-logo-group"], ["src", "/tech-logos/backend.svg", "alt", "\u540E\u7AEF\u6846\u67B6 Logo", 1, "tech-logo"], ["src", "/tech-logos/language.svg", "alt", "\u540E\u7AEF\u8BED\u8A00 Logo", 1, "tech-logo"], ["src", "/tech-logos/database.svg", "alt", "\u540E\u7AEF\u6570\u636E\u5E93 Logo", 1, "tech-logo"]], template: function HomeComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
            i0.ɵɵelement(3, "img", 3);
            i0.ɵɵelementStart(4, "h1", 4);
            i0.ɵɵtext(5, "\u65F6\u95F4\u80F6\u56CA");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "p", 5);
            i0.ɵɵtext(7, "\u5C01\u5B58\u6B64\u523B\u7684\u5FC3\u610F\uFF0C\u5728\u672A\u6765\u7684\u67D0\u4E2A\u65F6\u523B\u5F00\u542F");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "div", 6)(9, "a", 7)(10, "span", 8)(11, "span", 9)(12, "span", 10);
            i0.ɵɵtext(13, "\u270F\uFE0F");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "span", 11);
            i0.ɵɵtext(15, "\u521B\u5EFA\u80F6\u56CA");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(16, "span", 12);
            i0.ɵɵtext(17, "\u5C01\u5B58\u6B64\u523B\u7684\u5FC3\u610F");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(18, "a", 13)(19, "span", 14)(20, "span", 9)(21, "span", 10);
            i0.ɵɵtext(22, "\uD83D\uDD13");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "span", 11);
            i0.ɵɵtext(24, "\u5F00\u542F\u80F6\u56CA");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(25, "span", 12);
            i0.ɵɵtext(26, "\u53D6\u51FA\u672A\u6765\u7684\u60CA\u559C");
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(27, "div", 15)(28, "div", 16)(29, "h3", 17);
            i0.ɵɵtext(30, "\u6280\u672F\u6808");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "div", 18)(32, "div", 19)(33, "span", 20);
            i0.ɵɵelement(34, "img", 21);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "span", 20);
            i0.ɵɵelement(36, "img", 22);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(37, "p", 23);
            i0.ɵɵtext(38, "\u524D\u7AEF");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "p");
            i0.ɵɵtext(40);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(41, "div", 24);
            i0.ɵɵelementStart(42, "div", 18)(43, "div", 25)(44, "span", 20);
            i0.ɵɵelement(45, "img", 26);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(46, "span", 20);
            i0.ɵɵelement(47, "img", 27);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "span", 20);
            i0.ɵɵelement(49, "img", 28);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(50, "p", 23);
            i0.ɵɵtext(51, "\u540E\u7AEF");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(52, "p");
            i0.ɵɵtext(53);
            i0.ɵɵelementEnd()()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(40);
            i0.ɵɵtextInterpolate(ctx.frontendDescription);
            i0.ɵɵadvance(13);
            i0.ɵɵtextInterpolate(ctx.backendDescription);
        } }, dependencies: [RouterLink], styles: [".hero[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: var(--space-16) 0 var(--space-12);\n}\n\n.hero-logo[_ngcontent-%COMP%] {\n  width: 80px;\n  height: 80px;\n  margin: 0 auto var(--space-6);\n  display: block;\n}\n\n.hero-title[_ngcontent-%COMP%] {\n  font-size: var(--text-3xl);\n  font-weight: var(--font-bold);\n  color: var(--color-text);\n  margin-bottom: var(--space-4);\n}\n\n.hero-subtitle[_ngcontent-%COMP%] {\n  font-size: var(--text-lg);\n  color: var(--color-text-secondary);\n  margin-bottom: var(--space-8);\n  max-width: 480px;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.hero-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: var(--space-5);\n  flex-wrap: wrap;\n}\n\n.action-btn[_ngcontent-%COMP%] {\n  display: block;\n  text-decoration: none;\n}\n\n.action-btn-create[_ngcontent-%COMP%], \n.action-btn-open[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--space-1);\n  padding: var(--space-4) var(--space-10);\n  border-radius: var(--radius-xl);\n  color: #ffffff;\n  transition: transform var(--transition-fast), box-shadow var(--transition-fast), filter var(--transition-fast);\n  box-shadow: var(--shadow-md);\n  min-width: 200px;\n}\n\n.action-main[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--space-2);\n}\n\n.action-btn-create[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);\n}\n\n.action-btn-open[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);\n}\n\n.action-btn-create[_ngcontent-%COMP%]:hover, \n.action-btn-open[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px);\n  box-shadow: var(--shadow-lg);\n  filter: brightness(1.08);\n}\n\n.action-icon[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  line-height: 1;\n}\n\n.action-label[_ngcontent-%COMP%] {\n  font-size: var(--text-lg);\n  font-weight: var(--font-semibold);\n  letter-spacing: 0.02em;\n}\n\n.action-desc[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  opacity: 0.85;\n}\n\n[data-theme=\"dark\"][_nghost-%COMP%]   .action-btn-create[_ngcontent-%COMP%], [data-theme=\"dark\"]   [_nghost-%COMP%]   .action-btn-create[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #15803d 0%, #166534 100%);\n  box-shadow: 0 0 0 1px rgba(74, 222, 128, 0.25), var(--shadow-md);\n}\n\n[data-theme=\"dark\"][_nghost-%COMP%]   .action-btn-open[_ngcontent-%COMP%], [data-theme=\"dark\"]   [_nghost-%COMP%]   .action-btn-open[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);\n  box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.25), var(--shadow-md);\n}\n\n[data-theme=\"dark\"][_nghost-%COMP%]   .action-btn-create[_ngcontent-%COMP%]:hover, [data-theme=\"dark\"]   [_nghost-%COMP%]   .action-btn-create[_ngcontent-%COMP%]:hover, \n[data-theme=\"dark\"][_nghost-%COMP%]   .action-btn-open[_ngcontent-%COMP%]:hover, [data-theme=\"dark\"]   [_nghost-%COMP%]   .action-btn-open[_ngcontent-%COMP%]:hover {\n  filter: brightness(1.15);\n}\n\n.features[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding-bottom: var(--space-16);\n}\n\n.feature-card[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: var(--space-8) var(--space-6);\n  width: min(100%, 440px);\n}\n\n.feature-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: var(--text-lg);\n  font-weight: var(--font-semibold);\n  margin-bottom: var(--space-2);\n}\n\n.feature-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n  line-height: var(--leading-relaxed);\n}\n\n.tech-logo[_ngcontent-%COMP%] {\n  width: 52px;\n  height: 52px;\n  object-fit: contain;\n  display: block;\n}\n\n.tech-card-title[_ngcontent-%COMP%] {\n  margin-bottom: var(--space-5);\n}\n\n.tech-block[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.tech-logo-group[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: var(--space-5);\n  margin: 0 auto var(--space-4);\n  flex-wrap: wrap;\n}\n\n.tech-logo-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.tech-logo-item[_ngcontent-%COMP%]    + .tech-logo-item[_ngcontent-%COMP%] {\n  padding-left: var(--space-5);\n  margin-left: var(--space-1);\n  border-left: 1px solid var(--color-border);\n}\n\n.tech-label[_ngcontent-%COMP%] {\n  font-size: var(--text-base);\n  font-weight: var(--font-semibold);\n}\n\n.tech-divider[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 1px;\n  margin: var(--space-6) 0;\n  background: var(--color-border);\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HomeComponent, [{
        type: Component,
        args: [{ selector: 'app-home', standalone: true, imports: [RouterLink], template: "<div class=\"page\">\n  <div class=\"container\">\n    <div class=\"hero\">\n      <img src=\"/favicon.svg\" alt=\"\u65F6\u95F4\u80F6\u56CA\" class=\"hero-logo\" />\n      <h1 class=\"hero-title\">\u65F6\u95F4\u80F6\u56CA</h1>\n      <p class=\"hero-subtitle\">\u5C01\u5B58\u6B64\u523B\u7684\u5FC3\u610F\uFF0C\u5728\u672A\u6765\u7684\u67D0\u4E2A\u65F6\u523B\u5F00\u542F</p>\n      <div class=\"hero-actions\">\n        <a routerLink=\"/create\" class=\"action-btn\">\n          <span class=\"action-btn-create\">\n            <span class=\"action-main\">\n              <span class=\"action-icon\">\u270F\uFE0F</span>\n              <span class=\"action-label\">\u521B\u5EFA\u80F6\u56CA</span>\n            </span>\n            <span class=\"action-desc\">\u5C01\u5B58\u6B64\u523B\u7684\u5FC3\u610F</span>\n          </span>\n        </a>\n        <a routerLink=\"/open\" class=\"action-btn\">\n          <span class=\"action-btn-open\">\n            <span class=\"action-main\">\n              <span class=\"action-icon\">\uD83D\uDD13</span>\n              <span class=\"action-label\">\u5F00\u542F\u80F6\u56CA</span>\n            </span>\n            <span class=\"action-desc\">\u53D6\u51FA\u672A\u6765\u7684\u60CA\u559C</span>\n          </span>\n        </a>\n      </div>\n    </div>\n\n    <div class=\"features\">\n      <div class=\"feature-card card\">\n        <h3 class=\"tech-card-title\">\u6280\u672F\u6808</h3>\n\n        <div class=\"tech-block\">\n          <div class=\"tech-logo-group\" aria-label=\"\u524D\u7AEF\u6280\u672F\u6808\u56FE\u6807\">\n            <span class=\"tech-logo-item\">\n              <img src=\"/frontend.svg\" alt=\"Angular Logo\" class=\"tech-logo\" />\n            </span>\n            <span class=\"tech-logo-item\">\n              <img src=\"/typescript-logo.svg\" alt=\"TypeScript Logo\" class=\"tech-logo\" />\n            </span>\n          </div>\n          <p class=\"tech-label\">\u524D\u7AEF</p>\n          <p>{{ frontendDescription }}</p>\n        </div>\n\n        <div class=\"tech-divider\" aria-hidden=\"true\"></div>\n\n        <div class=\"tech-block\">\n          <div class=\"tech-logo-group\" aria-label=\"\u540E\u7AEF\u6280\u672F\u6808\u56FE\u6807\">\n            <span class=\"tech-logo-item\">\n              <img src=\"/tech-logos/backend.svg\" alt=\"\u540E\u7AEF\u6846\u67B6 Logo\" class=\"tech-logo\" />\n            </span>\n            <span class=\"tech-logo-item\">\n              <img src=\"/tech-logos/language.svg\" alt=\"\u540E\u7AEF\u8BED\u8A00 Logo\" class=\"tech-logo\" />\n            </span>\n            <span class=\"tech-logo-item\">\n              <img src=\"/tech-logos/database.svg\" alt=\"\u540E\u7AEF\u6570\u636E\u5E93 Logo\" class=\"tech-logo\" />\n            </span>\n          </div>\n          <p class=\"tech-label\">\u540E\u7AEF</p>\n          <p>{{ backendDescription }}</p>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n", styles: [".hero {\n  text-align: center;\n  padding: var(--space-16) 0 var(--space-12);\n}\n\n.hero-logo {\n  width: 80px;\n  height: 80px;\n  margin: 0 auto var(--space-6);\n  display: block;\n}\n\n.hero-title {\n  font-size: var(--text-3xl);\n  font-weight: var(--font-bold);\n  color: var(--color-text);\n  margin-bottom: var(--space-4);\n}\n\n.hero-subtitle {\n  font-size: var(--text-lg);\n  color: var(--color-text-secondary);\n  margin-bottom: var(--space-8);\n  max-width: 480px;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.hero-actions {\n  display: flex;\n  justify-content: center;\n  gap: var(--space-5);\n  flex-wrap: wrap;\n}\n\n.action-btn {\n  display: block;\n  text-decoration: none;\n}\n\n.action-btn-create,\n.action-btn-open {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--space-1);\n  padding: var(--space-4) var(--space-10);\n  border-radius: var(--radius-xl);\n  color: #ffffff;\n  transition: transform var(--transition-fast), box-shadow var(--transition-fast), filter var(--transition-fast);\n  box-shadow: var(--shadow-md);\n  min-width: 200px;\n}\n\n.action-main {\n  display: flex;\n  align-items: center;\n  gap: var(--space-2);\n}\n\n.action-btn-create {\n  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);\n}\n\n.action-btn-open {\n  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);\n}\n\n.action-btn-create:hover,\n.action-btn-open:hover {\n  transform: translateY(-3px);\n  box-shadow: var(--shadow-lg);\n  filter: brightness(1.08);\n}\n\n.action-icon {\n  font-size: 2rem;\n  line-height: 1;\n}\n\n.action-label {\n  font-size: var(--text-lg);\n  font-weight: var(--font-semibold);\n  letter-spacing: 0.02em;\n}\n\n.action-desc {\n  font-size: var(--text-sm);\n  opacity: 0.85;\n}\n\n:host-context([data-theme=\"dark\"]) .action-btn-create {\n  background: linear-gradient(135deg, #15803d 0%, #166534 100%);\n  box-shadow: 0 0 0 1px rgba(74, 222, 128, 0.25), var(--shadow-md);\n}\n\n:host-context([data-theme=\"dark\"]) .action-btn-open {\n  background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);\n  box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.25), var(--shadow-md);\n}\n\n:host-context([data-theme=\"dark\"]) .action-btn-create:hover,\n:host-context([data-theme=\"dark\"]) .action-btn-open:hover {\n  filter: brightness(1.15);\n}\n\n.features {\n  display: flex;\n  justify-content: center;\n  padding-bottom: var(--space-16);\n}\n\n.feature-card {\n  text-align: center;\n  padding: var(--space-8) var(--space-6);\n  width: min(100%, 440px);\n}\n\n.feature-card h3 {\n  font-size: var(--text-lg);\n  font-weight: var(--font-semibold);\n  margin-bottom: var(--space-2);\n}\n\n.feature-card p {\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n  line-height: var(--leading-relaxed);\n}\n\n.tech-logo {\n  width: 52px;\n  height: 52px;\n  object-fit: contain;\n  display: block;\n}\n\n.tech-card-title {\n  margin-bottom: var(--space-5);\n}\n\n.tech-block {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.tech-logo-group {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: var(--space-5);\n  margin: 0 auto var(--space-4);\n  flex-wrap: wrap;\n}\n\n.tech-logo-item {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.tech-logo-item + .tech-logo-item {\n  padding-left: var(--space-5);\n  margin-left: var(--space-1);\n  border-left: 1px solid var(--color-border);\n}\n\n.tech-label {\n  font-size: var(--text-base);\n  font-weight: var(--font-semibold);\n}\n\n.tech-divider {\n  width: 100%;\n  height: 1px;\n  margin: var(--space-6) 0;\n  background: var(--color-border);\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(HomeComponent, { className: "HomeComponent" }); })();
