import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
export class ThemeService {
    constructor() {
        this.document = inject(DOCUMENT);
        this.theme = signal((typeof localStorage !== 'undefined'
            ? localStorage.getItem('theme')
            : null) ?? 'light');
        effect(() => {
            const t = this.theme();
            this.document.documentElement.setAttribute('data-theme', t);
            localStorage.setItem('theme', t);
        });
    }
    toggle() {
        this.theme.update(t => (t === 'light' ? 'dark' : 'light'));
    }
    static { this.ɵfac = function ThemeService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ThemeService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ThemeService, factory: ThemeService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ThemeService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [], null); })();
