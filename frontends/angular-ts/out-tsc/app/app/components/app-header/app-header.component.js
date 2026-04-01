import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import * as i0 from "@angular/core";
const _c0 = () => ({ exact: true });
export class AppHeaderComponent {
    static { this.ɵfac = function AppHeaderComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppHeaderComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppHeaderComponent, selectors: [["app-header"]], standalone: true, features: [i0.ɵɵStandaloneFeature], decls: 16, vars: 2, consts: [[1, "header"], [1, "container", "header-inner"], ["routerLink", "/", 1, "logo"], ["src", "/favicon.svg", "alt", "logo", 1, "logo-img"], [1, "logo-text"], [1, "nav"], ["routerLink", "/", "routerLinkActive", "active", 1, "nav-link", 3, "routerLinkActiveOptions"], ["routerLink", "/create", "routerLinkActive", "active", 1, "nav-link"], ["routerLink", "/open", "routerLinkActive", "active", 1, "nav-link"], ["routerLink", "/about", "routerLinkActive", "active", 1, "nav-link"]], template: function AppHeaderComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "header", 0)(1, "div", 1)(2, "a", 2);
            i0.ɵɵelement(3, "img", 3);
            i0.ɵɵelementStart(4, "span", 4);
            i0.ɵɵtext(5, "\u65F6\u95F4\u80F6\u56CA");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "nav", 5)(7, "a", 6);
            i0.ɵɵtext(8, "\u9996\u9875");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "a", 7);
            i0.ɵɵtext(10, "\u521B\u5EFA");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "a", 8);
            i0.ɵɵtext(12, "\u5F00\u542F");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "a", 9);
            i0.ɵɵtext(14, "\u5173\u4E8E");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(15, "app-theme-toggle");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("routerLinkActiveOptions", i0.ɵɵpureFunction0(1, _c0));
        } }, dependencies: [RouterLink, RouterLinkActive, ThemeToggleComponent], styles: [".header[_ngcontent-%COMP%] {\n  height: var(--header-height);\n  border-bottom: 1px solid var(--color-border);\n  background-color: var(--color-bg);\n  position: sticky;\n  top: 0;\n  z-index: 50;\n  transition: background-color var(--transition-base), border-color var(--transition-base);\n  \n\n  display: flex;\n  align-items: center;\n}\n\n.header-inner[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 100%;\n}\n\n.logo[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--space-2);\n  text-decoration: none;\n  color: var(--color-text);\n}\n\n.logo-img[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n}\n\n.logo-text[_ngcontent-%COMP%] {\n  font-size: var(--text-lg);\n  font-weight: var(--font-bold);\n}\n\n.nav[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--space-4);\n}\n\n.nav-link[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  font-weight: var(--font-medium);\n  color: var(--color-text-secondary);\n  transition: color var(--transition-fast);\n  padding: var(--space-1) var(--space-2);\n  text-decoration: none;\n  border-radius: var(--radius-sm);\n}\n\n.nav-link[_ngcontent-%COMP%]:hover, \n.nav-link.active[_ngcontent-%COMP%] {\n  color: var(--color-primary);\n}\n\n\n\n@media (max-width: 480px) {\n  .logo-text[_ngcontent-%COMP%] {\n    display: none;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppHeaderComponent, [{
        type: Component,
        args: [{ selector: 'app-header', standalone: true, imports: [RouterLink, RouterLinkActive, ThemeToggleComponent], template: "<header class=\"header\">\n  <div class=\"container header-inner\">\n    <a routerLink=\"/\" class=\"logo\">\n      <img src=\"/favicon.svg\" alt=\"logo\" class=\"logo-img\" />\n      <span class=\"logo-text\">\u65F6\u95F4\u80F6\u56CA</span>\n    </a>\n    <nav class=\"nav\">\n      <a routerLink=\"/\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" class=\"nav-link\">\u9996\u9875</a>\n      <a routerLink=\"/create\" routerLinkActive=\"active\" class=\"nav-link\">\u521B\u5EFA</a>\n      <a routerLink=\"/open\" routerLinkActive=\"active\" class=\"nav-link\">\u5F00\u542F</a>\n      <a routerLink=\"/about\" routerLinkActive=\"active\" class=\"nav-link\">\u5173\u4E8E</a>\n      <app-theme-toggle />\n    </nav>\n  </div>\n</header>\n", styles: [".header {\n  height: var(--header-height);\n  border-bottom: 1px solid var(--color-border);\n  background-color: var(--color-bg);\n  position: sticky;\n  top: 0;\n  z-index: 50;\n  transition: background-color var(--transition-base), border-color var(--transition-base);\n  /* \u8BA9 header \u5185\u5BB9\u5782\u76F4\u5C45\u4E2D */\n  display: flex;\n  align-items: center;\n}\n\n.header-inner {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 100%;\n}\n\n.logo {\n  display: flex;\n  align-items: center;\n  gap: var(--space-2);\n  text-decoration: none;\n  color: var(--color-text);\n}\n\n.logo-img {\n  width: 32px;\n  height: 32px;\n}\n\n.logo-text {\n  font-size: var(--text-lg);\n  font-weight: var(--font-bold);\n}\n\n.nav {\n  display: flex;\n  align-items: center;\n  gap: var(--space-4);\n}\n\n.nav-link {\n  font-size: var(--text-sm);\n  font-weight: var(--font-medium);\n  color: var(--color-text-secondary);\n  transition: color var(--transition-fast);\n  padding: var(--space-1) var(--space-2);\n  text-decoration: none;\n  border-radius: var(--radius-sm);\n}\n\n.nav-link:hover,\n.nav-link.active {\n  color: var(--color-primary);\n}\n\n/* \u79FB\u52A8\u7AEF\uFF1A\u9690\u85CF Logo \u6587\u5B57\uFF0C\u53EA\u4FDD\u7559\u56FE\u6807 */\n@media (max-width: 480px) {\n  .logo-text {\n    display: none;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppHeaderComponent, { className: "AppHeaderComponent" }); })();
