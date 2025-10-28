import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DirtPileData, TreasureType } from './types';
import { ExcavatorIcon, DirtPileIcon, LeftArrowIcon, RightArrowIcon, DigIcon, TreasureMap, ResetIcon, UpArrowIcon, DownArrowIcon, SunIcon, CloudIcon, ConstructionConeIcon } from './components/Icons';
import { useSound, digSoundSrc, moveSoundSrc, treasureSoundSrc } from './sounds';

const GRID_WIDTH = 8;
const GRID_HEIGHT = 16; // Increased grid height for a larger play area
const NUM_TREASURES = 10; // Increased treasures for the larger map
const ALL_TREASURES = Object.values(TreasureType);

const GameTitle = () => (
    <h1 className="text-4xl md:text-6xl text-yellow-300 font-bold text-center tracking-wider" style={{ WebkitTextStroke: '3px #a16207', textShadow: '4px 4px 0 #a16207' }}>
        Diggy Diggy Excavator
    </h1>
);

const ScoreDisplay: React.FC<{ foundTreasures: TreasureType[] }> = ({ foundTreasures }) => (
    <div className="bg-yellow-600/80 p-4 rounded-xl shadow-lg border-4 border-yellow-800">
        <h2 className="text-2xl text-white text-center mb-2">Treasures Found!</h2>
        <div className="flex justify-center items-center gap-2 h-12">
            {foundTreasures.length > 0 ? (
                foundTreasures.map((t, i) => (
                    <TreasureMap key={i} type={t} className="w-10 h-10" />
                ))
            ) : (
                <p className="text-yellow-200">Dig to find treasures!</p>
            )}
        </div>
    </div>
);

const DustParticles: React.FC = () => {
    const particles = React.useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        style: {
            '--x': `${(Math.random() - 0.5) * 80}px`,
            '--y': `${(Math.random() * -50) - 20}px`,
            '--d': `${Math.random() * 200}ms`,
            '--s': `${0.5 + Math.random() * 0.8}`
        } as React.CSSProperties
    })), []);

    return (
        <>
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute w-2 h-2 md:w-3 md:h-3 bg-amber-700 rounded-full animate-dust-particle"
                    style={p.style}
                />
            ))}
        </>
    );
};

const GameBoard: React.FC<{
    dirtPiles: DirtPileData[];
    excavatorPos: { x: number; y: number };
    isDigging: boolean;
    diggingPileIndex: number | null;
    isMoving: boolean;
    gridWidth: number;
    gridHeight: number;
}> = ({ dirtPiles, excavatorPos, isDigging, diggingPileIndex, isMoving, gridWidth, gridHeight }) => {
    const excavatorHeightPercent = 100 / gridHeight;
    const excavatorWidthPercent = 100 / gridWidth;

    return (
        <div className="relative w-full bg-amber-800 rounded-lg shadow-inner overflow-hidden border-4 border-amber-900">
            {/* Dust Effect */}
            {isDigging && (
                <div
                    className="absolute z-20 pointer-events-none"
                    style={{
                        left: `${(excavatorPos.x + 0.5) * excavatorWidthPercent}%`,
                        top: `${(excavatorPos.y + 0.5) * excavatorHeightPercent}%`
                    }}
                >
                    <DustParticles />
                </div>
            )}

            {/* Excavator */}
            <div
                className="absolute top-0 left-0 transition-transform duration-300 ease-in-out z-10 p-1"
                style={{
                    width: `${excavatorWidthPercent}%`,
                    height: `${excavatorHeightPercent}%`,
                    transform: `translate(${excavatorPos.x * 100}%, ${excavatorPos.y * 100}%)`,
                }}
            >
                <div className={isDigging ? 'animate-excavator-shake' : ''}>
                    <ExcavatorIcon className="w-full h-full" isDigging={isDigging} isMoving={isMoving} />
                </div>
            </div>

            {/* Dirt Piles Grid */}
            <div
                className="grid w-full"
                style={{
                    gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
                }}
            >
                {dirtPiles.map((pile) => (
                    <div key={pile.id} className="relative w-full aspect-[1/1] flex justify-center items-center border border-amber-900/20">
                        {!pile.isDug ? (
                            <div className={`w-full h-full ${pile.id === diggingPileIndex ? 'animate-dirt-pile-shake' : ''}`}>
                                <DirtPileIcon className="w-full h-full p-1" />
                            </div>
                        ) : pile.treasure ? (
                            <div className="animate-treasure-reveal w-full h-full flex justify-center items-center">
                                <TreasureMap type={pile.treasure} className="w-2/3 h-2/3" />
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ControlPanel: React.FC<{
    onMove: (direction: 'left' | 'right' | 'up' | 'down') => void;
    onDig: () => void;
    onReset: () => void;
}> = ({ onMove, onDig, onReset }) => (
    <div className="flex justify-center items-center gap-2 md:gap-4">
        <ConstructionConeIcon className="w-12 h-12 md:w-16 md:h-16 transform -scale-x-100" />
        <div className="grid grid-cols-3 gap-2 w-auto items-center p-2 md:p-4 bg-gray-700/50 rounded-2xl shadow-inner">
            <div></div>
            <button onClick={() => onMove('up')} className="p-3 md:p-4 bg-yellow-500 text-white rounded-full shadow-lg active:bg-yellow-600 transform active:scale-95 transition-all place-self-center focus:outline-none focus:ring-4 focus:ring-yellow-400"><UpArrowIcon className="h-8 w-8 md:h-10 md:w-10" /></button>
            <div></div>
            <button onClick={() => onMove('left')} className="p-3 md:p-4 bg-yellow-500 text-white rounded-full shadow-lg active:bg-yellow-600 transform active:scale-95 transition-all place-self-center focus:outline-none focus:ring-4 focus:ring-yellow-400"><LeftArrowIcon className="h-8 w-8 md:h-10 md:w-10" /></button>
            <button onClick={onDig} className="p-4 md:p-6 bg-red-600 text-white rounded-full shadow-lg active:bg-red-700 transform active:scale-95 transition-all place-self-center focus:outline-none focus:ring-4 focus:ring-red-400"><DigIcon className="h-10 w-10 md:h-12 md:w-12" /></button>
            <button onClick={() => onMove('right')} className="p-3 md:p-4 bg-yellow-500 text-white rounded-full shadow-lg active:bg-yellow-600 transform active:scale-95 transition-all place-self-center focus:outline-none focus:ring-4 focus:ring-yellow-400"><RightArrowIcon className="h-8 w-8 md:h-10 md:w-10" /></button>
            <div></div>
            <button onClick={() => onMove('down')} className="p-3 md:p-4 bg-yellow-500 text-white rounded-full shadow-lg active:bg-yellow-600 transform active:scale-95 transition-all place-self-center focus:outline-none focus:ring-4 focus:ring-yellow-400"><DownArrowIcon className="h-8 w-8 md:h-10 md:w-10" /></button>
            <div></div>
        </div>
        <button onClick={onReset} className="p-3 md:p-4 bg-blue-500 text-white rounded-full shadow-lg active:bg-blue-600 transform active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-blue-300">
            <ResetIcon className="w-8 h-8 md:w-12 md:w-12" />
        </button>
        <ConstructionConeIcon className="w-12 h-12 md:w-16 md:h-16" />
    </div>
);

const GameOverModal: React.FC<{ onPlayAgain: () => void }> = ({ onPlayAgain }) => (
    <div className="absolute inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center transform scale-100 transition-transform duration-300">
            <h2 className="text-5xl text-yellow-500 font-bold mb-4">You Won!</h2>
            <p className="text-xl text-gray-700 mb-6">You found all the treasures!</p>
            <button
                onClick={onPlayAgain}
                className="px-8 py-4 bg-green-500 text-white text-2xl font-bold rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all"
            >
                Play Again
            </button>
        </div>
    </div>
);

const Instructions = () => (
    <div className="text-center text-white text-lg md:text-xl p-2 bg-sky-800/70 rounded-md border-2 border-sky-600 shadow-lg space-y-1">
        <p>Use the <span className="font-bold text-yellow-300">arrows</span> on screen or your <span className="font-bold text-yellow-300">keyboard</span> to move.</p>
        <p>Press the <span className="font-bold text-red-400">shovel</span> or <span className="font-bold text-red-400">spacebar</span> to dig for treasure!</p>
    </div>
);


export default function App() {
    const [excavatorPos, setExcavatorPos] = useState({ x: 0, y: 0 });
    const [dirtPiles, setDirtPiles] = useState<DirtPileData[]>([]);
    const [foundTreasures, setFoundTreasures] = useState<TreasureType[]>([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [diggingPileIndex, setDiggingPileIndex] = useState<number | null>(null);
    const [currentAction, setCurrentAction] = useState<'idle' | 'moving' | 'digging'>('idle');

    const viewportRef = useRef<HTMLElement>(null);
    const worldRef = useRef<HTMLDivElement>(null);

    const playDigSound = useSound(digSoundSrc, { volume: 0.7 });
    const playMoveSound = useSound(moveSoundSrc, { volume: 0.5 });
    const playTreasureSound = useSound(treasureSoundSrc);

    const initializeGame = useCallback(() => {
        let newPiles: DirtPileData[] = [];
        for (let i = 0; i < GRID_WIDTH * GRID_HEIGHT; i++) {
            newPiles.push({ id: i, treasure: null, isDug: false });
        }

        let treasuresToPlace = NUM_TREASURES;
        let availableTreasures = [...ALL_TREASURES];
        while (treasuresToPlace > 0) {
            const pileIndex = Math.floor(Math.random() * (GRID_WIDTH * GRID_HEIGHT));
            if (!newPiles[pileIndex].treasure) {
                const treasureIndex = Math.floor(Math.random() * availableTreasures.length);
                newPiles[pileIndex].treasure = availableTreasures.splice(treasureIndex, 1)[0];
                treasuresToPlace--;
                if (availableTreasures.length === 0) {
                    availableTreasures = [...ALL_TREASURES];
                }
            }
        }

        setDirtPiles(newPiles);
        setExcavatorPos({ x: 0, y: 0 });
        setFoundTreasures([]);
        setIsGameOver(false);
        setMessage('');
        setCurrentAction('idle');
        setDiggingPileIndex(null);
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    useEffect(() => {
        if (!viewportRef.current || !worldRef.current) return;

        const worldWidth = worldRef.current.offsetWidth;
        const cellHeight = worldWidth / GRID_WIDTH;
        const viewportHeight = viewportRef.current.offsetHeight;
        
        if (viewportHeight === 0) return;

        const excavatorYPos = excavatorPos.y * cellHeight;
        let targetScrollY = excavatorYPos - (viewportHeight / 2) + (cellHeight / 2);

        const worldHeight = worldRef.current.offsetHeight;
        const maxScrollY = worldHeight - viewportHeight;
        
        targetScrollY = Math.max(0, Math.min(targetScrollY, maxScrollY < 0 ? 0 : maxScrollY));

        worldRef.current.style.transform = `translateY(-${targetScrollY}px)`;
    }, [excavatorPos]);

    const handleMove = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
        if (isGameOver || currentAction !== 'idle') return;
        
        playMoveSound();
        setCurrentAction('moving');

        setExcavatorPos(prev => {
            switch(direction) {
                case 'left':
                    return { ...prev, x: Math.max(0, prev.x - 1) };
                case 'right':
                    return { ...prev, x: Math.min(GRID_WIDTH - 1, prev.x + 1) };
                case 'up':
                    return { ...prev, y: Math.max(0, prev.y - 1) };
                case 'down':
                    return { ...prev, y: Math.min(GRID_HEIGHT - 1, prev.y + 1) };
                default:
                    return prev;
            }
        });
        
        setTimeout(() => {
            setCurrentAction('idle');
        }, 300);
    }, [isGameOver, currentAction, playMoveSound]);

    const handleDig = useCallback(() => {
        if (isGameOver || currentAction !== 'idle') return;

        const digPosition = excavatorPos.y * GRID_WIDTH + excavatorPos.x;
        const targetPile = dirtPiles[digPosition];
        if (targetPile && targetPile.isDug) return;
        
        playDigSound();
        setCurrentAction('digging');
        setDiggingPileIndex(digPosition);
        
        const foundTreasure = targetPile?.treasure || null;

        setTimeout(() => {
            setDirtPiles(currentPiles =>
                currentPiles.map((pile, index) =>
                    index === digPosition ? { ...pile, isDug: true } : pile
                )
            );

            if (foundTreasure) {
                playTreasureSound();
                setFoundTreasures(currentTreasures => {
                    if (currentTreasures.includes(foundTreasure)) {
                        return currentTreasures;
                    }
                    const newFoundTreasures = [...currentTreasures, foundTreasure];
                    if (newFoundTreasures.length === NUM_TREASURES) {
                        setIsGameOver(true);
                    }
                    return newFoundTreasures;
                });
                
                setMessage(`You found a ${foundTreasure.replace(/_/g, ' ').toLowerCase()}!`);
                setTimeout(() => setMessage(''), 2000);
            }

            setCurrentAction('idle');
            setDiggingPileIndex(null);
        }, 400);
    }, [isGameOver, currentAction, excavatorPos, dirtPiles, playDigSound, playTreasureSound]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            switch(e.key) {
                case 'ArrowUp': case 'w': handleMove('up'); break;
                case 'ArrowDown': case 's': handleMove('down'); break;
                case 'ArrowLeft': case 'a': handleMove('left'); break;
                case 'ArrowRight': case 'd': handleMove('right'); break;
                case ' ': case 'Enter': handleDig(); break;
                case 'r': initializeGame(); break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleMove, handleDig, initializeGame]);
    
    return (
        <div className={`h-screen w-full flex flex-col overflow-hidden bg-gradient-to-b from-sky-400 via-amber-700 to-stone-900 ${currentAction === 'digging' ? 'animate-screen-shake' : ''}`}>
            {/* Header */}
            <header className="w-full max-w-7xl mx-auto space-y-2 px-4 pt-2 z-20">
                <GameTitle />
                <ScoreDisplay foundTreasures={foundTreasures} />
            </header>

            {/* Game Viewport */}
            <main ref={viewportRef} className="flex-1 w-full max-w-7xl mx-auto overflow-hidden relative py-4">
                 <div ref={worldRef} className="absolute top-0 left-0 w-full transition-transform duration-500 ease-in-out">
                    <div className="relative px-4">
                        <GameBoard
                            dirtPiles={dirtPiles}
                            excavatorPos={excavatorPos}
                            isDigging={currentAction === 'digging'}
                            diggingPileIndex={diggingPileIndex}
                            isMoving={currentAction === 'moving'}
                            gridWidth={GRID_WIDTH}
                            gridHeight={GRID_HEIGHT}
                        />
                    </div>
                 </div>
                 {isGameOver && <GameOverModal onPlayAgain={initializeGame} />}
            </main>

            {/* Footer */}
            <footer className="w-full max-w-7xl mx-auto space-y-2 px-4 pb-2 z-20">
                {message && (
                    <div className="text-center text-2xl text-white font-bold p-2 bg-green-500 rounded-lg">
                        {message}
                    </div>
                )}
                <Instructions />
                <ControlPanel onMove={handleMove} onDig={handleDig} onReset={initializeGame} />
            </footer>
        </div>
    );
}