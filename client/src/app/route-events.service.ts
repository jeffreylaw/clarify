import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';
import { Location } from '@angular/common';

@Injectable()
export class RouteEventsService {

  // Save the previous route path
  public previousRoutePath = new BehaviorSubject<string>('');

  constructor(
    private router: Router,
    private location: Location
  ) {

    // Set the previous route path to be the current one
    this.previousRoutePath.next(this.location.path());

    // On every route change, take the two events of the two routes changed and save
    // the old one.
    this.router.events.pipe(
      filter(e => e instanceof RoutesRecognized),
      pairwise(),
        )
    .subscribe((event: any[]) => {
        this.previousRoutePath.next(event[0].urlAfterRedirects);
    });
  }
}