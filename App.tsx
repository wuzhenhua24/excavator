import React, { useState, useEffect, useCallback } from 'react';
import { DirtPileData, TreasureType } from './types';
import { ExcavatorIcon, DirtPileIcon, LeftArrowIcon, RightArrowIcon, DigIcon, TreasureMap, ResetIcon } from './components/Icons';

const GRID_WIDTH = 8;
const NUM_TREASURES = 5;
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

const GameBoard: React.FC<{
    dirtPiles: DirtPileData[];
    excavatorPos: number;
    isDigging: boolean;
    diggingPileIndex: number | null;
    isMoving: boolean;
}> = ({ dirtPiles, excavatorPos, isDigging, diggingPileIndex, isMoving }) => (
    <div className="relative w-full aspect-[2/1] bg-amber-800 rounded-lg p-4 shadow-inner overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-sky-400 to-transparent"></div>
        <div className="relative w-full h-full">
            {/* Excavator */}
            <div
                className="absolute -top-12 md:-top-16 left-0 w-1/4 h-auto transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(${excavatorPos * 50}%)` }}
            >
                <div className={isDigging ? 'animate-excavator-shake' : ''}>
                    <ExcavatorIcon className="w-full h-full" isDigging={isDigging} isMoving={isMoving} />
                </div>
            </div>

            {/* Dirt Piles */}
            <div className="absolute bottom-0 grid grid-cols-8 w-full h-2/5">
                {dirtPiles.map((pile) => (
                    <div key={pile.id} className="relative w-full h-full flex justify-center items-end">
                        {!pile.isDug ? (
                            <div className={`w-full h-full ${pile.id === diggingPileIndex ? 'animate-dirt-pile-shake' : ''}`}>
                                <DirtPileIcon className="w-full h-full" />
                            </div>
                        ) : pile.treasure ? (
                            <div className="animate-treasure-reveal">
                                <TreasureMap type={pile.treasure} className="w-12 h-12" />
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/5 bg-amber-900"></div>
    </div>
);

const ControlPanel: React.FC<{
    onMove: (direction: 'left' | 'right') => void;
    onDig: () => void;
    onReset: () => void;
}> = ({ onMove, onDig, onReset }) => (
    <div className="flex justify-center items-center gap-4 mt-4">
        <button onClick={() => onMove('left')} className="p-4 bg-yellow-500 text-white rounded-full shadow-lg active:bg-yellow-600 transform active:scale-95 transition-all">
            <LeftArrowIcon />
        </button>
        <button onClick={onDig} className="p-6 bg-red-600 text-white rounded-full shadow-lg active:bg-red-700 transform active:scale-95 transition-all">
            <DigIcon />
        </button>
        <button onClick={() => onMove('right')} className="p-4 bg-yellow-500 text-white rounded-full shadow-lg active:bg-yellow-600 transform active:scale-95 transition-all">
            <RightArrowIcon />
        </button>
        <button onClick={onReset} className="p-4 bg-blue-500 text-white rounded-full shadow-lg active:bg-blue-600 transform active:scale-95 transition-all ml-8">
            <ResetIcon className="w-12 h-12" />
        </button>
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


export default function App() {
    const [excavatorPos, setExcavatorPos] = useState(0);
    const [dirtPiles, setDirtPiles] = useState<DirtPileData[]>([]);
    const [foundTreasures, setFoundTreasures] = useState<TreasureType[]>([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [diggingPileIndex, setDiggingPileIndex] = useState<number | null>(null);
    const [currentAction, setCurrentAction] = useState<'idle' | 'moving' | 'digging'>('idle');

    const initializeGame = useCallback(() => {
        let newPiles: DirtPileData[] = [];
        for (let i = 0; i < GRID_WIDTH; i++) {
            newPiles.push({ id: i, treasure: null, isDug: false });
        }

        let treasuresToPlace = NUM_TREASURES;
        let availableTreasures = [...ALL_TREASURES];
        while (treasuresToPlace > 0) {
            const pileIndex = Math.floor(Math.random() * GRID_WIDTH);
            if (!newPiles[pileIndex].treasure) {
                const treasureIndex = Math.floor(Math.random() * availableTreasures.length);
                newPiles[pileIndex].treasure = availableTreasures.splice(treasureIndex, 1)[0];
                treasuresToPlace--;
            }
        }

        setDirtPiles(newPiles);
        setExcavatorPos(0);
        setFoundTreasures([]);
        setIsGameOver(false);
        setMessage('');
        setCurrentAction('idle');
        setDiggingPileIndex(null);
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const handleMove = (direction: 'left' | 'right') => {
        if (isGameOver || currentAction !== 'idle') return;
        
        setCurrentAction('moving');

        setExcavatorPos(prev => {
            if (direction === 'left') {
                return Math.max(0, prev - 1);
            } else {
                return Math.min(GRID_WIDTH - 1, prev + 1);
            }
        });
        
        setTimeout(() => {
            setCurrentAction('idle');
        }, 300); // Corresponds to the transition duration
    };

    const handleDig = () => {
        if (isGameOver || currentAction !== 'idle') return;

        const digPosition = excavatorPos;
        const targetPile = dirtPiles[digPosition];
        if (targetPile && targetPile.isDug) return;
        
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
    };
    
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto space-y-4">
                <GameTitle />
                <ScoreDisplay foundTreasures={foundTreasures} />
                <div className="relative">
                    <GameBoard 
                        dirtPiles={dirtPiles} 
                        excavatorPos={excavatorPos} 
                        isDigging={currentAction === 'digging'} 
                        diggingPileIndex={diggingPileIndex} 
                        isMoving={currentAction === 'moving'} 
                    />
                    {isGameOver && <GameOverModal onPlayAgain={initializeGame} />}
                </div>

                {message && (
                    <div className="text-center text-2xl text-white font-bold p-2 bg-green-500 rounded-lg">
                        {message}
                    </div>
                )}
                
                <ControlPanel onMove={handleMove} onDig={handleDig} onReset={initializeGame} />
            </div>
        </div>
    );
}