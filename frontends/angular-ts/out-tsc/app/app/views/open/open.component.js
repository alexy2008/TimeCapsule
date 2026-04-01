import { Component, Input, inject, signal } from '@angular/core';
import { CapsuleService } from '../../services/capsule.service';
import { CapsuleCodeInputComponent } from '../../components/capsule-code-input/capsule-code-input.component';
import { CapsuleCardComponent } from '../../components/capsule-card/capsule-card.component';
import * as i0 from "@angular/core";
function OpenComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 4)(1, "app-capsule-card", 5);
    i0.ɵɵlistener("expired", function OpenComponent_Conditional_8_Template_app_capsule_card_expired_1_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.handleExpired()); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("capsule", ctx_r1.capsule());
} }
export class OpenComponent {
    constructor() {
        this.capsuleService = inject(CapsuleService);
        this.capsule = this.capsuleService.capsule;
        this.loading = this.capsuleService.loading;
        this.error = this.capsuleService.error;
        this.codeInput = signal('');
    }
    ngOnInit() {
        if (this.code) {
            this.codeInput.set(this.code);
            this.handleQuery(this.code);
        }
    }
    async handleQuery(c) {
        await this.capsuleService.get(c);
    }
    async handleExpired() {
        const currentCode = this.capsule()?.code || this.codeInput();
        if (currentCode)
            await this.capsuleService.get(currentCode);
    }
    static { this.ɵfac = function OpenComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || OpenComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: OpenComponent, selectors: [["app-open"]], inputs: { code: "code" }, standalone: true, features: [i0.ɵɵProvidersFeature([CapsuleService]), i0.ɵɵStandaloneFeature], decls: 9, vars: 4, consts: [[1, "page"], [1, "container", "container-sm"], [1, "page-header"], [3, "valueChange", "codeSubmit", "value", "loading", "error"], [1, "result"], [3, "expired", "capsule"]], template: function OpenComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1");
            i0.ɵɵtext(4, "\u5F00\u542F\u65F6\u95F4\u80F6\u56CA");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "p");
            i0.ɵɵtext(6, "\u8F93\u5165\u80F6\u56CA\u7801\uFF0C\u67E5\u770B\u65F6\u95F4\u80F6\u56CA");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "app-capsule-code-input", 3);
            i0.ɵɵlistener("valueChange", function OpenComponent_Template_app_capsule_code_input_valueChange_7_listener($event) { return ctx.codeInput.set($event); })("codeSubmit", function OpenComponent_Template_app_capsule_code_input_codeSubmit_7_listener($event) { return ctx.handleQuery($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(8, OpenComponent_Conditional_8_Template, 2, 1, "div", 4);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("value", ctx.codeInput())("loading", ctx.loading())("error", ctx.error());
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.capsule() ? 8 : -1);
        } }, dependencies: [CapsuleCodeInputComponent, CapsuleCardComponent], styles: [".page-header[_ngcontent-%COMP%] {\n  margin-bottom: var(--space-8);\n}\n\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: var(--text-2xl);\n  font-weight: var(--font-bold);\n  margin-bottom: var(--space-2);\n}\n\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--color-text-secondary);\n}\n\n.result[_ngcontent-%COMP%] {\n  margin-top: var(--space-8);\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(OpenComponent, [{
        type: Component,
        args: [{ selector: 'app-open', standalone: true, imports: [CapsuleCodeInputComponent, CapsuleCardComponent], providers: [CapsuleService], template: "<div class=\"page\">\n  <div class=\"container container-sm\">\n    <div class=\"page-header\">\n      <h1>\u5F00\u542F\u65F6\u95F4\u80F6\u56CA</h1>\n      <p>\u8F93\u5165\u80F6\u56CA\u7801\uFF0C\u67E5\u770B\u65F6\u95F4\u80F6\u56CA</p>\n    </div>\n\n    <app-capsule-code-input\n      [value]=\"codeInput()\"\n      [loading]=\"loading()\"\n      [error]=\"error()\"\n      (valueChange)=\"codeInput.set($event)\"\n      (codeSubmit)=\"handleQuery($event)\"\n    />\n\n    @if (capsule()) {\n      <div class=\"result\">\n        <app-capsule-card [capsule]=\"capsule()!\" (expired)=\"handleExpired()\" />\n      </div>\n    }\n  </div>\n</div>\n", styles: [".page-header {\n  margin-bottom: var(--space-8);\n}\n\n.page-header h1 {\n  font-size: var(--text-2xl);\n  font-weight: var(--font-bold);\n  margin-bottom: var(--space-2);\n}\n\n.page-header p {\n  color: var(--color-text-secondary);\n}\n\n.result {\n  margin-top: var(--space-8);\n}\n"] }]
    }], null, { code: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(OpenComponent, { className: "OpenComponent" }); })();
