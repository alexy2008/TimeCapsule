import { Component, OnInit, inject } from '@angular/core';
import { TechStackService } from '../../services/tech-stack.service';
import { simplifyTechLabel } from '../../utils/tech-stack';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.css',
})
export class AppFooterComponent implements OnInit {
  private readonly techStackService = inject(TechStackService);

  readonly techStack = this.techStackService.techStack;
  readonly loading = this.techStackService.loading;
  readonly error = this.techStackService.error;

  ngOnInit(): void {
    this.techStackService.load();
  }

  get summary(): string {
    if (this.loading()) {
      return '加载中...';
    }

    if (this.error() || !this.techStack()) {
      return '技术栈信息暂不可用';
    }

    const techStack = this.techStack()!;
    return [
      'Angular',
      'TypeScript',
      simplifyTechLabel(techStack.framework),
      simplifyTechLabel(techStack.language),
      simplifyTechLabel(techStack.database),
    ].join(' · ');
  }
}
