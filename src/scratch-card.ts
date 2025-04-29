export interface ScratchCardOptions {
    canvas: HTMLCanvasElement;
    revealButton?: HTMLButtonElement | null;
    resetButton?: HTMLButtonElement | null;
    winImageSrc?: string;
    loseImageSrc?: string;
    buttonClass?: string;
    revealButtonClass?: string;
    resetButtonClass?: string;
    scratchThreshold?: number;
    onReveal?: ((isWinner: boolean) => void) | null;
}

export class ScratchCard {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private revealButton: HTMLButtonElement | null;
    private resetButton: HTMLButtonElement | null;
    private winImageSrc: string;
    private loseImageSrc: string;
    private buttonClass: string;
    private revealButtonClass: string;
    private resetButtonClass: string;
    private scratchThreshold: number;
    private onReveal: ((isWinner: boolean) => void) | null;

    private containerElement: HTMLElement | null;
    private winImageElement: HTMLImageElement | null = null;
    private loseImageElement: HTMLImageElement | null = null;

    private isDrawing: boolean = false;
    private lastX: number = 0;
    private lastY: number = 0;
    private totalPixels: number = 0;
    private isRevealed: boolean = false;
    private isWinningCard: boolean = false;

    constructor(options: ScratchCardOptions) {
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d')!;
        this.revealButton = options.revealButton || null;
        this.resetButton = options.resetButton || null;
        this.winImageSrc = options.winImageSrc || '';
        this.loseImageSrc = options.loseImageSrc || '';
        this.buttonClass = options.buttonClass || 'scratch-btn';
        this.revealButtonClass = options.revealButtonClass || 'scratch-reveal-btn';
        this.resetButtonClass = options.resetButtonClass || 'scratch-reset-btn';
        this.scratchThreshold = options.scratchThreshold || 0.6;
        this.onReveal = options.onReveal || null;
        
        this.containerElement = this.canvas.parentElement;

        // Resetta lo stile del canvas
        this.canvas.style.opacity = '1';
        this.canvas.style.transition = '';
    }

    /**
     * Inizializza il componente ScratchCard
     */
    public init(): void {
        this.createImagesIfNeeded();
        this.setupButtons();
        this.setRandomResult();
        this.setCanvasDimensions();
        this.setupEventListeners();
    }

    /**
     * Crea gli elementi immagine se non sono stati forniti
     */
    private createImagesIfNeeded(): void {
        if (!this.containerElement) return;

        // Cerca o crea il contenitore per le immagini
        let prizeImageContainer = this.containerElement.querySelector('.prize-image');
        if (!prizeImageContainer) {
            prizeImageContainer = document.createElement('div');
            prizeImageContainer.className = 'prize-image';
            this.containerElement.appendChild(prizeImageContainer);
        }

        // Crea l'immagine vincente se è fornito un URL
        if (this.winImageSrc) {
            this.winImageElement = document.createElement('img');
            this.winImageElement.className = 'result-image';
            this.winImageElement.src = this.winImageSrc;
            this.winImageElement.alt = 'Hai vinto!';
            this.winImageElement.style.display = 'none';
            prizeImageContainer.appendChild(this.winImageElement);
        }

        // Crea l'immagine perdente se è fornito un URL
        if (this.loseImageSrc) {
            this.loseImageElement = document.createElement('img');
            this.loseImageElement.className = 'result-image';
            this.loseImageElement.src = this.loseImageSrc;
            this.loseImageElement.alt = 'Hai perso!';
            this.loseImageElement.style.display = 'none';
            prizeImageContainer.appendChild(this.loseImageElement);
        }
    }

    /**
     * Configura i pulsanti se non sono stati forniti
     */
    private setupButtons(): void {
        if (!this.containerElement) return;

        // Crea il contenitore dei pulsanti se non esiste
        let buttonsContainer = this.containerElement.querySelector('.buttons-container');
        if (!buttonsContainer) {
            buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'buttons-container';
            this.containerElement.appendChild(buttonsContainer);
        }

        // Crea il pulsante di rivelazione se non è stato fornito
        if (!this.revealButton) {
            this.revealButton = document.createElement('button');
            this.revealButton.textContent = 'Rivela';
            this.revealButton.className = `${this.buttonClass} ${this.revealButtonClass}`;
            buttonsContainer.appendChild(this.revealButton);
        }

        // Crea il pulsante di reset se non è stato fornito
        if (!this.resetButton) {
            this.resetButton = document.createElement('button');
            this.resetButton.textContent = 'Ricomincia';
            this.resetButton.className = `${this.buttonClass} ${this.resetButtonClass}`;
            buttonsContainer.appendChild(this.resetButton);
        }
    }

    /**
     * Imposta casualmente se la carta è vincente o perdente
     */
    private setRandomResult(): void {
        // Imposta casualmente se è una vincita o una perdita (50% di probabilità)
        this.isWinningCard = Math.random() >= 0.5;

        // Mostra l'immagine appropriata
        if (this.winImageElement) {
            this.winImageElement.style.display = this.isWinningCard ? 'block' : 'none';
        }
        if (this.loseImageElement) {
            this.loseImageElement.style.display = this.isWinningCard ? 'none' : 'block';
        }
    }

    /**
     * Imposta le dimensioni del canvas in base al contenitore
     */
    private setCanvasDimensions(): void {
        if (!this.containerElement) return;
        
        this.canvas.width = this.containerElement.offsetWidth;
        this.canvas.height = this.containerElement.offsetHeight;
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
        this.ctx.fillStyle = '#a28e2a'; // Colore base per simulare la retinatura
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

        // Chiama la callback se è stata fornita
        if (this.onReveal) {
            this.onReveal(this.isWinningCard);
        }
    }

    /**
     * Resetta il gratta e vinci
     */
    public reset(): void {
        this.isRevealed = false;
        // Rimuovi la transizione e riporta l'opacità
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

        // Se raggiungiamo la soglia, rivela immediatamente
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

        // Verifica la percentuale dopo ogni movimento
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
        if (this.revealButton) {
            this.revealButton.addEventListener('click', () => this.revealAll());
        }

        // Evento per il pulsante di reset
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this.reset());
        }
    }

    /**
     * Rimuove tutti gli event listener
     */
    public destroy(): void {
        window.removeEventListener('resize', () => this.setCanvasDimensions());
        
        this.canvas.removeEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.removeEventListener('mousemove', (e) => this.draw(e));
        this.canvas.removeEventListener('mouseup', () => this.stopDrawing());
        this.canvas.removeEventListener('mouseout', () => this.stopDrawing());
        
        this.canvas.removeEventListener('touchstart', (e) => this.startDrawing(e));
        this.canvas.removeEventListener('touchmove', (e) => this.draw(e));
        this.canvas.removeEventListener('touchend', () => this.stopDrawing());
        
        if (this.revealButton) {
            this.revealButton.removeEventListener('click', () => this.revealAll());
        }
        
        if (this.resetButton) {
            this.resetButton.removeEventListener('click', () => this.reset());
        }
    }
}