import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TechStackService } from '../../services/tech-stack.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly techStackService = inject(TechStackService);

  techStack = this.techStackService.techStack;
  loading = this.techStackService.loading;
  error = this.techStackService.error;
  clickCount = signal(0);

  ngOnInit(): void {
    this.techStackService.load();
  }

  get techItems() {
    const techStack = this.techStack();
    const unavailable = this.error() || !techStack;

    return [
      { src: '/frontend.svg', alt: 'Angular', title: 'Angular', version: 'Angular 18' },
      { src: '/frontend-language.svg', alt: 'TypeScript', title: 'TypeScript', version: 'TypeScript 5' },
      {
        src: techStack ? `/tech-logos/backend.svg?v=${encodeURIComponent(techStack.framework)}` : '/tech-logos/backend.svg',
        alt: '后端框架',
        title: this.loading() ? '后端框架' : unavailable ? '暂不可用' : techStack!.framework,
        version: this.loading() ? '加载中...' : unavailable ? '技术栈信息暂不可用' : techStack!.framework,
      },
      {
        src: techStack ? `/tech-logos/language.svg?v=${encodeURIComponent(techStack.language)}` : '/tech-logos/language.svg',
        alt: '后端语言',
        title: this.loading() ? '后端语言' : unavailable ? '暂不可用' : techStack!.language,
        version: this.loading() ? '加载中...' : unavailable ? '技术栈信息暂不可用' : techStack!.language,
      },
      {
        src: techStack ? `/tech-logos/database.svg?v=${encodeURIComponent(techStack.database)}` : '/tech-logos/database.svg',
        alt: '数据库',
        title: this.loading() ? '数据库' : unavailable ? '暂不可用' : techStack!.database,
        version: this.loading() ? '加载中...' : unavailable ? '技术栈信息暂不可用' : techStack!.database,
      },
    ];
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  handleSecretClick(): void {
    this.clickCount.update(n => n + 1);
    if (this.clickCount() >= 5) {
      this.clickCount.set(0);
      this.router.navigate(['/admin']);
    }
  }
}
