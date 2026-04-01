import { Injectable, signal } from '@angular/core';
import { getHealthInfo } from '../api';
import * as i0 from "@angular/core";
export class TechStackService {
    constructor() {
        this.techStack = signal(null);
        this.loading = signal(true);
        this.error = signal(false);
        this.loaded = false;
    }
    load() {
        if (this.loaded) {
            return;
        }
        this.loaded = true;
        getHealthInfo()
            .then(res => {
            this.techStack.set(res.data.techStack);
            this.error.set(false);
        })
            .catch(() => {
            this.techStack.set(null);
            this.error.set(true);
        })
            .finally(() => {
            this.loading.set(false);
        });
    }
    static { this.ɵfac = function TechStackService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TechStackService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: TechStackService, factory: TechStackService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TechStackService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
