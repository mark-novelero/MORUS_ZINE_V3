import React, { useState, useMemo, useEffect } from 'react'
import './Zines.css'
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// --- ANIMATION CONFIGURATION ---

// 1. The Heavy Drop (Title & Filters)
// They drop TOGETHER (sync)
const stoneDrop = (delay) => ({
    hidden: { y: -1500, opacity: 1 },
    visible: { 
        y: [-1500, 0, -30, 0], 
        opacity: 1,
        transition: { 
            delay: delay, 
            duration: 0.8,
            times: [0, 0.6, 0.75, 1],
            ease: ["easeIn", "easeOut", "easeIn"] 
        }
    }
});

// 2. The "Collision" Drop (Zine Grid)
const gridCollisionVariants = {
    hidden: { 
        y: -150,    // Floating high up
        opacity: 1  // UPDATED: Visible from the start (no fade in)
    },
    visible: { 
        y: 0, 
        opacity: 1,
        transition: { 
            // Timing: 0.55s is roughly when the Title hits the bottom
            delay: 0.55, 
            type: "spring",
            stiffness: 500, // Very stiff (Hard impact)
            damping: 30,    // High damping (Stops quickly)
            mass: 2         // Heavy object feel
        }
    }
};

// 3. Wrapper Variants (Overlay)
const overlayWrapperVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { duration: 0.3 }
    },
    exit: { 
        opacity: 0,
        transition: { duration: 0.3, delay: 0.1 } 
    }
};

// 4. Card Animation (Synced Fade + Slide)
const combinedVariants = {
    enter: (direction) => {
        if (direction === 0) {
            return { opacity: 0, x: 0, scale: 0.95, y: 0 }; 
        }
        return {
            x: direction > 0 ? 1000 : -1000,
            y: 0,
            opacity: 0, 
            scale: 1
        };
    },
    center: (direction) => {
        if (direction === 0) {
            return {
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                zIndex: 1,
                transition: { duration: 0.3, ease: "easeOut" }
            };
        }
        return {
            zIndex: 1,
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: "tween", duration: 0.4, ease: "easeInOut" },
                opacity: { duration: 0.4, ease: "easeInOut" }
            }
        };
    },
    exit: (direction) => {
        if (direction === 0) {
             return { 
                 y: 200, 
                 opacity: 0, 
                 scale: 0.95, 
                 transition: { duration: 0.3, ease: "easeIn" } 
             };
        }
        return {
            zIndex: 0,
            x: direction > 0 ? -1000 : 1000,
            opacity: 0,
            transition: {
                x: { type: "tween", duration: 0.4, ease: "easeInOut" },
                opacity: { duration: 0.4, ease: "easeInOut" }
            }
        };
    }
};

// 5. Nav Bar Animation (Overlay)
const navVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: { 
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: 0.1 } 
    },
    exit: { 
        y: 200, 
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" }
    }
};

// --- SYNCHRONIZED VARIANTS ---
const titleVariants = stoneDrop(0);      
const navPageVariants = stoneDrop(0);    
const filterVariants = stoneDrop(0);   

export default function Zines({zineData}) {
    const [selectedZine, setSelectedZine] = useState(null);
    const [direction, setDirection] = useState(0);

    const [selectedSubject, setSelectedSubject] = useState("All");
    const [sortOrder, setSortOrder] = useState("default"); 
    const [currentPage, setCurrentPage] = useState(1);
    
    // TOGGLE STATES
    const [sortOpen, setSortOpen] = useState(false);
    const [subjectOpen, setSubjectOpen] = useState(false);
    
    const itemsPerPage = 24;

    // --- 1. PREPARE DATA ---
    const uniqueSubjects = useMemo(() => {
        if (!zineData) return [];
        const subjectsSet = new Set();
        zineData.forEach(zine => {
            if (zine.Subject) subjectsSet.add(zine.Subject);
            if (zine['Subject 2']) subjectsSet.add(zine['Subject 2']);
        });
        const excludedSubjects = ['Environmentalism and Nature', 'Political - Police'];
        const filteredSubjects = Array.from(subjectsSet).filter(subject => !excludedSubjects.includes(subject));
        return ["All", ...filteredSubjects].sort(); 
    }, [zineData]);

    // --- 2. PROCESS DATA ---
    const processedZines = useMemo(() => {
        if (!zineData) return [];
        let result = [...zineData];

        if (selectedSubject !== "All") {
            result = result.filter(zine => 
                zine.Subject === selectedSubject || 
                zine['Subject 2'] === selectedSubject
            );
        }

        if (sortOrder !== 'default') {
            result.sort((a, b) => {
                const titleA = (a.Title || "").toLowerCase();
                const titleB = (b.Title || "").toLowerCase();
                if (sortOrder === 'asc') return titleA < titleB ? -1 : 1;
                if (sortOrder === 'desc') return titleA > titleB ? -1 : 1;
                return 0;
            });
        }
        return result;
    }, [zineData, selectedSubject, sortOrder]);

    const currentIndex = selectedZine 
        ? processedZines.findIndex(z => z.Identifier === selectedZine.Identifier) 
        : -1;
    
    const hasNext = currentIndex < processedZines.length - 1;
    const hasPrev = currentIndex > 0;

    // --- 4. HANDLERS ---
    
    const closeOverlay = () => {
        setDirection(0);
        setSelectedZine(null);
    };

    const handleNext = (e) => {
        if (e) e.stopPropagation();
        if (hasNext) {
            setDirection(1); 
            setSelectedZine(processedZines[currentIndex + 1]);
        }
    };

    const handlePrev = (e) => {
        if (e) e.stopPropagation();
        if (hasPrev) {
            setDirection(-1); 
            setSelectedZine(processedZines[currentIndex - 1]);
        }
    };

    const handleSortChange = (value) => { setSortOrder(value); setSortOpen(false); };
    const handleSubjectChange = (subject) => { setSelectedSubject(subject); setSubjectOpen(false); };
    
    const resetFilters = () => {
        setSelectedSubject("All");
        setSortOrder("default");
        setCurrentPage(1);
        setSortOpen(false);
        setSubjectOpen(false);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentZines = processedZines.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(processedZines.length / itemsPerPage);

    // --- 5. EFFECTS ---
    useEffect(() => { setCurrentPage(1); }, [selectedSubject, sortOrder]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedZine) return;
            if (e.key === 'Escape') closeOverlay();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedZine, currentIndex, processedZines]);

    return (
        <div className='zines-div'>
            <div className='zine-title-container'>
                <div className='title-container-sub'>
                    <motion.h2 className='zines-title' variants={titleVariants} initial="hidden" animate="visible">
                        Zine Library
                    </motion.h2>
                    <motion.p className="zine-page-num" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.8 } }}>
                        {currentPage}
                    </motion.p>
                </div>
            </div>

            <div className='about-nav zine-nav-container'> 
                <motion.div variants={navPageVariants} initial="hidden" animate="visible">
                    <Link to='/' className='about-nav-link'>HOME</Link>
                </motion.div>
                <motion.div variants={navPageVariants} initial="hidden" animate="visible">
                    <Link to='/about' className='about-nav-link'>ABOUT MORUS</Link>
                </motion.div>
                <motion.div variants={navPageVariants} initial="hidden" animate="visible">
                    <Link to='/donate' className='about-nav-link'>DONATE</Link>
                </motion.div>
            </div>
            
            

            {/* --- FILTER CONTAINER (Synced with Title) --- */}
            <motion.div 
                className='filter-container'
                variants={gridCollisionVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="filter-group custom-select-group">
                    <span className="filter-label">Filter by Subject:</span>
                    <div className="custom-dropdown-wrapper">
                        <button className="sort-trigger-btn" onClick={() => { setSubjectOpen(!subjectOpen); setSortOpen(false); }}>
                            {selectedSubject} <span>{subjectOpen ? '▴' : '▾'}</span>
                        </button>
                        {subjectOpen && (
                            <div className="custom-dropdown-menu subject-menu-scroll">
                                {uniqueSubjects.map((subject, index) => (
                                    <div key={index} className={`dropdown-item ${selectedSubject === subject ? 'selected' : ''}`} onClick={() => handleSubjectChange(subject)}>
                                        {subject}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="filter-group custom-select-group">
                    <span className="filter-label">Sort by:</span>
                    <div className="custom-dropdown-wrapper">
                        <button className="sort-trigger-btn" onClick={() => { setSortOpen(!sortOpen); setSubjectOpen(false); }}>
                            {sortOrder === 'default' ? 'Newest' : (sortOrder === 'asc' ? 'A-Z' : 'Z-A')} 
                            <span>{sortOpen ? '▴' : '▾'}</span>
                        </button>
                        {sortOpen && (
                            <div className="custom-dropdown-menu subject-menu-scroll">
                                <div className={`dropdown-item ${sortOrder === 'default' ? 'selected' : ''}`} onClick={() => handleSortChange('default')}>Newest</div>
                                <div className={`dropdown-item ${sortOrder === 'asc' ? 'selected' : ''}`} onClick={() => handleSortChange('asc')}>A - Z</div>
                                <div className={`dropdown-item ${sortOrder === 'desc' ? 'selected' : ''}`} onClick={() => handleSortChange('desc')}>Z - A</div>
                            </div>
                        )}
                    </div>
                </div>

                {(selectedSubject !== "All" || sortOrder !== "default") && (
                    <button onClick={resetFilters} className="reset-btn">RESET</button>
                )}
            </motion.div>

            <AnimatePresence>
                {selectedZine && (
                    <motion.div 
                        className='detail-overlay'
                        variants={overlayWrapperVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={closeOverlay}
                    >
                        <AnimatePresence mode='popLayout' custom={direction}>
                            <motion.div 
                                className="overlay-content"
                                key={selectedZine.Identifier} 
                                custom={direction}
                                variants={combinedVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className='zine-details-card'>
                                    <div className='zine-img-container'>
                                        <img 
                                            src={selectedZine.image} 
                                            alt={selectedZine.Title} 
                                            className="overlay-img" 
                                        />
                                    </div>
                                    <div className='zine-meta-container'>
                                        <button className='close-overlay' onClick={closeOverlay}>
                                            X
                                        </button>
                                        <div className='meta-card'>
                                            <h3 className="overlay-title">{selectedZine.Title}</h3>
                                            <p className="overlay-data"><strong>Author:</strong> {selectedZine.Creator || 'Unknown'}</p>
                                            <p className="overlay-data"><strong>Content:</strong><br/> {selectedZine["Content Description"] || 'Unknown'}</p>
                                            <p className="overlay-data"><strong>Identifier:</strong> {selectedZine.Identifier || 'Unknown'}</p>
                                            <p className="overlay-data"><strong>Year:</strong> {selectedZine["Date of Publication"] || 'Unknown'}</p>
                                            <p className="overlay-data"><strong>Subject:</strong> {selectedZine["Subject"] || 'Unknown'}</p>
                                            <p className="overlay-data"><strong>Language:</strong> {selectedZine["Language"] || 'Unknown'}</p>
                                            <p className="overlay-data"><strong>Coverage:</strong> {selectedZine["Coverage"] || 'Unknown'}</p>
                                            <p className="overlay-data"><strong>Contributors:</strong> {selectedZine["Contributor(s)"] || 'Unknown'}</p>
                                            <p className="overlay-data"><strong>Publisher:</strong> {selectedZine["Publisher(s)"] || 'Unknown'}</p>
                                            <p className="overlay-data"><strong>Place of Publication:</strong> {selectedZine["Place of Publication"] || 'Unknown'}</p>
                                            <p className="overlay-data"><strong>Physical Description:</strong> {selectedZine["Physical Description"] || 'Unknown'}</p>
                                            <p className="overlay-data"><strong>Freedoms and Restrictions:</strong> {selectedZine["Freedoms and Restrictions"] || 'Unknown'}</p>
                                            
                                            <button 
                                                className='read-btn'
                                                onClick={() => {
                                                    if (selectedZine.pdf_link) {
                                                        window.open(selectedZine.pdf_link, '_blank', 'noopener,noreferrer');
                                                    } else {
                                                        alert("No PDF link available.");
                                                    }
                                                }}
                                            >
                                                Read Zine
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        
                        <motion.div 
                            className="overlay-nav-bar bottom-nav"
                            variants={navVariants}
                        >
                            <button 
                                className="nav-arrow-btn" 
                                onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
                                disabled={!hasPrev}
                                style={{ opacity: hasPrev ? 1 : 0.3 }}
                            >
                               <span className='arrows'>&laquo;</span> Prev
                            </button>        
                            <span className="nav-counter">
                                {currentIndex + 1} / {processedZines.length}
                            </span>       
                            <button 
                                className="nav-arrow-btn" 
                                onClick={(e) => { e.stopPropagation(); handleNext(); }} 
                                disabled={!hasNext}
                                style={{ opacity: hasNext ? 1 : 0.3 }}
                            >
                                Next <span className='arrows'>&raquo;</span>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- ZINE GRID (Collision Impact) --- */}
            <motion.div 
                className='zine-container'
                variants={gridCollisionVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="zine-grid">
                    {currentZines.map((zine) => (
                        <div 
                            className="zine-card" 
                            key={zine.Identifier}
                            onClick={() => { setDirection(0); setSelectedZine(zine); }}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="zine-image-wrapper">
                                <img src={zine.image} alt={zine.Title} className="zine-img"/>
                            </div>
                            <h3 className="zine-card-title">{zine.Title}</h3>
                        </div>
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className="pagination-container">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="prev-next">&laquo; Prev</button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i + 1} onClick={() => paginate(i + 1)} className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}>{i + 1}</button>
                        ))}
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="prev-next">Next &raquo;</button>
                    </div>
                )}
            </motion.div>
        </div>
    )
}