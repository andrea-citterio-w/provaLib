import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScratchCardDirective } from './scratch-card.directive';

@NgModule({
  declarations: [],
  imports: [CommonModule, ScratchCardDirective],
  exports: [ScratchCardDirective]
})
export class ScratchCardModule {}