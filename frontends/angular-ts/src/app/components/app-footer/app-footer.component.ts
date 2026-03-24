import { Component, OnInit, inject } from '@angular/core';
import { TechStackService } from '../../services/tech-stack.service';

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
}
