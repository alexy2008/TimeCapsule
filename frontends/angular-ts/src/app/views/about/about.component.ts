import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { getHealthInfo } from '../../api';
import type { TechStack } from '../../types';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit {
  private readonly router = inject(Router);

  techStack = signal<TechStack | null>(null);
  clickCount = signal(0);

  ngOnInit(): void {
    getHealthInfo()
      .then(res => this.techStack.set(res.data.techStack))
      .catch(() => this.techStack.set({ framework: 'Unknown', language: 'Unknown', database: 'Unknown' }));
  }

  handleSecretClick(): void {
    this.clickCount.update(n => n + 1);
    if (this.clickCount() >= 5) {
      this.clickCount.set(0);
      this.router.navigate(['/admin']);
    }
  }
}
