import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent, AppFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly routeLoading = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationStart | NavigationEnd | NavigationError | RouteConfigLoadStart | RouteConfigLoadEnd =>
          event instanceof NavigationStart ||
          event instanceof NavigationEnd ||
          event instanceof NavigationError ||
          event instanceof RouteConfigLoadStart ||
          event instanceof RouteConfigLoadEnd
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(event => {
        if (event instanceof RouteConfigLoadStart) {
          this.routeLoading.set(true);
          return;
        }

        if (event instanceof RouteConfigLoadEnd || event instanceof NavigationEnd || event instanceof NavigationError) {
          this.routeLoading.set(false);
        }
      });
  }
}
