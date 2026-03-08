import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserAvailabilityService {
  private readonly existingUsernames = new Set([
    'admin',
    'devendra',
    'john',
    'testuser',
  ]);

  checkUsernameExists(username: string): Observable<boolean> {
    const normalized = username.trim().toLowerCase();
    return of(this.existingUsernames.has(normalized)).pipe(delay(700));
  }
}
