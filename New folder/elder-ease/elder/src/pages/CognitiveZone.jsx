import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, HelpCircle, Layout, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import axios from 'axios';

const CognitiveZone = () => {
    const navigate = useNavigate();
    const { t } = useUI();
    const [activeGame, setActiveGame] = useState(null); // null, 'memory', 'trivia'

    return (
        <div className="elder-mode" style={{ 
            minHeight: '100vh', 
            padding: '40px',
            background: 'linear-gradient(160deg, #F8FAFC 0%, #F1F5F9 40%, #E2E8F0 100%)',
            fontFamily: "'Outfit', sans-serif"
        }}>
            <button onClick={() => activeGame ? setActiveGame(null) : navigate('/dashboard')} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                marginBottom: '40px',
                background: 'white',
                color: '#1E3A8A',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                fontSize: '20px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
            onMouseLeave={e => e.currentTarget.style.background = '#FFF'}>
                <ArrowLeft /> {t('back')}
            </button>

            {!activeGame ? (
                <>
                    <h1 style={{ marginBottom: '10px', fontSize: '42px', fontWeight: '900', color: '#1E3A8A' }}>{t('cognitive')}</h1>
                    <p style={{ fontSize: '24px', color: '#64748B', marginBottom: '40px' }}>Keep your mind sharp with these fun activities!</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px' }}>
                        <button onClick={() => setActiveGame('memory')} style={{ 
                            background: 'white', border: 'none', borderRadius: '32px', padding: '40px', height: '340px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px',
                            cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'all 0.3s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(30,58,138,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}>
                            <div style={{ padding: '24px', background: '#E0E7FF', borderRadius: '24px', color: '#1E3A8A' }}>
                                <Layout size={80} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A', margin: 0 }}>Memory Match</h2>
                                <p style={{ fontSize: '18px', color: '#64748B', margin: '8px 0 0' }}>Find the pairs of cards</p>
                            </div>
                        </button>
                        <button onClick={() => setActiveGame('trivia')} style={{ 
                            background: 'white', border: 'none', borderRadius: '32px', padding: '40px', height: '340px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px',
                            cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'all 0.3s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(30,58,138,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}>
                            <div style={{ padding: '24px', background: '#E0E7FF', borderRadius: '24px', color: '#1E3A8A' }}>
                                <HelpCircle size={80} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A', margin: 0 }}>Daily Trivia</h2>
                                <p style={{ fontSize: '18px', color: '#64748B', margin: '8px 0 0' }}>Answer interesting questions</p>
                            </div>
                        </button>
                    </div>
                </>
            ) : activeGame === 'memory' ? (
                <MemoryGame />
            ) : (
                <TriviaGame />
            )}
        </div>
    );
};

const MemoryGame = () => {
    const symbols = ['🍎', '🍌', '🍇', '🍊', '🍓', '🥑'];
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);

    const initGame = () => {
        const deck = [...symbols, ...symbols]
            .sort(() => Math.random() - 0.5)
            .map((symbol, index) => ({ id: index, symbol }));
        setCards(deck);
        setFlipped([]);
        setMatched([]);
    };

    useEffect(() => {
        initGame();
    }, []);

    const handleFlip = (id) => {
        if (flipped.length === 2 || matched.includes(id) || flipped.includes(id)) return;
        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards[first].symbol === cards[second].symbol) {
                setMatched([...matched, first, second]);
                setFlipped([]);
                if (window.speechSynthesis) {
                    const utterance = new window.SpeechSynthesisUtterance("Matched!");
                    utterance.rate = 1.2;
                    window.speechSynthesis.speak(utterance);
                }
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Memory Match</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                maxWidth: '600px',
                margin: '40px auto'
            }}>
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleFlip(idx)}
                        style={{
                            height: '120px',
                            background: matched.includes(idx) ? '#F1F5F9' : (flipped.includes(idx) ? '#fff' : '#1E3A8A'),
                            border: '4px solid #1E3A8A',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '50px',
                            cursor: 'pointer',
                            boxShadow: flipped.includes(idx) ? 'none' : '0 8px 20px rgba(30,58,138,0.2)',
                            transition: 'all 0.2s',
                            opacity: matched.includes(idx) ? 0.5 : 1
                        }}
                    >
                        {(flipped.includes(idx) || matched.includes(idx)) ? card.symbol : '?'}
                    </div>
                ))}
            </div>
            {matched.length === cards.length && cards.length > 0 && (
                <div>
                    <h3>Congratulations! You found all pairs!</h3>
                    <button className="big-button" style={{ height: 'auto', padding: '15px 30px', margin: '20px auto' }} onClick={initGame}>
                        <RefreshCw /> Play Again
                    </button>
                </div>
            )}
        </div>
    );
};

const TriviaGame = () => {
    const questions = [
        { q: "What is the capital of France?", a: ["Paris", "London", "Berlin"], correct: 0 },
        { q: "How many colors are in a rainbow?", a: ["5", "6", "7"], correct: 2 },
        { q: "Which planet is known as the Red Planet?", a: ["Mars", "Venus", "Jupiter"], correct: 0 }
    ];
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const handleAnswer = (idx) => {
        const isCorrect = idx === questions[current].correct;
        if (isCorrect) {
            setScore(score + 1);
        }

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const msg = isCorrect ? "That's correct! Well done." : "Not quite, but good try!";
            const utterance = new window.SpeechSynthesisUtterance(msg);
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
        }

        setTimeout(() => {
            if (current + 1 < questions.length) {
                setCurrent(current + 1);
            } else {
                setFinished(true);
            }
        }, 1500);
    };

    if (finished) {
        return (
            <div style={{ textAlign: 'center' }}>
                <h2>Quiz Finished!</h2>
                <p style={{ fontSize: '32px' }}>Your score: {score} / {questions.length}</p>
                <button className="big-button" style={{ height: 'auto', padding: '15px 30px', margin: '20px auto' }} onClick={() => { setCurrent(0); setScore(0); setFinished(false); }}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '40px' }}>Question {current + 1}</h2>
            <div className="glass-card" style={{ padding: '40px', marginBottom: '30px' }}>
                <p style={{ fontSize: '32px', marginBottom: '30px' }}>{questions[current].q}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {questions[current].a.map((ans, idx) => (
                        <button key={idx} className="big-button" style={{ height: 'auto', padding: '20px' }} onClick={() => handleAnswer(idx)}>
                            {ans}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CognitiveZone;
