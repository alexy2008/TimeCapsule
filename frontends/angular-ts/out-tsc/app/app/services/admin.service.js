import { Injectable, signal, computed } from '@angular/core';
import { adminLogin as apiLogin, getAdminCapsules, deleteAdminCapsule } from '../api';
import * as i0 from "@angular/core";
export class AdminService {
    constructor() {
        this.token = signal(typeof sessionStorage !== 'undefined'
            ? sessionStorage.getItem('admin_token')
            : null);
        this.capsules = signal([]);
        this.pageInfo = signal({
            totalElements: 0,
            totalPages: 0,
            number: 0,
            size: 20,
        });
        this.loading = signal(false);
        this.error = signal(null);
        this.isLoggedIn = computed(() => !!this.token());
    }
    async login(password) {
        this.loading.set(true);
        this.error.set(null);
        try {
            const res = await apiLogin(password);
            this.token.set(res.data.token);
            sessionStorage.setItem('admin_token', res.data.token);
        }
        catch (e) {
            this.error.set(e instanceof Error ? e.message : '登录失败');
            throw e;
        }
        finally {
            this.loading.set(false);
        }
    }
    logout() {
        this.token.set(null);
        sessionStorage.removeItem('admin_token');
        this.capsules.set([]);
    }
    async fetchCapsules(page = 0) {
        const t = this.token();
        if (!t)
            return;
        this.loading.set(true);
        this.error.set(null);
        try {
            const res = await getAdminCapsules(t, page);
            this.capsules.set(res.data.content);
            this.pageInfo.set({
                totalElements: res.data.totalElements,
                totalPages: res.data.totalPages,
                number: res.data.number,
                size: res.data.size,
            });
        }
        catch (e) {
            this.error.set(e instanceof Error ? e.message : '查询失败');
        }
        finally {
            this.loading.set(false);
        }
    }
    async deleteCapsule(code) {
        const t = this.token();
        if (!t)
            return;
        this.loading.set(true);
        this.error.set(null);
        try {
            await deleteAdminCapsule(t, code);
            await this.fetchCapsules(this.pageInfo().number);
        }
        catch (e) {
            this.error.set(e instanceof Error ? e.message : '删除失败');
        }
        finally {
            this.loading.set(false);
        }
    }
    static { this.ɵfac = function AdminService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AdminService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AdminService, factory: AdminService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AdminService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
