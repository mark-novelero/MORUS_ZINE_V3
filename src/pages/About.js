import React from 'react';
import './About.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageOne from '../images/am-1.png';

// Create a Motion-enabled Link component for internal navigation
const MotionLink = motion(Link);

export default function About() {

  // 1. PHYSICS: Heavy Stone Drop (For Title & Nav)
  const stoneDrop = (delay) => ({
    hidden: { 
        y: -1600, 
        opacity: 1 
    },
    visible: { 
        y: [-1600, 0, -30, 0], 
        opacity: 1,
        transition: { 
            delay: delay, 
            duration: 0.8,
            times: [0, 0.6, 0.75, 1],
            ease: ["easeIn", "easeOut", "easeIn"] 
        }
    }
  });

  // 2. PHYSICS: Boulder Thud (For Paragraphs)
  // Logic: High Mass + High Stiffness = Heavy Impact
  const boulderDrop = (delay) => ({
    hidden: { 
        y: -150, // Increased height slightly to allow velocity to build up
        opacity: 1 
    },
    visible: { 
        y: 0, 
        opacity: 1,
        transition: { 
            delay: delay,
            type: "spring",
            mass: 2,        // Extremely heavy (default is 1)
            stiffness: 650, // Strong gravity/pull
            damping: 30,    // High friction (stops the bounce quickly)
            velocity: 12     // Adds a bit of initial downward force
        }
    }
  });

  return (
    <div className='about-div'>
        {/* TITLE */}
        <motion.h2 
            className='about-title'
            variants={stoneDrop(0)} 
            initial="hidden"
            animate="visible"
        >
            ABOUT MORUS
        </motion.h2>

        <div className='about-nav'> 
            {/* Note: Added staggered delays back to Nav so they don't all clump at 0s */}

            <MotionLink 
                to='/' 
                className='about-nav-link'
                variants={stoneDrop(0)}
                initial="hidden"
                animate="visible"
            >
                HOME
            </MotionLink>
            
            <MotionLink 
                to='/zines' 
                className='about-nav-link'
                variants={stoneDrop(0)}
                initial="hidden"
                animate="visible"
            >
                ZINE LIBRARY
            </MotionLink>
            
            <MotionLink 
                to='/donate'  
                className='about-nav-link'
                variants={stoneDrop(0)}
                initial="hidden"
                animate="visible"
            >
                DONATE
            </MotionLink>
        </div>

        <img src={ImageOne} alt="About Museum of Reclaimed Urban Space" className='top-image'/>
        
        {/* PARAGRAPH 1 
            Title hits ground at 0.6s. 
            We drop this slightly before (0.5s) so the impact feels connected.
        */}
        <motion.div 
            className='paragraph-container-1'
            variants={boulderDrop(0.5)} 
            initial="hidden"
            animate="visible"
        >
            <p className='para-one'>
                The Museum of Reclaimed Urban Space Zine Library was created to support the museum’s mission of preserving and
                promoting the history of grassroots activism in the Lower East Side of Manhattan. This library elevates and 
                makes accessible the oftentimes disenfranchised and marginalized voices represented through these typically 
                free publications. First organized in 2021 by the Archive Committee at MoRUS, the MoRUS Zine Library was made 
                up of donations from visitors and former museum volunteers. Moving forward the scope of our zine collection 
                policy will be focused on subjects and genres ranging from DIY, history, and art that deal with topics like 
                housing, environmentalism, and activism, especially those emanating from New York City. Despite these 
                collection restrictions, the library will continue to reflect the diverse communities of stakeholders concerned
                with each of these topics. 
            </p>
        </motion.div>

        {/* PARAGRAPH 2 */}
        <motion.div 
            className='paragraph-container-2'
            variants={boulderDrop(0.5)}
            initial="hidden"
            animate="visible"
        >
            <p className='para-two'>
                While our physical collection currently tops out at about 100 different zines (and will continue to grow) this 
              digital repository provides a selection of those zines. The MoRUS Zine Library is made up largely of donations. 
              If you see your work featured in the library and wish to be more clearly credited, removed from the library, or 
              the documentation of the zine changed in any way please don't hesitate to reach out to the archive coordinator. 
              Other zines can be made available by reaching out to the archive coordinator at archives@morusnyc.org or 
              info@morusnyc.org.
            </p>
        </motion.div>

        {/* PARAGRAPH 3 */}
        <motion.div 
            className='paragraph-container-3'
            variants={boulderDrop(0.5)}
            initial="hidden"
            animate="visible"
        >
            <p className='para-one'>
                The Museum of Reclaimed Urban Space Zine Library was created to support the museum’s mission of preserving and
                promoting the history of grassroots activism in the Lower East Side of Manhattan. This library elevates and 
                makes accessible the oftentimes disenfranchised and marginalized voices represented through these typically 
                free publications. First organized in 2021 by the Archive Committee at MoRUS, the MoRUS Zine Library was made 
                up of donations from visitors and former museum volunteers. Moving forward the scope of our zine collection 
                policy will be focused on subjects and genres ranging from DIY, history, and art that deal with topics like 
                housing, environmentalism, and activism, especially those emanating from New York City. Despite these 
                collection restrictions, the library will continue to reflect the diverse communities of stakeholders concerned
                with each of these topics. 
            </p>
        </motion.div>
    </div>
  )
}
