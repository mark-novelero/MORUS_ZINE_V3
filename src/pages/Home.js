import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import About from '../images/about-morus.png';
import Zines from '../images/morus-library.png';
import Donate from '../images/donate-zine.png';
import Hand from '../images/Pointer.png';
import AC from '../images/ac.png';
import SocialAct from '../images/east_village.png';

export default function Home({ introPlayed, setIntroPlayed }) {
  const navigate = useNavigate();
  const [exiting, setExiting] = useState(false);
  const exitingRef = useRef(false);

  // 1. FREEZE STATE
  const [isFirstLoad] = useState(!introPlayed);

  // 2. UPDATE PARENT
  useEffect(() => {
    if (isFirstLoad) {
      setIntroPlayed(true);
    }
  }, [isFirstLoad, setIntroPlayed]);

  // REFS
  const aboutRef = useRef(null);
  const zinesRef = useRef(null);
  const donateRef = useRef(null);
  const handRef = useRef(null); 
  const acRef = useRef(null);

  const [handStopX, setHandStopX] = useState(-550); 

  // CONTROLS
  const aboutControls = useAnimation();
  const zinesControls = useAnimation();
  const donateControls = useAnimation();
  const acControls = useAnimation();

  // --- ENTRANCE ANIMATIONS (BUTTONS ONLY) ---
  useEffect(() => {
    if (isFirstLoad) {
      // SCENARIO A: Run Intro
      aboutControls.start("visible");
      zinesControls.start("visible");
      donateControls.start("visible");

      const timer = setTimeout(() => {
        if (!exitingRef.current) {
          aboutControls.start("straightened");
        }
      }, 3100);
      return () => clearTimeout(timer);
    } else {
      // SCENARIO B: Instant Snap
      aboutControls.set("straightened");
      zinesControls.set("visible");
      donateControls.set("visible");
    }
  }, [isFirstLoad, aboutControls, zinesControls, donateControls]); 

  // --- HAND POSITION ---
  useEffect(() => {
    const calculatePosition = () => {
      if (aboutRef.current && handRef.current) {
        const aboutRect = aboutRef.current.getBoundingClientRect();
        const handRect = handRef.current.getBoundingClientRect();
        const targetX = aboutRect.left - handRect.width - 10; 
        setHandStopX(targetX);
      }
    };
    if (isFirstLoad) {
      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      return () => window.removeEventListener('resize', calculatePosition);
    }
  }, [isFirstLoad]);

  // --- EXIT LOGIC ---
  const handleExit = async (route, clickedControls, ref, e) => {
    e.preventDefault(); 
    if (exiting) return; 
    setExiting(true); 
    exitingRef.current = true;

    if (ref.current && acRef.current) {
      const targetRect = ref.current.getBoundingClientRect();
      const acRect = acRef.current.getBoundingClientRect();
      const centerLeft = targetRect.left + (targetRect.width / 2) - (acRect.width / 2);
      
      let verticalOffset = 10; 
      if (window.innerWidth >= 1900) verticalOffset = 60; 
      else if (window.innerWidth >= 1400) verticalOffset = 35;

      const dropY = targetRect.top - verticalOffset; 
      acRef.current.style.left = `${centerLeft}px`;
      
      await acControls.start({
        y: [-1100, dropY], 
        opacity: 1,
        transition: { duration: 0.06, ease: "linear" }
      });

      const squishAmount = 160;
      const extraFollowDrop = window.innerWidth >= 1900 ? 80 : 60;

      await Promise.all([
        acControls.start({
          y: dropY + squishAmount + extraFollowDrop,
          transition: { duration: 0.1, ease: "easeOut" }
        }),
        clickedControls.start({
          y: squishAmount, 
          scaleY: 0.60, 
          scaleX: 1.3, 
          rotateZ: 0, 
          transition: { duration: 0.08, ease: "easeOut" }
        })
      ]);

      setTimeout(() => {
        navigate(route); 
      }, 500); 
    }
  };

  // --- UPDATED VARIANTS ---
  // Added "finished" state to all text variants for the static return visit.

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.0 } },
    finished: { transition: { staggerChildren: 0.0 } } // Immediate propagation
  };

  const letterVariants = {
    hidden: { 
      y: '-400%', 
      opacity: 1, 
      scaleY: 1.2 // Start elongated (simulating high velocity blur)
    },
    visible: {
      y: ['-400%', '0%', '-3%', '0%'], // Fall -> Hit -> Tiny Recoil -> Settle
      scaleY: [1.2, 0.85, 0.98, 0.96], // Stretch -> Sharp Squash -> Settle -> Final
      transition: { 
        duration: 0.5, 
        // 60% of the time is spent falling, the rest is the immediate impact
        times: [0, 0.6, 0.85, 1], 
        ease: [
            [0.8, 0, 1, 1], // Custom "Heavy" Gravity (starts slow, ends VERY fast)
            "easeOut",      // Quick, short recoil
            "easeOut"       // Final settle
        ] 
      },
    },
    // Static final state
    finished: { y: '0%', scaleY: 0.96, opacity: 1 }
  };

  const brokenSVariants = {
    hidden: { y: '-400%', opacity: 1, scaleY: 1.12, rotateZ: 0 },
    visible: {
      y: ['-400%', '14%', '0%'],
      scaleY: [1.12, 0.82, 0.96],
      rotateZ: [0, 0, 10], 
      transition: { duration: 1, times: [0, 0.82, 1], ease: [[0.08, 0, 0.25, 0], [0.15, 0.9, 0.2, 1]], rotateZ: { delay: 0.55, duration: 0.25, ease: 'easeOut' } },
    },
    // Static final state
    finished: { y: '0%', scaleY: 0.96, rotateZ: 10, opacity: 1 }
  };

  const brokenMVariants = {
    hidden: { 
      y: '-400%', 
      opacity: 1, 
      scaleY: 1.15, // Slight stretch for velocity blur
      rotateZ: 0 
    },
    visible: {
      // Fall -> Hard Stop -> Micro Recoil -> Settle
      y: ['-400%', '0%', '-4%', '0%'],
      
      // Stretch -> Stiff Squash -> Settle -> Final
      scaleY: [1.15, 0.90, 0.98, 0.96],
      
      rotateZ: [0, 0, 0, 0], 
      
      transition: { 
        duration: 0.6, // Shorter duration for a heavier, faster fall
        // NOTE: If you want this to fall WITH the others, remove 'delay: 0.2'
        delay: 0.2, 
        times: [0, 0.6, 0.8, 1], 
        ease: [
            [0.85, 0, 1, 1], // Heavy Gravity (accelerates until the very end)
            "easeOut",       // Sharp impact
            "linear"         // Dead stop
        ] 
      },
    },
    finished: { y: '0%', scaleY: 0.96, rotateZ: 0, opacity: 1 }
  };

  const brokenRVariants = {
    hidden: { y: '-400%', opacity: 1, scaleY: 1.12, rotateZ: 0 },
    visible: {
      y: ['-400%', '14%', '0%'],
      scaleY: [1.12, 0.82, 0.96],
      rotateZ: [0, 0, 0], 
      transition: { duration: 1, delay: 0.4, times: [0, 0.82, 1], ease: [[0.08, 0, 0.25, 0], [0.15, 0.9, 0.2, 1]] },
    },
    finished: { y: '0%', scaleY: 0.96, rotateZ: 0, opacity: 1 }
  };

  const subtitleVariants = {
    hidden: { y: '-800%', opacity: 1, scaleY: 1.12 },
    visible: {
      y: ['-800%', '14%', '0%'],
      scaleY: [1.12, 0.82, 0.96],
      transition: { duration: 0.25, times: [0, 0.82, 1], ease: [[0.08, 0, 0.25, 0], [0.15, 0.9, 0.2, 1]], delay: .25 },
    },
    finished: { y: '0%', scaleY: 0.96, opacity: 1 }
  };

  // Image variants kept as is, controlled via useAnimation hook
  const imageDropVariants = {
    hidden: { y: '-300%', scaleY: 1.12, opacity: 1 },
    visible: (delay = 0) => ({
      y: ['-300%', '12%', '0%'],
      scaleY: [1.12, 0.82, 0.96],
      transition: { duration: 0.35, times: [0, 0.82, 1], delay, ease: [[0.08, 0, 0.25, 0], [0.15, 0.9, 0.2, 1]] },
    }),
  };

  const rightImageDropVariants = {
    hidden: { y: '-250%', scaleY: 1.12, rotateZ: 0, opacity: 1 },
    visible: {
      y: ['-250%', '12%', '0%'],
      scaleY: [1.12, 0.82, 0.96],
      rotateZ: [0, 0, -8, -8, -8], 
      transition: { duration: 0.45, times: [0, 0.82, 1], ease: [[0.08, 0, 0.25, 0], [0.15, 0.9, 0.2, 1]], rotateZ: { delay: 0.42, duration: 0.22, ease: 'easeOut' }, delay: .7 },
    },
    straightened: {
      rotateZ: 0, y: '0%', scaleY: 0.96,
      transition: { duration: 0.4, ease: [0.17, 0.67, 0.83, 0.67] }
    }
  };

  return (
    <div className="home-page">
      <img src={SocialAct} alt="Social Action Zine" className="social-act-bg" />
      
      <motion.div 
        className="title-container" 
        variants={containerVariants} 
        initial={isFirstLoad ? "hidden" : "finished"} 
        animate={isFirstLoad ? "visible" : "finished"}
      >
        <div className="letter-container"><motion.h1 className="title-letter" variants={letterVariants}>M</motion.h1></div>
        <div className="letter-container"><motion.h1 className="title-letter" variants={letterVariants}>O</motion.h1></div>
        <div className="letter-container"><motion.h1 className="title-letter" variants={letterVariants}>R</motion.h1></div>
        <div className="letter-container"><motion.h1 className="title-letter" variants={letterVariants}>U</motion.h1></div>
        <div className="letter-container broken-s"><motion.h1 className="title-letter" variants={letterVariants}>S</motion.h1></div>
      </motion.div>

      <div className="subtitle-container">
        <motion.h2 
          className="subtitle-text" 
          variants={subtitleVariants} 
          initial={isFirstLoad ? "hidden" : "finished"} 
          animate={isFirstLoad ? "visible" : "finished"}
        >
          Zine Library  
        </motion.h2>
      </div>

      <div className="btn-wrapper">
        <div className="three-column">
          
          {/* BUTTONS (Controlled by useEffect via aboutControls, etc) */}
          <motion.a
            ref={aboutRef} 
            href="#"
            className="column"
            variants={rightImageDropVariants}
            initial={isFirstLoad ? "hidden" : "straightened"} 
            animate={aboutControls} 
            custom={.6}
            onClick={(e) => handleExit('/about', aboutControls, aboutRef, e)}
          >
            <img src={About} alt="About Morus" className="zine" />
            <span className="enter-btn">About MORUS</span>
          </motion.a>

          <motion.a
            ref={zinesRef}
            href="#"
            className="column"
            variants={imageDropVariants}
            initial={isFirstLoad ? "hidden" : "visible"}
            animate={zinesControls} 
            custom={.55}
            onClick={(e) => handleExit('/zines', zinesControls, zinesRef, e)}
          >
            <img src={Zines} alt="Zine Library" className="zine" />
            <span className="enter-btn">Zine Library</span>
          </motion.a>

          <motion.a
            ref={donateRef}
            href="#"
            className="column"
            variants={imageDropVariants}
            initial={isFirstLoad ? "hidden" : "visible"}
            animate={donateControls} 
            onClick={(e) => handleExit('/donate', donateControls, donateRef, e)}
          >
            <img src={Donate} alt="Donations" className="zine" />
            <span className="enter-btn">Zine Donations</span>
          </motion.a>
        </div>
      </div>
      
      {!exiting && isFirstLoad && (
        <motion.img
            ref={handRef} 
            className="hand"
            src={Hand}
            alt="Hand Arm"
            initial={{ x: -550 }} 
            animate={{
                x: [-550, handStopX, handStopX, handStopX + 8, handStopX, -550],
            }}
            transition={{
                delay: 2.2,
                duration: 1.302,
                times: [0, 0.45, 0.55, 0.65, 1], 
                ease: 'easeInOut',
            }}
            style={{ pointerEvents: 'none' }}
        />
      )}

      <motion.img 
        ref={acRef}
        src={AC} 
        alt="Archive Committee" 
        className="ac" 
        animate={acControls}
        initial={{ y: -1200, opacity: 1 }} 
        style={{ 
            zIndex: 9999,
            position: 'absolute',
            top: 0 
        }}
      />
    </div>
  );
}

