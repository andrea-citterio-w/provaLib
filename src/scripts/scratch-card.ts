interface ScratchCardOptions {
    canvas: HTMLCanvasElement;
    revealButton: HTMLButtonElement;
    resetButton: HTMLButtonElement;
    winImage: HTMLImageElement;
    loseImage: HTMLImageElement;
    scratchThreshold: number;
}

export class ScratchCard {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private revealButton: HTMLButtonElement;
    private resetButton: HTMLButtonElement;
    private winImage: HTMLImageElement;
    private loseImage: HTMLImageElement;
    private scratchThreshold: number;

    private isDrawing: boolean = false;
    private lastX: number = 0;
    private lastY: number = 0;
    private totalPixels: number = 0;
    private isRevealed: boolean = false;
    private isWinningCard: boolean = false;

    constructor(options: ScratchCardOptions) {
        this.canvas = options.canvas;
        this.canvas.style.opacity = '1';
        this.canvas.style.transition = '';
        this.ctx = this.canvas.getContext('2d')!;
        this.revealButton = options.revealButton;
        this.resetButton = options.resetButton;
        this.winImage = options.winImage;
        this.loseImage = options.loseImage;
        this.scratchThreshold = options.scratchThreshold;
    }

    /**
     * Inizializza il componente ScratchCard
     */
    public init(): void {
        this.setRandomResult();
        this.setCanvasDimensions();
        this.setupEventListeners();
    }

    /**
     * Imposta casualmente se la carta è vincente o perdente
     */
    private setRandomResult(): void {
        // Imposta casualmente se è una vincita o una perdita (50% di probabilità)
        this.isWinningCard = Math.random() >= 0.5;

        // Mostra l'immagine appropriata
        this.winImage.style.display = this.isWinningCard ? 'block' : 'none';
        this.loseImage.style.display = this.isWinningCard ? 'none' : 'block';
    }

    /**
     * Imposta le dimensioni del canvas in base al contenitore
     */
    private setCanvasDimensions(): void {
        const container = this.canvas.parentElement as HTMLElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        this.totalPixels = this.canvas.width * this.canvas.height;

        // Riempie il canvas con il layer da grattare
        this.drawScratchLayer();
    }

    /**
     * Disegna il layer da grattare (retinatura)
     */
    private drawScratchLayer(): void {
        // Assicuriamoci che stiamo usando la modalità di composizione normale
        this.ctx.globalCompositeOperation = 'source-over';

        // Cancella completamente il canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Disegna il nuovo layer di copertura
        this.ctx.fillStyle = '#a28e2a'; // Colore grigio per simulare la retinatura
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Aggiunge una leggera texture
        for (let i = 0; i < this.canvas.width; i += 4) {
            for (let j = 0; j < this.canvas.height; j += 4) {
                if (Math.random() > 0.5) {
                    this.ctx.fillStyle = '#94884c';
                    this.ctx.fillRect(i, j, 2, 2);
                }
            }
        }
    }

    /**
     * Rivela completamente il premio
     */
     public revealAll(): void {
        if (this.isRevealed) return;
        this.isRevealed = true;
        this.fadeOutScratchLayer();
      }

    /**
     * Resetta il gratta e vinci
     */
     public reset(): void {
        this.isRevealed = false;
        // Rimuovi la transizione e riporta l’opacità
        this.canvas.style.transition = '';
        this.canvas.style.opacity = '1';
        this.setRandomResult();
        this.drawScratchLayer();
      }

    /**
     * Verifica la percentuale di area grattata
     */
    private checkScratchedPercentage(): void {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        let transparentPixels = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] < 10) { // Se il pixel è quasi trasparente
                transparentPixels++;
            }
        }

        const scratchedPercentage = transparentPixels / this.totalPixels;

        // Se raggiungiamo il 60%, rivela immediatamente
        if (scratchedPercentage > this.scratchThreshold) {
            this.revealAll();
        }
    }

    /**
     * Gestisce l'inizio del disegno/grattamento
     */
    private startDrawing(e: MouseEvent | TouchEvent): void {
        this.isDrawing = true;

        const pos = this.getEventPosition(e);
        this.lastX = pos.x;
        this.lastY = pos.y;

        this.draw(e);
    }

    /**
     * Gestisce la fine del disegno/grattamento
     */
    private stopDrawing(): void {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.checkScratchedPercentage();
        }
    }

    /**
     * Gestisce il disegno/grattamento durante il movimento
     */
    private draw(e: MouseEvent | TouchEvent): void {
        if (!this.isDrawing || this.isRevealed) return;

        e.preventDefault();

        const pos = this.getEventPosition(e);
        const x = pos.x;
        const y = pos.y;

        // Imposta la modalità di composizione per "grattare"
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.lineWidth = 40;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();

        this.lastX = x;
        this.lastY = y;

        // Verifica la percentuale dopo ogni movimento per rivelare subito al 60%
        this.checkScratchedPercentage();
    }

    /**
     * Ottiene la posizione dell'evento (mouse o touch)
     */
    private getEventPosition(e: MouseEvent | TouchEvent): { x: number, y: number } {
        let x: number, y: number;

        if ('touches' in e) {
            // Touch event
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            x = touch.clientX - rect.left;
            y = touch.clientY - rect.top;
        } else {
            // Mouse event
            const rect = this.canvas.getBoundingClientRect();
            x = (e as MouseEvent).clientX - rect.left;
            y = (e as MouseEvent).clientY - rect.top;
        }

        return { x, y };
    }

    /**
 * Anima la scomparsa del layer di copertura
 */
    private fadeOutScratchLayer(): void {
        // Imposta la transizione CSS
        this.canvas.style.transition = 'opacity 800ms ease-out';
        // Innesca il fade
        this.canvas.style.opacity = '0';
        // Dopo la fine della transizione, pulisci il canvas
        const onEnd = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.removeEventListener('transitionend', onEnd);
        };
        this.canvas.addEventListener('transitionend', onEnd);
    }


    /**
     * Imposta gli event listener
     */
    private setupEventListeners(): void {
        // Evento di ridimensionamento
        window.addEventListener('resize', () => this.setCanvasDimensions());

        // Eventi per il mouse
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Eventi per il touch
        this.canvas.addEventListener('touchstart', (e) => this.startDrawing(e));
        this.canvas.addEventListener('touchmove', (e) => this.draw(e));
        this.canvas.addEventListener('touchend', () => this.stopDrawing());

        // Evento per il pulsante di rivelazione
        this.revealButton.addEventListener('click', () => this.revealAll());

        // Evento per il pulsante di reset
        this.resetButton.addEventListener('click', () => this.reset());
    }
}