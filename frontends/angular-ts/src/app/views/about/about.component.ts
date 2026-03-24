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

  handleSecretClick(): void {
    this.clickCount.update(n => n + 1);
    if (this.clickCount() >= 5) {
      this.clickCount.set(0);
      this.router.navigate(['/admin']);
    }
  }
}
