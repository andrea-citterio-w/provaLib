## Caratteristiche

- Effetto di grattamento realistico
- Supporto per touch e mouse
- Supporto per immagini personalizzate per vincita e perdita
- Configurazione della soglia di rivelazione 
- Callback quando il premio viene rivelato
- Integrazione con Angular tramite direttiva
- Personalizzazione degli stili e delle classi CSS


## Utilizzo base

### In un progetto TypeScript/JavaScript

```typescript
import { ScratchCard } from 'scratch-card-lib';

// Ottieni il canvas dal DOM
const canvas = document.getElementById('scratch-canvas') as HTMLCanvasElement;

// Crea l'istanza di ScratchCard
const scratchCard = new ScratchCard({
  canvas: canvas,
  winImageSrc: 'path/to/win-image.png',
  loseImageSrc: 'path/to/lose-image.png',
  scratchThreshold: 0.6, // Rivela automaticamente dopo che il 60% è stato grattato
  onReveal: (isWinner) => {
    console.log(isWinner ? 'Hai vinto!' : 'Hai perso!');
  }
});

// Inizializza il componente
scratchCard.init();
```

### In un progetto Angular

1. Importa il modulo nel tuo modulo Angular:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ScratchCardModule } from 'scratch-card-lib';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ScratchCardModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

2. Aggiungi la direttiva al tuo template HTML:

```html
<div class="container">
  <h1>Gratta e vinci demo</h1>
  
  <div scratchCard
       [winImageSrc]="'assets/win-image.png'"
       [loseImageSrc]="'assets/lose-image.png'"
       [scratchThreshold]="0.6"
       [buttonClass]="'btn'"
       (onReveal)="onRevealHandler($event)"
       class="scratch-container">
  </div>
</div>
```

3. Gestisci gli eventi nel tuo componente:

```typescript
import { Component, ViewChild } from '@angular/core';
import { ScratchCardDirective } from 'scratch-card-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(ScratchCardDirective) scratchCard!: ScratchCardDirective;
  
  onRevealHandler(isWinner: boolean): void {
    console.log('Card revealed:', isWinner ? 'Winner!' : 'Not a winner');
    // Qui puoi gestire il risultato
  }
  
  // Metodi per controllare il componente programmaticamente
  revealManually(): void {
    this.scratchCard.reveal();
  }
  
  resetCard(): void {
    this.scratchCard.reset();
  }
}
```

## Stili

La libreria include stili di base. Per includerli nel tuo progetto Angular, aggiungi nel file `angular.json`:

```json
"styles": [
  "node_modules/scratch-card-lib/dist/scratch-card.scss",
  "src/styles.scss"
]
```

In alternativa, puoi importare gli stili direttamente nel tuo file SCSS principale:

```scss
@import 'node_modules/scratch-card-lib/dist/scratch-card.scss';
```

## Opzioni di configurazione

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `canvas` | HTMLCanvasElement | (richiesto) | Il canvas su cui disegnare l'effetto di grattamento |
| `winImageSrc` | string | '' | URL dell'immagine da mostrare in caso di vincita |
| `loseImageSrc` | string | '' | URL dell'immagine da mostrare in caso di perdita |
| `scratchThreshold` | number | 0.6 | Percentuale (0-1) di area che deve essere grattata per rivelare automaticamente |
| `buttonClass` | string | 'scratch-btn' | Classe CSS base per i pulsanti |
| `revealButtonClass` | string | 'scratch-reveal-btn' | Classe CSS aggiuntiva per il pulsante di rivelazione |
| `resetButtonClass` | string | 'scratch-reset-btn' | Classe CSS aggiuntiva per il pulsante di reset |
| `revealButton` | HTMLButtonElement | null | Elemento pulsante per forzare la rivelazione |
| `resetButton` | HTMLButtonElement | null | Elemento pulsante per resettare il gratta e vinci |
| `onReveal` | Function | null | Callback chiamata quando il premio viene rivelato |

## Metodi pubblici

| Metodo | Descrizione |
|--------|-------------|
| `init()` | Inizializza il componente gratta e vinci |
| `revealAll()` | Rivela immediatamente il risultato |
| `reset()` | Resetta il gratta e vinci con un nuovo risultato casuale |
| `destroy()` | Rimuove gli event listener (da chiamare quando il componente viene distrutto) |
