import React from 'react'
import './Donate.css';
import DonateImage from '../images/donation_img.png';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

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

const titleVariants = stoneDrop(0);
const navPageVariants = stoneDrop(0);

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


export default function Donate() {
  return (
    <div className='donate-div'>
        <img className='donate-bg-img' src={DonateImage} alt="Donate Background" />
        <motion.h2 className='zines-title' variants={titleVariants} initial="hidden" animate="visible">
            Zine Donations
        </motion.h2>
        <div className='about-nav zine-nav-container'> 
            <motion.div variants={navPageVariants} initial="hidden" animate="visible">
                <Link to='/' className='about-nav-link'>HOME</Link>
            </motion.div>
            <motion.div variants={navPageVariants} initial="hidden" animate="visible">
                <Link to='/about' className='about-nav-link'>ABOUT MORUS</Link>
            </motion.div>
            <motion.div variants={navPageVariants} initial="hidden" animate="visible">
                <Link to='/zines' className='about-nav-link'>ZINE LIBRARY</Link>
            </motion.div>
        </div>
        <motion.div 
            variants={boulderDrop(0.5)}
            initial="hidden"
            animate="visible" 
            className='donate-container'>
            <div className='donate-info'>
                <p className='donate-intro'>
                    The Museum of Reclaimed Urban Space (MoRUS) is seeking zine submissions for our growing Zine Library! <br/><br/>
                    We invite artists, activists, writers, and community members to contribute their work to our expanding digital zine library. MoRUS is dedicated to preserving and celebrating grassroots urban activism, DIY culture, and the creative spirit of the Lower East Side—and zines are an essential part of that history.
                    We welcome zines of all topics, especially those connected to activism, community organizing, art, mutual aid, urban space, and social justice.
                </p>
                <br/>
                <h2 className='donate-subheader'>How to Submit</h2>
                <p className='donate-intro second-para'>
                    Please send <span>one full copy of your zine</span> and a completed <a className='consent-form' href='/consent-form'>Consent to Display Form</a>. 
                </p>
                <p className='donate-intro second-para'>
                    <span className='mail-to'>Mail your submissions to:</span>  
                    <br className='break'/>
                    Museum of Reclaimed Urban Space (MoRUS)
                    <br />
                    Attention Zine Archives
                    <br />
                    155 Avenue C
                    <br />
                    New York, NY 10009
                </p>
                <p className='donate-intro third-para'>
                    Upon receiving your zine, we will carefully scan it and add it to our growing digital zine library, making it accessible to researchers, artists, and the public. Thank you for contributing to the living archive of community voices!
                </p>
            </div>
        </motion.div>
    </div>
  )
}
