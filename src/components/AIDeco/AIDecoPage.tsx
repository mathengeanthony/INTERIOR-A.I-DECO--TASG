import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, 
  Image as ImageIcon, 
  Layout, 
  Plus, 
  Palette, 
  ChevronLeft, 
  Download, 
  Share2, 
  Undo,
  Loader2,
  Check,
  Camera,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { generateDecoPreview } from '@/src/services/geminiService';
import { cn } from '@/lib/utils';

// Sample property images (empty rooms)
const PROPERTY_IMAGES = [
  { id: 'living-1', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000', name: 'Living Room A' },
  { id: 'living-2', url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1000', name: 'Living Room B' },
  { id: 'bedroom-1', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000', name: 'Master Bedroom' },
  { id: 'kitchen-1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000', name: 'Kitchen' },
];

const STYLE_PRESETS = [
  { id: 'minimalist', name: 'Tokyo Minimalist', description: 'Clean lines, neutral colors, and open spaces.', icon: '🏯' },
  { id: 'swahili', name: 'Swahili Modern', description: 'Traditional East African motifs with contemporary luxury.', icon: '🌴' },
  { id: 'industrial', name: 'Industrial Loft', description: 'Raw materials, exposed brick, and metallic accents.', icon: '🏗️' },
  { id: 'scandinavian', name: 'Scandinavian', description: 'Light woods, cozy textiles, and functional design.', icon: '❄️' },
  { id: 'bohemian', name: 'Bohemian Rhapsody', description: 'Eclectic patterns, vibrant colors, and natural elements.', icon: '🎨' },
];

const FURNITURE_ITEMS = [
  { id: 'pool-table', name: 'Pool Table', category: 'Entertainment', icon: '🎱' },
  { id: 'swimming-pool', name: 'Swimming Pool', category: 'Outdoor', icon: '🏊' },
  { id: 'sofa-set', name: 'L-Shaped Sofa', category: 'Living', icon: '🛋️' },
  { id: 'dining-table', name: 'Marble Dining Table', category: 'Dining', icon: '🍽️' },
  { id: 'bookshelf', name: 'Floor-to-Ceiling Bookshelf', category: 'Storage', icon: '📚' },
  { id: 'piano', name: 'Grand Piano', category: 'Music', icon: '🎹' },
];

export default function AIDecoPage({ onBack }: { onBack: () => void }) {
  const [selectedImage, setSelectedImage] = useState(PROPERTY_IMAGES[0]);
  const [currentPreview, setCurrentPreview] = useState(PROPERTY_IMAGES[0].url);
  const [history, setHistory] = useState<string[]>([PROPERTY_IMAGES[0].url]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('styles');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [compareValue, setCompareValue] = useState(50);
  const [showCompare, setShowCompare] = useState(false);

  const handleGenerate = async (promptOverride?: string, styleOverride?: string) => {
    setIsGenerating(true);
    setShowCompare(false);
    try {
      const result = await generateDecoPreview({
        image: selectedImage.url,
        prompt: promptOverride || customPrompt || "Enhance this room with high-end furniture",
        style: styleOverride || activeStyle || undefined,
      });
      setCurrentPreview(result);
      setHistory(prev => [...prev, result]);
      setShowCompare(true);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentPreview(newHistory[newHistory.length - 1]);
    }
  };

  const handleStyleSelect = (styleId: string) => {
    setActiveStyle(styleId);
    const style = STYLE_PRESETS.find(s => s.id === styleId);
    handleGenerate(`Apply a ${style?.name} aesthetic to this room.`, style?.name);
  };

  const handleAddItem = (itemName: string) => {
    handleGenerate(`Add a ${itemName} to this room in a way that fits the current style.`);
  };

  const handleMaterialSelect = (type: 'wall' | 'floor', material: string) => {
    handleGenerate(`Change the ${type} material to ${material}.`);
  };

  return (
    <div className="flex flex-col h-screen bg-AMARI-black text-white overflow-hidden font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-16 border-b border-white/10 bg-AMARI-panel/80 backdrop-blur-md z-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onBack}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest leading-none">The Vanguard Penthouse</h1>
            <p className="text-[10px] font-mono text-AMARI-gold uppercase tracking-widest mt-1">A.I. Interior Simulator</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("text-gray-400 hover:text-white", showCompare && "text-AMARI-gold")}
            onClick={() => setShowCompare(!showCompare)}
            disabled={history.length <= 1}
          >
            <Maximize2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={handleUndo} disabled={history.length <= 1}>
            <Undo className="w-5 h-5" />
          </Button>
          <Button className="bg-AMARI-gold text-black hover:bg-white transition-colors font-bold text-[10px] uppercase tracking-widest px-4 h-9 rounded-full">
            Save Design
          </Button>
        </div>
      </header>

      <div className={cn(
        "flex-1 flex flex-col md:flex-row overflow-hidden",
        isFullscreen && "flex-col"
      )}>
        {/* Image Section */}
        <div className={cn(
          "relative flex items-center justify-center bg-black transition-all duration-500 overflow-hidden",
          isFullscreen ? "h-full w-full" : "h-1/2 md:h-full md:w-1/2 p-4 md:p-8"
        )}>
          <Card className={cn(
            "relative w-full h-full overflow-hidden border-none bg-black transition-all duration-500",
            !isFullscreen && "rounded-[2rem] shadow-2xl"
          )}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPreview}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {showCompare ? (
                  <div className="relative w-full h-full overflow-hidden cursor-ew-resize select-none">
                    <img src={selectedImage.url} className="absolute inset-0 w-full h-full object-cover" alt="Original" />
                    <div 
                      className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-AMARI-gold z-10"
                      style={{ clipPath: `inset(0 ${100 - compareValue}% 0 0)` }}
                    >
                      <img src={currentPreview} className="absolute inset-0 w-full h-full object-cover" alt="Transformed" />
                    </div>
                    <div className="absolute top-0 bottom-0 z-20 pointer-events-none" style={{ left: `${compareValue}%` }}>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-AMARI-gold text-black flex items-center justify-center shadow-2xl pointer-events-auto">
                        <Layout className="w-5 h-5 rotate-90" />
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={compareValue} 
                      onChange={(e) => setCompareValue(parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-ew-resize"
                    />
                    <div className="absolute top-6 left-6 z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[8px] font-bold uppercase tracking-widest">
                      Transformed
                    </div>
                    <div className="absolute top-6 right-6 z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[8px] font-bold uppercase tracking-widest">
                      Original
                    </div>
                  </div>
                ) : (
                  <img 
                    src={currentPreview} 
                    alt="Room Preview" 
                    className="w-full h-full object-cover"
                  />
                )}
                
                {!isGenerating && !showCompare && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/20 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-AMARI-gold rounded-full animate-ping" />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Fullscreen Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute bottom-6 right-6 z-40 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-AMARI-gold hover:text-black transition-all"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Camera className="w-5 h-5" />
            </Button>

            {/* Generating Loader */}
            {isGenerating && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-40">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-AMARI-gold animate-spin" />
                  <div className="absolute inset-0 blur-xl bg-AMARI-gold/20 animate-pulse" />
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-AMARI-gold animate-pulse text-center px-6">
                  Analyzing architectural DNA...
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Control Section */}
        {!isFullscreen && (
          <div className="flex-1 flex flex-col bg-AMARI-panel/50 backdrop-blur-xl border-l border-white/10 overflow-hidden">
            <div className="p-6 flex flex-col h-full">
              {/* Selector Rows */}
              <div className="space-y-3 mb-8">
                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant={activeTab === 'rooms' ? 'default' : 'outline'}
                    className={cn(
                      "h-12 rounded-xl border-white/10 text-[10px] font-bold uppercase tracking-widest",
                      activeTab === 'rooms' ? "bg-AMARI-gold text-black hover:bg-white" : "text-gray-400 hover:text-white"
                    )}
                    onClick={() => setActiveTab('rooms')}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" /> Rooms Selector
                  </Button>
                  <Button 
                    variant={activeTab === 'custom' ? 'default' : 'outline'}
                    className={cn(
                      "h-12 rounded-xl border-white/10 text-[10px] font-bold uppercase tracking-widest",
                      activeTab === 'custom' ? "bg-AMARI-gold text-black hover:bg-white" : "text-gray-400 hover:text-white"
                    )}
                    onClick={() => setActiveTab('custom')}
                  >
                    <Wand2 className="w-4 h-4 mr-2" /> Text Input (A.I.)
                  </Button>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    variant={activeTab === 'styles' ? 'default' : 'outline'}
                    className={cn(
                      "h-12 rounded-xl border-white/10 text-[9px] font-bold uppercase tracking-widest",
                      activeTab === 'styles' ? "bg-AMARI-gold text-black hover:bg-white" : "text-gray-400 hover:text-white"
                    )}
                    onClick={() => setActiveTab('styles')}
                  >
                    Styles
                  </Button>
                  <Button 
                    variant={activeTab === 'items' ? 'default' : 'outline'}
                    className={cn(
                      "h-12 rounded-xl border-white/10 text-[9px] font-bold uppercase tracking-widest",
                      activeTab === 'items' ? "bg-AMARI-gold text-black hover:bg-white" : "text-gray-400 hover:text-white"
                    )}
                    onClick={() => setActiveTab('items')}
                  >
                    Add
                  </Button>
                  <Button 
                    variant={activeTab === 'materials' ? 'default' : 'outline'}
                    className={cn(
                      "h-12 rounded-xl border-white/10 text-[9px] font-bold uppercase tracking-widest",
                      activeTab === 'materials' ? "bg-AMARI-gold text-black hover:bg-white" : "text-gray-400 hover:text-white"
                    )}
                    onClick={() => setActiveTab('materials')}
                  >
                    Materials
                  </Button>
                </div>
              </div>

              {/* Content Area */}
              <ScrollArea className="flex-1 -mx-2 px-2">
                <div className="pb-6">
                  {activeTab === 'rooms' && (
                    <div className="grid grid-cols-2 gap-3">
                      {PROPERTY_IMAGES.map((img) => (
                        <div 
                          key={img.id}
                          className={cn(
                            "aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative group",
                            selectedImage.id === img.id ? "border-AMARI-gold" : "border-transparent opacity-60 hover:opacity-100"
                          )}
                          onClick={() => {
                            setSelectedImage(img);
                            setCurrentPreview(img.url);
                            setHistory([img.url]);
                            setActiveStyle(null);
                            setShowCompare(false);
                          }}
                        >
                          <img src={img.url} className="w-full h-full object-cover" alt={img.name} />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                            <span className="text-[10px] font-bold uppercase text-white truncate">{img.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'styles' && (
                    <div className="grid grid-cols-1 gap-3">
                      {STYLE_PRESETS.map((style) => (
                        <Card 
                          key={style.id}
                          className={cn(
                            "p-4 bg-white/5 border-white/10 hover:border-AMARI-gold/50 transition-all cursor-pointer relative overflow-hidden group",
                            activeStyle === style.id && "border-AMARI-gold bg-AMARI-gold/5"
                          )}
                          onClick={() => handleStyleSelect(style.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">{style.icon}</div>
                            <div>
                              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-1">{style.name}</h3>
                              <p className="text-[10px] text-gray-400 leading-tight">{style.description}</p>
                            </div>
                          </div>
                          {activeStyle === style.id && (
                            <div className="absolute top-2 right-2">
                              <Check className="w-4 h-4 text-AMARI-gold" />
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}

                  {activeTab === 'items' && (
                    <div className="grid grid-cols-1 gap-3">
                      {FURNITURE_ITEMS.map((item) => (
                        <Button 
                          key={item.id}
                          variant="outline"
                          className="h-16 bg-white/5 border-white/10 hover:border-AMARI-gold hover:bg-AMARI-gold/10 justify-start px-6 rounded-xl"
                          onClick={() => handleAddItem(item.name)}
                        >
                          <span className="text-2xl mr-4">{item.icon}</span>
                          <div className="text-left">
                            <p className="text-xs font-bold uppercase tracking-widest text-white">{item.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase">{item.category}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}

                  {activeTab === 'materials' && (
                    <div className="space-y-8">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-AMARI-gold mb-4">Wall Finishes</p>
                        <div className="grid grid-cols-2 gap-3">
                          {['Emerald Green', 'Venetian Plaster', 'Exposed Brick', 'Oak Paneling', 'Silk Wallpaper'].map((m) => (
                            <Button 
                              key={m}
                              variant="outline" 
                              className="h-12 bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-widest rounded-xl"
                              onClick={() => handleMaterialSelect('wall', m)}
                            >
                              {m}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-AMARI-gold mb-4">Flooring</p>
                        <div className="grid grid-cols-2 gap-3">
                          {['White Marble', 'Dark Walnut', 'Polished Concrete', 'Herringbone Oak', 'Persian Rug'].map((m) => (
                            <Button 
                              key={m}
                              variant="outline" 
                              className="h-12 bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-widest rounded-xl"
                              onClick={() => handleMaterialSelect('floor', m)}
                            >
                              {m}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'custom' && (
                    <div className="space-y-6">
                      <div className="relative">
                        <textarea 
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="Describe your vision... (e.g., 'Add a modern fireplace and change walls to emerald green')"
                          className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white placeholder-gray-500 focus:border-AMARI-gold outline-none resize-none transition-all"
                        />
                        <div className="absolute bottom-4 right-4">
                          <Wand2 className="w-5 h-5 text-AMARI-gold animate-pulse" />
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-AMARI-gold text-black hover:bg-white h-14 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm shadow-lg"
                        onClick={() => handleGenerate()}
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'Processing...' : 'Apply Transformation'}
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar (Optional, for larger screens) */}
      <div className="hidden lg:block fixed right-8 top-24 w-80 z-40">
        <Card className="bg-AMARI-panel/80 backdrop-blur-2xl border-white/10 p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-AMARI-gold/10 flex items-center justify-center">
              <Camera className="w-5 h-5 text-AMARI-gold" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Live View</h3>
              <p className="text-[9px] text-gray-500 font-mono">AR_MODE: SIMULATED</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                <span>Lighting Intensity</span>
                <span className="text-AMARI-gold">85%</span>
              </div>
              <Slider defaultValue={[85]} max={100} step={1} />
            </div>
            
            <div>
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                <span>Material Quality</span>
                <span className="text-AMARI-gold">Ultra</span>
              </div>
              <Slider defaultValue={[100]} max={100} step={1} />
            </div>

            <div className="pt-4 border-t border-white/10">
              <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 h-10 text-[10px] font-bold uppercase tracking-widest">
                <Download className="w-4 h-4 mr-2" /> Export 4K Render
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
