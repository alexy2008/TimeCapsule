import { Injectable, signal } from '@angular/core';
import { createCapsule as apiCreate, getCapsule as apiGet } from '../api';
import * as i0 from "@angular/core";
export class CapsuleService {
    constructor() {
        this.capsule = signal(null);
        this.loading = signal(false);
        this.error = signal(null);
    }
    async create(form) {
        this.loading.set(true);
        this.error.set(null);
        try {
            const res = await apiCreate(form);
            this.capsule.set(res.data);
            return res.data;
        }
        catch (e) {
            this.error.set(e instanceof Error ? e.message : '创建失败');
            throw e;
        }
        finally {
            this.loading.set(false);
        }
    }
    async get(code) {
        this.loading.set(true);
        this.error.set(null);
        try {
            const res = await apiGet(code);
            this.capsule.set(res.data);
            return res.data;
        }
        catch (e) {
            this.error.set(e instanceof Error ? e.message : '查询失败');
            throw e;
        }
        finally {
            this.loading.set(false);
        }
    }
    static { this.ɵfac = function CapsuleService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CapsuleService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: CapsuleService, factory: CapsuleService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CapsuleService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
