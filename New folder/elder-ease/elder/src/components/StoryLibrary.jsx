import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ArrowLeft, Play, Pause, Square, Heart, BookOpen, Clock, FileText, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';



const StoryLibrary = ({ onBack }) => {
    const [stories, setStories] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [currentStory, setCurrentStory] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStoriesAndProgress();
    }, []);

    const fetchStoriesAndProgress = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'x-auth-token': token, 'Authorization': `Bearer ${token}` };

            // Fetch Stories
            const storiesRes = await axios.get('/api/stories', { headers });
            setStories(storiesRes.data);

            // Fetch Progress & Favorites
            const progressRes = await axios.get('/api/stories/progress/mine', { headers });
            setProgressData(progressRes.data);
        } catch (error) {
            console.error("Error fetching stories:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFavorite = async (storyId, currentFavStatus) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'x-auth-token': token, 'Authorization': `Bearer ${token}` };
            await axios.post(`/api/stories/progress/${storyId}`, { isFavorite: !currentFavStatus }, { headers });
            
            // Refetch Progress
            const progressRes = await axios.get('/api/stories/progress/mine', { headers });
            setProgressData(progressRes.data);
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    const updateProgress = async (storyId, lastPage) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'x-auth-token': token, 'Authorization': `Bearer ${token}` };
            await axios.post(`/api/stories/progress/${storyId}`, { lastPage }, { headers });
            
            // Refetch Progress subtly
            const progressRes = await axios.get('/api/stories/progress/mine', { headers });
            setProgressData(progressRes.data);
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };

    const activeStories = stories.filter(s => s.published !== false);
    const categories = ['All', ...new Set(activeStories.map(s => s.category))];
    const filteredStories = selectedCategory === 'All' ? activeStories : activeStories.filter(s => s.category === selectedCategory);

    const getProgressForStory = (id) => progressData.find(p => p.story && p.story._id === id);

    if (currentStory) {
        return (
            <StoryReader 
                story={currentStory} 
                progress={getProgressForStory(currentStory._id)}
                onBack={() => { setCurrentStory(null); fetchStoriesAndProgress(); }} 
                updateProgress={updateProgress}
                toggleFavorite={toggleFavorite}
            />
        );
    }

    return (
        <div className="glass-card" style={{ padding: '40px', background: '#F9FAFB' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <button onClick={onBack} style={{ border: 'none', background: 'none', marginRight: '20px', cursor: 'pointer' }}><ArrowLeft size={36} color="var(--primary-color)" /></button>
                <h1 style={{ fontSize: '42px', color: 'var(--primary-color)', margin: 0 }}>Story Library</h1>
            </div>

            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', marginBottom: '30px', paddingBottom: '10px' }}>
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            padding: '12px 24px', borderRadius: '30px', fontSize: '20px', fontWeight: 'bold', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                            background: selectedCategory === cat ? 'var(--primary-color)' : '#E5E7EB',
                            color: selectedCategory === cat ? 'white' : '#374151'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', fontSize: '24px', padding: '50px' }}>Loading stories...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
                    {filteredStories.map(story => {
                        const prog = getProgressForStory(story._id);
                        const isFav = prog?.isFavorite || false;
                        const hasProgress = prog?.lastPage > 1;

                        return (
                            <div key={story._id} style={{ 
                                background: 'white', borderRadius: '20px', padding: '25px', display: 'flex', 
                                justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                borderLeft: story.isFeatured ? '8px solid var(--primary-color)' : '8px solid transparent'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>{story.category}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6B7280', fontSize: '14px' }}><Clock size={16} /> {story.duration}</span>
                                        {story.pdfUrl && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#DC2626', fontSize: '14px', fontWeight: 'bold' }}><FileText size={16} /> PDF Book</span>}
                                    </div>
                                    <h2 style={{ fontSize: '28px', color: '#1F2937', margin: '0 0 10px 0' }}>{story.title}</h2>
                                    <p style={{ color: '#4B5563', fontSize: '18px', margin: '0 0 15px 0' }}>{story.description}</p>
                                    
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <button 
                                            onClick={() => setCurrentStory(story)}
                                            style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                                        >
                                            <BookOpen size={24} /> {story.pdfUrl ? 'Read PDF Book' : (hasProgress ? 'Continue Reading' : 'Read Now')}
                                        </button>
                                        <button 
                                            onClick={() => toggleFavorite(story._id, isFav)}
                                            style={{ background: isFav ? '#FEE2E2' : '#F3F4F6', color: isFav ? '#EF4444' : '#6B7280', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Heart size={28} fill={isFav ? '#EF4444' : 'none'} />
                                        </button>
                                    </div>
                                </div>
                                {story.imageUrl && (
                                    <img src={story.imageUrl} alt={story.title} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '15px', marginLeft: '20px' }} />
                                )}
                            </div>
                        );
                    })}
                    {filteredStories.length === 0 && <div style={{ fontSize: '24px', textAlign: 'center', padding: '40px', color: '#6B7280' }}>No stories found in this category.</div>}
                </div>
            )}
        </div>
    );
};

const StoryReader = ({ story, progress, onBack, updateProgress, toggleFavorite }) => {
    const isFav = progress?.isFavorite || false;
    
    // Audio State
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    
    // PDF State
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(progress?.lastPage || 1);
    
    useEffect(() => {
        // Cleanup speech on unmount
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const changePage = (offset) => {
        const newPage = pageNumber + offset;
        setPageNumber(newPage);
        updateProgress(story._id, newPage);
    };

    const handlePlay = () => {
        if (!('speechSynthesis' in window)) return alert("Text-to-speech not supported in this browser.");
        
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsPlaying(true);
            return;
        }

        window.speechSynthesis.cancel(); // Stop any current speech
        const utterance = new window.SpeechSynthesisUtterance(story.content || story.description);
        utterance.rate = 0.85; // Slightly slower for elders
        utterance.pitch = 1;
        utterance.onend = () => { setIsPlaying(false); setIsPaused(false); };
        
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        setIsPaused(false);
    };

    const handlePause = () => {
        window.speechSynthesis.pause();
        setIsPaused(true);
        setIsPlaying(false);
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
    };

    return (
        <div className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '85vh', background: '#FDFBF7' }}>
            {/* Header */}
            <div style={{ padding: '20px 30px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: '20px 20px 0 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => { handleStop(); onBack(); }} style={{ border: 'none', background: '#F3F4F6', padding: '12px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}>
                        <ArrowLeft size={28} color="#374151" />
                    </button>
                    <div>
                        <h2 style={{ fontSize: '28px', color: '#1F2937', margin: 0 }}>{story.title}</h2>
                        <span style={{ color: '#6B7280', fontSize: '16px' }}>{story.category} • {story.duration}</span>
                    </div>
                </div>
                <button 
                    onClick={() => toggleFavorite(story._id, isFav)}
                    style={{ background: isFav ? '#FEE2E2' : '#F3F4F6', border: 'none', padding: '15px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}
                >
                    <Heart size={32} fill={isFav ? '#EF4444' : 'none'} color={isFav ? '#EF4444' : '#6B7280'} />
                </button>
            </div>

            {/* Reading Area */}
            <div style={{ flex: 1, overflow: 'hidden', padding: '20px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {story.pdfUrl ? (
                    <IframeReader url={story.pdfUrl} title={story.title} description={story.description} category={story.category} />
                ) : (
                    <div style={{ maxWidth: '800px', width: '100%', fontSize: '32px', lineHeight: '1.8', color: '#374151', paddingBottom: '100px', overflowY: 'auto', margin: '0 auto' }}>
                        {story.content?.split('\n').map((para, i) => (
                            <p key={i} style={{ marginBottom: '30px' }}>{para}</p>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div style={{ padding: '20px 30px', background: 'white', borderTop: '1px solid #E5E7EB', borderRadius: '0 0 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
                {/* Audio Controls */}
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {story.narrationEnabled && (
                        <>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4B5563', marginRight: '10px' }}>Narration:</span>
                            {(!isPlaying || isPaused) ? (
                                <button onClick={handlePlay} style={{ background: '#4F46E5', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '30px', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <Play size={24} /> {isPaused ? 'Resume' : 'Play'}
                                </button>
                            ) : (
                                <button onClick={handlePause} style={{ background: '#F59E0B', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '30px', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <Pause size={24} /> Pause
                                </button>
                            )}
                            {(isPlaying || isPaused) && (
                                <button onClick={handleStop} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '30px', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <Square size={24} /> Stop
                                </button>
                            )}
                            {isPaused && (
                                <button onClick={() => { handleStop(); handlePlay(); }} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '30px', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <RotateCcw size={24} /> Replay
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* PDF Page Controls */}
                {story.pdfUrl && numPages && (
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <button 
                            disabled={pageNumber <= 1} 
                            onClick={() => changePage(-1)}
                            style={{ background: pageNumber <= 1 ? '#E5E7EB' : 'var(--primary-color)', color: 'white', border: 'none', padding: '15px', borderRadius: '50%', cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer', display: 'flex' }}
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151', minWidth: '100px', textAlign: 'center' }}>
                            Page {pageNumber} of {numPages}
                        </span>
                        <button 
                            disabled={pageNumber >= numPages} 
                            onClick={() => changePage(1)}
                            style={{ background: pageNumber >= numPages ? '#E5E7EB' : 'var(--primary-color)', color: 'white', border: 'none', padding: '15px', borderRadius: '50%', cursor: pageNumber >= numPages ? 'not-allowed' : 'pointer', display: 'flex' }}
                        >
                            <ChevronRight size={32} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
// --- EXTERNAL STORY READER: Opens external story/PDF URLs ---
const IframeReader = ({ url, title, description, category }) => {
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [iframeError, setIframeError] = useState(false);
    const [useDirectLink, setUseDirectLink] = useState(false);

    const isPdf = url?.toLowerCase().includes('.pdf');

    // Most external sites block iframe embedding via X-Frame-Options.
    // For PDFs we try an iframe first; for everything else, go straight to the card.
    useEffect(() => {
        if (!isPdf) {
            setUseDirectLink(true);
        }
    }, [isPdf]);

    // Auto-detect iframe failures: if it hasn't loaded within 5 seconds, show fallback
    useEffect(() => {
        if (isPdf && !useDirectLink) {
            const timeout = setTimeout(() => {
                if (!iframeLoaded) {
                    setUseDirectLink(true);
                }
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [isPdf, useDirectLink, iframeLoaded]);

    // --- Direct-link card (shown for all non-PDF URLs + PDFs that fail to load) ---
    if (useDirectLink) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '24px', flex: 1, background: 'linear-gradient(135deg, #EEF2FF 0%, #F0FDF4 100%)',
                borderRadius: '24px', padding: '50px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
                <div style={{ fontSize: '80px' }}>📚</div>
                <div>
                    <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '6px 16px', borderRadius: '20px', fontSize: '16px', fontWeight: 'bold' }}>{category}</span>
                </div>
                <h2 style={{ fontSize: '36px', color: '#1F2937', margin: 0 }}>{title}</h2>
                <p style={{ fontSize: '22px', color: '#6B7280', maxWidth: '600px', lineHeight: '1.6' }}>{description}</p>
                <button
                    onClick={() => window.open(url, '_blank')}
                    style={{
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                        color: 'white', border: 'none', padding: '20px 50px',
                        borderRadius: '50px', fontSize: '26px', fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                        boxShadow: '0 8px 25px rgba(79,70,229,0.4)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <BookOpen size={30} /> Open Story to Read
                </button>
                <p style={{ fontSize: '16px', color: '#9CA3AF' }}>Opens in a new tab for the best reading experience</p>
            </div>
        );
    }

    // --- PDF iframe rendering (only for .pdf URLs that haven't failed) ---
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: '12px' }}>
            {!iframeLoaded && (
                <div style={{ textAlign: 'center', padding: '20px', fontSize: '20px', color: '#6B7280' }}>
                    📖 Loading story...
                </div>
            )}
            <iframe
                src={url}
                title={title}
                onLoad={() => setIframeLoaded(true)}
                onError={() => { setIframeError(true); setUseDirectLink(true); }}
                style={{
                    width: '100%',
                    flex: 1,
                    minHeight: '560px',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    background: 'white',
                    display: iframeLoaded ? 'block' : 'none'
                }}
            />
            {iframeLoaded && (
                <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '10px' }}>
                    <button
                        onClick={() => window.open(url, '_blank')}
                        style={{ background: '#4F46E5', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                    >
                        <FileText size={20} /> Open Full Screen
                    </button>
                </div>
            )}
        </div>
    );
};

export default StoryLibrary;
