import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  message(error: unknown): string {
    if (error instanceof Error && !(error instanceof HttpErrorResponse)) {
      return error.message;
    }
    if (!(error instanceof HttpErrorResponse)) {
      return 'Something unexpected happened. Please try again.';
    }

    if (error.status === 0) {
      return 'The API could not be reached. Check that the Day 8 Laravel server is running.';
    }

    const body: unknown = error.error;
    if (this.isRecord(body)) {
      const validationMessage = this.getValidationMessage(body['errors']);
      if (validationMessage) {
        return validationMessage;
      }
      if (typeof body['message'] === 'string') {
        return body['message'];
      }
    }

    if (error.status >= 500) {
      return 'The server could not complete the request. Please try again later.';
    }
    return `The request failed with status ${error.status}. Please review your information and try again.`;
  }

  private getValidationMessage(errors: unknown): string | null {
    if (!this.isRecord(errors)) {
      return null;
    }
    for (const value of Object.values(errors)) {
      if (Array.isArray(value) && typeof value[0] === 'string') {
        return value[0];
      }
    }
    return null;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
