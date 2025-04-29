import { Directive, ElementRef, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ScratchCard } from '../src/scratch-card';

@Directive({
  selector: '[scratchCard]'
})
export class ScratchCardDirective implements OnInit, OnDestroy {
  @Input() winImageSrc: string = '';
  @Input() loseImageSrc: string = '';
  @Input() scratchThreshold: number = 0.6;
  @Input() buttonClass: string = 'scratch-btn';
  @Input() revealButtonClass: string = 'scratch-reveal-btn';
  @Input() resetButtonClass: string = 'scratch-reset-btn';
  @Input() revealButton: HTMLButtonElement | null = null;
  @Input() resetButton: HTMLButtonElement | null = null;

  @Output() onReveal = new EventEmitter<boolean>();

  private scratchCard: ScratchCard | null = null;
  private canvas: HTMLCanvasElement | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Crea un elemento canvas se non esiste già
    this.canvas = this.el.nativeElement.querySelector('canvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'scratch-canvas';
      this.el.nativeElement.appendChild(this.canvas);
    }

    // Inizializza ScratchCard
    if (this.canvas) {
      this.scratchCard = new ScratchCard({
        canvas: this.canvas,
        revealButton: this.revealButton,
        resetButton: this.resetButton,
        winImageSrc: this.winImageSrc,
        loseImageSrc: this.loseImageSrc,
        scratchThreshold: this.scratchThreshold,
        buttonClass: this.buttonClass,
        revealButtonClass: this.revealButtonClass, 
        resetButtonClass: this.resetButtonClass,
        onReveal: (isWinner: boolean) => {
          this.onReveal.emit(isWinner);
        }
      });

      this.scratchCard.init();
    }
  }

  ngOnDestroy(): void {
    // Pulizia delle risorse
    if (this.scratchCard) {
      this.scratchCard.destroy();
    }
  }

  // Metodi pubblici che possono essere chiamati dall'esterno
  public reveal(): void {
    if (this.scratchCard) {
      this.scratchCard.revealAll();
    }
  }

  public reset(): void {
    if (this.scratchCard) {
      this.scratchCard.reset();
    }
  }
}