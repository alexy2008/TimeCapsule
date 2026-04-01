import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.code;
function CapsuleTableComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4);
    i0.ɵɵtext(1, "\u52A0\u8F7D\u4E2D...");
    i0.ɵɵelementEnd();
} }
function CapsuleTableComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4);
    i0.ɵɵtext(1, "\u6682\u65E0\u80F6\u56CA");
    i0.ɵɵelementEnd();
} }
function CapsuleTableComponent_Conditional_8_For_18_Conditional_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 13)(1, "td", 14)(2, "div", 15)(3, "strong");
    i0.ɵɵtext(4, "\u5185\u5BB9\uFF1A");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const capsule_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(capsule_r2.content || "\uFF08\u5185\u5BB9\u5C1A\u672A\u5F00\u653E\uFF09");
} }
function CapsuleTableComponent_Conditional_8_For_18_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr")(1, "td")(2, "code", 8);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "td");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "td");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "td");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "td")(11, "span", 9);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "td", 10)(14, "button", 11);
    i0.ɵɵlistener("click", function CapsuleTableComponent_Conditional_8_For_18_Template_button_click_14_listener() { const capsule_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.toggleExpand(capsule_r2.code)); });
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "button", 12);
    i0.ɵɵlistener("click", function CapsuleTableComponent_Conditional_8_For_18_Template_button_click_16_listener() { const capsule_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.delete.emit(capsule_r2.code)); });
    i0.ɵɵtext(17, " \u5220\u9664 ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(18, CapsuleTableComponent_Conditional_8_For_18_Conditional_18_Template, 7, 1, "tr", 13);
} if (rf & 2) {
    const capsule_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(capsule_r2.code);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(capsule_r2.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(capsule_r2.creator);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.formatTime(capsule_r2.openAt));
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("badge-success", capsule_r2.opened)("badge-warning", !capsule_r2.opened);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", capsule_r2.opened ? "\u5DF2\u5F00\u542F" : "\u672A\u5F00\u542F", " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.expandedCode === capsule_r2.code ? "\u6536\u8D77" : "\u67E5\u770B", " ");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r2.expandedCode === capsule_r2.code ? 18 : -1);
} }
function CapsuleTableComponent_Conditional_8_Conditional_19_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 7)(1, "button", 16);
    i0.ɵɵlistener("click", function CapsuleTableComponent_Conditional_8_Conditional_19_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.page.emit(ctx_r2.pageInfo.number - 1)); });
    i0.ɵɵtext(2, " \u4E0A\u4E00\u9875 ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 17);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 16);
    i0.ɵɵlistener("click", function CapsuleTableComponent_Conditional_8_Conditional_19_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.page.emit(ctx_r2.pageInfo.number + 1)); });
    i0.ɵɵtext(6, " \u4E0B\u4E00\u9875 ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r2.pageInfo.number === 0);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate2("", ctx_r2.pageInfo.number + 1, " / ", ctx_r2.pageInfo.totalPages, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r2.pageInfo.number >= ctx_r2.pageInfo.totalPages - 1);
} }
function CapsuleTableComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5)(1, "table", 6)(2, "thead")(3, "tr")(4, "th");
    i0.ɵɵtext(5, "\u80F6\u56CA\u7801");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "th");
    i0.ɵɵtext(7, "\u6807\u9898");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "th");
    i0.ɵɵtext(9, "\u53D1\u5E03\u8005");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "th");
    i0.ɵɵtext(11, "\u5F00\u542F\u65F6\u95F4");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "th");
    i0.ɵɵtext(13, "\u72B6\u6001");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "th");
    i0.ɵɵtext(15, "\u64CD\u4F5C");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "tbody");
    i0.ɵɵrepeaterCreate(17, CapsuleTableComponent_Conditional_8_For_18_Template, 19, 11, null, null, _forTrack0);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(19, CapsuleTableComponent_Conditional_8_Conditional_19_Template, 7, 4, "div", 7);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(17);
    i0.ɵɵrepeater(ctx_r2.capsules);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.pageInfo.totalPages > 1 ? 19 : -1);
} }
export class CapsuleTableComponent {
    constructor() {
        this.capsules = [];
        this.pageInfo = { totalElements: 0, totalPages: 0, number: 0, size: 20 };
        this.loading = false;
        this.delete = new EventEmitter();
        this.page = new EventEmitter();
        this.refresh = new EventEmitter();
        this.expandedCode = null;
    }
    toggleExpand(code) {
        this.expandedCode = this.expandedCode === code ? null : code;
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
    static { this.ɵfac = function CapsuleTableComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CapsuleTableComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: CapsuleTableComponent, selectors: [["app-capsule-table"]], inputs: { capsules: "capsules", pageInfo: "pageInfo", loading: "loading" }, outputs: { delete: "delete", page: "page", refresh: "refresh" }, standalone: true, features: [i0.ɵɵStandaloneFeature], decls: 9, vars: 2, consts: [[1, "table-wrapper"], [1, "table-header"], [1, "table-title"], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], [1, "table-empty"], [1, "table-scroll"], [1, "table"], [1, "pagination"], [1, "code-cell"], [1, "badge"], [1, "actions"], ["type", "button", 1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["type", "button", 1, "btn", "btn-danger", "btn-sm", 3, "click"], [1, "expanded-row"], ["colspan", "6"], [1, "expanded-content"], ["type", "button", 1, "btn", "btn-secondary", "btn-sm", 3, "click", "disabled"], [1, "page-info"]], template: function CapsuleTableComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "h3", 2);
            i0.ɵɵtext(3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "button", 3);
            i0.ɵɵlistener("click", function CapsuleTableComponent_Template_button_click_4_listener() { return ctx.refresh.emit(); });
            i0.ɵɵtext(5, "\u5237\u65B0");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(6, CapsuleTableComponent_Conditional_6_Template, 2, 0, "div", 4)(7, CapsuleTableComponent_Conditional_7_Template, 2, 0, "div", 4)(8, CapsuleTableComponent_Conditional_8_Template, 20, 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1("\u80F6\u56CA\u5217\u8868 (", ctx.pageInfo.totalElements, " \u6761)");
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.loading ? 6 : ctx.capsules.length === 0 ? 7 : 8);
        } }, styles: [".table-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-4);\n}\n\n.table-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.table-title[_ngcontent-%COMP%] {\n  font-size: var(--text-lg);\n  font-weight: var(--font-semibold);\n}\n\n.table-empty[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: var(--space-8);\n  color: var(--color-text-secondary);\n}\n\n.table-scroll[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n\n.code-cell[_ngcontent-%COMP%] {\n  font-family: var(--font-mono);\n  font-size: var(--text-xs);\n}\n\n.actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: var(--space-2);\n}\n\n.expanded-row[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background-color: var(--color-bg-secondary);\n}\n\n.expanded-content[_ngcontent-%COMP%] {\n  padding: var(--space-2) 0;\n  color: var(--color-text-secondary);\n  line-height: var(--leading-relaxed);\n}\n\n.pagination[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--space-3);\n}\n\n.page-info[_ngcontent-%COMP%] {\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CapsuleTableComponent, [{
        type: Component,
        args: [{ selector: 'app-capsule-table', standalone: true, imports: [], template: "<div class=\"table-wrapper\">\n  <div class=\"table-header\">\n    <h3 class=\"table-title\">\u80F6\u56CA\u5217\u8868 ({{ pageInfo.totalElements }} \u6761)</h3>\n    <button type=\"button\" class=\"btn btn-secondary\" (click)=\"refresh.emit()\">\u5237\u65B0</button>\n  </div>\n\n  @if (loading) {\n    <div class=\"table-empty\">\u52A0\u8F7D\u4E2D...</div>\n  } @else if (capsules.length === 0) {\n    <div class=\"table-empty\">\u6682\u65E0\u80F6\u56CA</div>\n  } @else {\n    <div class=\"table-scroll\">\n      <table class=\"table\">\n        <thead>\n          <tr>\n            <th>\u80F6\u56CA\u7801</th>\n            <th>\u6807\u9898</th>\n            <th>\u53D1\u5E03\u8005</th>\n            <th>\u5F00\u542F\u65F6\u95F4</th>\n            <th>\u72B6\u6001</th>\n            <th>\u64CD\u4F5C</th>\n          </tr>\n        </thead>\n        <tbody>\n          @for (capsule of capsules; track capsule.code) {\n            <tr>\n              <td><code class=\"code-cell\">{{ capsule.code }}</code></td>\n              <td>{{ capsule.title }}</td>\n              <td>{{ capsule.creator }}</td>\n              <td>{{ formatTime(capsule.openAt) }}</td>\n              <td>\n                <span class=\"badge\" [class.badge-success]=\"capsule.opened\" [class.badge-warning]=\"!capsule.opened\">\n                  {{ capsule.opened ? '\u5DF2\u5F00\u542F' : '\u672A\u5F00\u542F' }}\n                </span>\n              </td>\n              <td class=\"actions\">\n                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"toggleExpand(capsule.code)\">\n                  {{ expandedCode === capsule.code ? '\u6536\u8D77' : '\u67E5\u770B' }}\n                </button>\n                <button type=\"button\" class=\"btn btn-danger btn-sm\" (click)=\"delete.emit(capsule.code)\">\n                  \u5220\u9664\n                </button>\n              </td>\n            </tr>\n            @if (expandedCode === capsule.code) {\n              <tr class=\"expanded-row\">\n                <td colspan=\"6\">\n                  <div class=\"expanded-content\">\n                    <strong>\u5185\u5BB9\uFF1A</strong>\n                    <span>{{ capsule.content || '\uFF08\u5185\u5BB9\u5C1A\u672A\u5F00\u653E\uFF09' }}</span>\n                  </div>\n                </td>\n              </tr>\n            }\n          }\n        </tbody>\n      </table>\n    </div>\n\n    @if (pageInfo.totalPages > 1) {\n      <div class=\"pagination\">\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-sm\"\n          [disabled]=\"pageInfo.number === 0\"\n          (click)=\"page.emit(pageInfo.number - 1)\"\n        >\n          \u4E0A\u4E00\u9875\n        </button>\n        <span class=\"page-info\">{{ pageInfo.number + 1 }} / {{ pageInfo.totalPages }}</span>\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-sm\"\n          [disabled]=\"pageInfo.number >= pageInfo.totalPages - 1\"\n          (click)=\"page.emit(pageInfo.number + 1)\"\n        >\n          \u4E0B\u4E00\u9875\n        </button>\n      </div>\n    }\n  }\n</div>\n", styles: [".table-wrapper {\n  display: flex;\n  flex-direction: column;\n  gap: var(--space-4);\n}\n\n.table-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.table-title {\n  font-size: var(--text-lg);\n  font-weight: var(--font-semibold);\n}\n\n.table-empty {\n  text-align: center;\n  padding: var(--space-8);\n  color: var(--color-text-secondary);\n}\n\n.table-scroll {\n  overflow-x: auto;\n}\n\n.code-cell {\n  font-family: var(--font-mono);\n  font-size: var(--text-xs);\n}\n\n.actions {\n  display: flex;\n  gap: var(--space-2);\n}\n\n.expanded-row td {\n  background-color: var(--color-bg-secondary);\n}\n\n.expanded-content {\n  padding: var(--space-2) 0;\n  color: var(--color-text-secondary);\n  line-height: var(--leading-relaxed);\n}\n\n.pagination {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--space-3);\n}\n\n.page-info {\n  font-size: var(--text-sm);\n  color: var(--color-text-secondary);\n}\n"] }]
    }], null, { capsules: [{
            type: Input
        }], pageInfo: [{
            type: Input
        }], loading: [{
            type: Input
        }], delete: [{
            type: Output
        }], page: [{
            type: Output
        }], refresh: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(CapsuleTableComponent, { className: "CapsuleTableComponent" }); })();
