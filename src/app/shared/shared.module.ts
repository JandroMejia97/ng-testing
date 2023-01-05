import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasErrorsPipe } from './pipes/has-errors/has-errors.pipe';
import { HasErrorPipe } from './pipes/has-error/has-error.pipe';

@NgModule({
  declarations: [HasErrorsPipe, HasErrorPipe],
  imports: [CommonModule],
  exports: [HasErrorsPipe, HasErrorPipe],
})
export class SharedModule {}
