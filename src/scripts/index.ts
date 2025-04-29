import { ScratchCard } from './scratch-card';

document.addEventListener('DOMContentLoaded', () => {
    // Inizializzazione dell'app gratta e vinci
    const canvas = document.getElementById('scratch-canvas') as HTMLCanvasElement;
    const revealBtn = document.getElementById('reveal-btn') as HTMLButtonElement;
    const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;
    const winImage = document.getElementById('win-image') as HTMLImageElement;
    const loseImage = document.getElementById('lose-image') as HTMLImageElement;
    
    if (canvas && revealBtn && resetBtn && winImage && loseImage) {
        // Creazione dell'istanza ScratchCard con soglia di rivelazione al 60%
        const scratchCard = new ScratchCard({
            canvas: canvas,
            revealButton: revealBtn,
            resetButton: resetBtn,
            winImage: winImage,
            loseImage: loseImage,
            scratchThreshold: 0.6
        });
        
        scratchCard.init();
    } else {
        console.error('Elementi DOM non trovati');
    }
});