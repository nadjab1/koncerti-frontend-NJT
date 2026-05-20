import { Injectable, signal } from '@angular/core';

export interface Notification {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notification = signal<Notification | null>(null);

  success(message: string): void {
    this.notification.set({ message, type: 'success' });
    setTimeout(() => this.notification.set(null), 3000);
  }

  error(message: string): void {
    this.notification.set({ message, type: 'error' });
    setTimeout(() => this.notification.set(null), 4000);
  }
}