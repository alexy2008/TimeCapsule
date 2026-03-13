import { Component, OnInit, signal } from '@angular/core';
import { getHealthInfo } from '../../api';
import type { TechStack } from '../../types';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.css',
})
export class AppFooterComponent implements OnInit {
  techStack = signal<TechStack | null>(null);

  ngOnInit(): void {
    getHealthInfo()
      .then(res => this.techStack.set(res.data.techStack))
      .catch(() => this.techStack.set(null));
  }
}
