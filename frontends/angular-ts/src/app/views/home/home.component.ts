import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TechStackService } from '../../services/tech-stack.service';

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

  get backendDescription(): string {
    if (this.loading()) {
      return '加载中...';
    }

    if (this.error() || !this.techStack()) {
      return '技术栈信息暂不可用';
    }

    return `${this.techStack()!.framework} · ${this.techStack()!.language}`;
  }

  get databaseDescription(): string {
    if (this.loading()) {
      return '加载中...';
    }

    if (this.error() || !this.techStack()) {
      return '技术栈信息暂不可用';
    }

    return this.techStack()!.database;
  }
}
