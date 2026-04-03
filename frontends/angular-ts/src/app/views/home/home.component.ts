import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TechStackService } from '../../services/tech-stack.service';
import { simplifyTechLabel } from '../../utils/tech-stack';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly techStackService = inject(TechStackService);

  readonly techStack = this.techStackService.techStack;
  readonly loading = this.techStackService.loading;
  readonly error = this.techStackService.error;
  ngOnInit(): void {
    this.techStackService.load();
  }

  get techItems() {
    const techStack = this.techStack();
    const fallback = this.error() || !techStack;

    return [
      { src: '/frontend.svg', alt: 'Angular Logo', label: 'Angular' },
      { src: '/frontend-language.svg', alt: 'TypeScript Logo', label: 'TypeScript' },
      {
        src: '/tech-logos/backend.svg',
        alt: '后端框架 Logo',
        label: this.loading() ? '...' : fallback ? '?' : simplifyTechLabel(techStack!.framework),
      },
      {
        src: '/tech-logos/language.svg',
        alt: '后端语言 Logo',
        label: this.loading() ? '加载中' : fallback ? '?' : simplifyTechLabel(techStack!.language),
      },
      {
        src: '/tech-logos/database.svg',
        alt: '数据库 Logo',
        label: this.loading() ? '...' : fallback ? '?' : simplifyTechLabel(techStack!.database),
      },
    ];
  }
}
