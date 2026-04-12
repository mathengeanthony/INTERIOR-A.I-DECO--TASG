/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import AIDecoPage from './components/AIDeco/AIDecoPage';
import { Button } from '@/components/ui/button';
import { Wand2, ChevronLeft, MapPin, Share2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [view, setView] = useState<'dossier' | 'deco'>('dossier');

  return (
    <div className="min-h-screen bg-AMARI-black text-AMARI-text selection:bg-AMARI-gold selection:text-black transition-colors duration-300">
      <AnimatePresence mode="wait">
        {view === 'dossier' ? (
          <motion.div 
            key="dossier"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col min-h-screen"
          >
            {/* Simple Dossier Simulation */}
            <div className="relative h-[10vh] md:h-[15vh] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670" 
                className="w-full h-full object-cover"
                alt="Penthouse"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-AMARI-black via-transparent to-transparent" />
              <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                <Button variant="ghost" size="icon" className="bg-black/40 backdrop-blur-md rounded-full text-white">
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="bg-black/40 backdrop-blur-md rounded-full text-white">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="bg-black/40 backdrop-blur-md rounded-full text-white">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="px-6 py-8 max-w-4xl mx-auto w-full flex-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-none mb-2 text-AMARI-text">The Vanguard Penthouse</h1>
                  <p className="flex items-center text-xs text-AMARI-text-muted font-mono uppercase tracking-widest">
                    <MapPin className="w-3 h-3 text-AMARI-gold mr-2" /> Westlands, Nairobi
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-AMARI-gold font-mono">$2,800,000</p>
                  <p className="text-[10px] text-AMARI-text-muted uppercase tracking-widest">Acquisition Price</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-4 hidden md:block">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-AMARI-gold">Property Dossier</h3>
                  <p className="text-sm text-AMARI-text-muted leading-relaxed">
                    Suspended 42 floors above the pulsing heart of the Silicon Savannah, The Vanguard Penthouse is a masterclass in vertical wealth.
                  </p>
                  <div className="flex gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-xl font-bold font-mono">4</p>
                      <p className="text-[9px] text-AMARI-text-muted uppercase">Beds</p>
                    </div>
                    <div className="text-center border-l border-AMARI-border pl-4">
                      <p className="text-xl font-bold font-mono">4.5</p>
                      <p className="text-[9px] text-AMARI-text-muted uppercase">Baths</p>
                    </div>
                    <div className="text-center border-l border-AMARI-border pl-4">
                      <p className="text-xl font-bold font-mono">6,200</p>
                      <p className="text-[9px] text-AMARI-text-muted uppercase">SqFt</p>
                    </div>
                  </div>
                </div>

                <div className="bg-AMARI-button-bg border border-AMARI-border rounded-2xl p-6 flex flex-col justify-center items-center text-center group hover:border-AMARI-gold transition-all">
                  <div className="w-16 h-16 rounded-full bg-AMARI-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Wand2 className="w-8 h-8 text-AMARI-gold" />
                  </div>
                  <h4 className="text-lg font-bold uppercase tracking-tight mb-2 text-AMARI-text">A.I. Interior Deco</h4>
                  <p className="text-xs text-AMARI-text-muted mb-6">Experiment with furnishings and decor styles in real-time using our AR engine.</p>
                  <Button 
                    className="w-full bg-AMARI-gold text-white dark:text-black hover:bg-AMARI-text hover:text-AMARI-panel h-12 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-colors"
                    onClick={() => setView('deco')}
                  >
                    Launch Simulator
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="deco"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="h-screen"
          >
            <AIDecoPage onBack={() => setView('dossier')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
