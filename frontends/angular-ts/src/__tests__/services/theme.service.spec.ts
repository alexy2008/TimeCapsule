import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from '../../app/services/theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let document: Document;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    document = TestBed.inject(DOCUMENT);
  });

  it('should default to light theme when no localStorage value', () => {
    expect(service.theme()).toBe('light');
  });

  it('should toggle from light to dark', () => {
    service.toggle();
    expect(service.theme()).toBe('dark');
  });

  it('should toggle back to light', () => {
    service.toggle();
    service.toggle();
    expect(service.theme()).toBe('light');
  });

  it('should apply data-theme attribute to documentElement', () => {
    service.toggle();
    TestBed.flushEffects();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should persist theme to localStorage', () => {
    service.toggle();
    TestBed.flushEffects();
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
