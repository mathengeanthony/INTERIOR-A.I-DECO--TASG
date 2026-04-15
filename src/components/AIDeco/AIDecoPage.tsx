import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Maximize2,
  Moon,
  Sun,
  Layers,
  Upload,
  Paperclip,
  Send,
  ChevronDown,
  ChevronUp,
  X,
  Twitter,
  Facebook,
  Linkedin,
  Link,
  MessageCircle,
  Apple,
  Phone,
  User,
  Instagram
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
  { id: 'midcentury', name: 'Mid-Century Modern', description: 'Retro-futuristic, organic shapes, and teak wood.', icon: '🕰️' },
  { id: 'artdeco', name: 'Art Deco', description: 'Geometric patterns, bold colors, and glamorous gold.', icon: '✨' },
  { id: 'coastal', name: 'Coastal Breeze', description: 'Light, airy, nautical elements and soft blues.', icon: '🌊' },
  { id: 'farmhouse', name: 'Modern Farmhouse', description: 'Rustic charm meets contemporary clean lines.', icon: '🏡' },
  { id: 'wabisabi', name: 'Wabi-Sabi', description: 'Embracing imperfection, natural textures, and earthy tones.', icon: '🍂' },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon lights, high-tech elements, and dark aesthetics.', icon: '🌃' },
  { id: 'neoclassical', name: 'Neoclassical', description: 'Elegant, symmetrical, classical architecture elements.', icon: '🏛️' },
  { id: 'japandi', name: 'Japandi', description: 'Japanese minimalism meets Scandinavian functionality.', icon: '🎋' },
  { id: 'frenchcountry', name: 'French Country', description: 'Rustic elegance, distressed wood, and soft patterns.', icon: '🥖' },
  { id: 'mediterranean', name: 'Mediterranean', description: 'Warm terracotta, stucco walls, and wrought iron.', icon: '🏺' },
  { id: 'maximalist', name: 'Maximalist', description: 'More is more. Bold colors, mixed patterns, and rich textures.', icon: '🎭' },
  { id: 'brutalist', name: 'Brutalist', description: 'Raw concrete, bold geometry, and minimalist approach.', icon: '🏢' },
  { id: 'tropical', name: 'Tropical Paradise', description: 'Lush greenery, bamboo, and vibrant exotic colors.', icon: '🌺' },
  { id: 'vintage', name: 'Vintage Retro', description: 'Nostalgic elements, pastel colors, and classic furniture.', icon: '📻' },
  { id: 'futuristic', name: 'Ultra Futuristic', description: 'Sleek curves, smart tech, and stark white/silver palettes.', icon: '🚀' },
];

const FURNITURE_ITEMS = [
  { id: 'pool-table', name: 'Pool Table', category: 'Entertainment', icon: '🎱' },
  { id: 'swimming-pool', name: 'Swimming Pool', category: 'Outdoor', icon: '🏊' },
  { id: 'sofa-set', name: 'L-Shaped Sofa', category: 'Living', icon: '🛋️' },
  { id: 'dining-table', name: 'Marble Dining Table', category: 'Dining', icon: '🍽️' },
  { id: 'bookshelf', name: 'Floor-to-Ceiling Bookshelf', category: 'Storage', icon: '📚' },
  { id: 'piano', name: 'Grand Piano', category: 'Music', icon: '🎹' },
  { id: 'chandelier', name: 'Crystal Chandelier', category: 'Lighting', icon: '✨' },
  { id: 'fireplace', name: 'Modern Fireplace', category: 'Heating', icon: '🔥' },
  { id: 'indoor-plants', name: 'Indoor Palm Tree', category: 'Decor', icon: '🌴' },
  { id: 'rug', name: 'Persian Rug', category: 'Decor', icon: '🧶' },
  { id: 'tv', name: '85" OLED TV', category: 'Entertainment', icon: '📺' },
  { id: 'bar', name: 'Home Bar Setup', category: 'Entertainment', icon: '🍷' },
  { id: 'bed', name: 'King Size Bed', category: 'Bedroom', icon: '🛏️' },
  { id: 'wardrobe', name: 'Walk-in Wardrobe', category: 'Storage', icon: '🚪' },
  { id: 'desk', name: 'Executive Desk', category: 'Office', icon: '💻' },
  { id: 'office-chair', name: 'Ergonomic Chair', category: 'Office', icon: '💺' },
  { id: 'mirror', name: 'Oversized Floor Mirror', category: 'Decor', icon: '🪞' },
  { id: 'art', name: 'Abstract Canvas Art', category: 'Art', icon: '🖼️' },
  { id: 'sculpture', name: 'Modern Sculpture', category: 'Art', icon: '🗽' },
  { id: 'coffee-table', name: 'Glass Coffee Table', category: 'Living', icon: '☕' },
  { id: 'armchair', name: 'Velvet Armchair', category: 'Living', icon: '🪑' },
  { id: 'pendant-light', name: 'Brass Pendant Lights', category: 'Lighting', icon: '💡' },
  { id: 'floor-lamp', name: 'Arc Floor Lamp', category: 'Lighting', icon: '🏮' },
  { id: 'curtains', name: 'Silk Drapes', category: 'Decor', icon: '🪟' },
  { id: 'wine-cellar', name: 'Glass Wine Cellar', category: 'Storage', icon: '🍾' },
  { id: 'aquarium', name: 'Built-in Aquarium', category: 'Decor', icon: '🐠' },
  { id: 'jacuzzi', name: 'Indoor Jacuzzi', category: 'Bathroom', icon: '🛁' },
  { id: 'sauna', name: 'Glass Sauna', category: 'Bathroom', icon: '🧖' },
  { id: 'gym', name: 'Treadmill & Weights', category: 'Fitness', icon: '🏋️' },
  { id: 'billiards', name: 'Billiards Table', category: 'Entertainment', icon: '🎱' },
  { id: 'arcade', name: 'Vintage Arcade Cabinet', category: 'Entertainment', icon: '🕹️' },
  { id: 'cinema', name: 'Home Theater Seating', category: 'Entertainment', icon: '🍿' },
  { id: 'telescope', name: 'Brass Telescope', category: 'Decor', icon: '🔭' },
  { id: 'globe', name: 'Vintage Globe', category: 'Decor', icon: '🌍' },
  { id: 'gramophone', name: 'Antique Gramophone', category: 'Music', icon: '📻' },
  { id: 'chess', name: 'Marble Chess Set', category: 'Decor', icon: '♟️' },
];

const MATERIAL_CATEGORIES = [
  { id: 'wall', name: 'Wall Finishes', options: ['Emerald Green', 'Venetian Plaster', 'Exposed Brick', 'Oak Paneling', 'Silk Wallpaper', 'Matte Black', 'White Marble', 'Concrete'] },
  { id: 'floor', name: 'Flooring', options: ['White Marble', 'Dark Walnut', 'Polished Concrete', 'Herringbone Oak', 'Persian Rug', 'Terrazzo', 'Bamboo', 'Slate Tile'] },
  { id: 'ceiling', name: 'Ceiling Finishing', options: ['Exposed Beams', 'Coffered Ceiling', 'Tray Ceiling', 'Wood Planks', 'Painted Black', 'Skylight', 'Gold Leaf', 'Plaster'] },
  { id: 'furniture', name: 'Furniture Type', options: ['Velvet Upholstery', 'Leather', 'Linen', 'Boucle', 'Rattan', 'Chrome Frame', 'Reclaimed Wood', 'Lucite'] },
  { id: 'lighting', name: 'Lighting Fixtures', options: ['Crystal Chandelier', 'Brass Pendants', 'Track Lighting', 'Recessed LED', 'Neon Accents', 'Paper Lanterns', 'Industrial Sconces'] },
  { id: 'window', name: 'Window Treatments', options: ['Floor-to-Ceiling Drapes', 'Plantation Shutters', 'Roman Shades', 'Sheer Curtains', 'Smart Blinds', 'Frosted Glass'] },
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
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');

  const [compareValue, setCompareValue] = useState(50);
  const [showCompare, setShowCompare] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
    } catch (error: any) {
      console.error("Generation failed:", error);
      alert(`Generation failed: ${error.message || error}`);
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

  const handleMaterialSelect = (type: string, material: string) => {
    handleGenerate(`Change the ${type} to ${material}.`);
  };

  const handleTimeToggle = (newTime: 'day' | 'night') => {
    if (timeOfDay === newTime) return;
    setTimeOfDay(newTime);
    handleGenerate(`Change the lighting to ${newTime} time.`);
  };

  return (
    <div className="flex flex-col h-screen bg-AMARI-black text-AMARI-text overflow-hidden font-sans transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-10 border-b border-AMARI-border bg-AMARI-panel/80 backdrop-blur-md z-50 flex-shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-AMARI-text-muted hover:text-AMARI-text px-2 flex items-center" onClick={onBack}>
            <ChevronLeft className="w-6 h-6 mr-1" />
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </Button>
          <div className="hidden md:block">
            <h1 className="text-sm font-bold uppercase tracking-widest leading-none">The Vanguard Penthouse</h1>
            <p className="text-[10px] font-mono text-AMARI-gold uppercase tracking-widest mt-1">A.I. Interior Simulator</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-AMARI-text-muted hover:text-AMARI-text"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-AMARI-text-muted hover:text-AMARI-text" onClick={handleUndo} disabled={history.length <= 1}>
            <Undo className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-AMARI-text-muted hover:text-AMARI-text" 
            onClick={() => setShowShareModal(true)}
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button 
            className="bg-AMARI-gold text-white dark:text-black hover:bg-AMARI-text hover:text-AMARI-panel transition-colors font-bold text-[10px] uppercase tracking-widest px-4 h-9 rounded-full"
            onClick={() => {
              if (!isAuthenticated) {
                setShowAuthModal(true);
              } else {
                const link = document.createElement('a');
                link.href = currentPreview;
                link.download = 'amari-design.jpg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
          >
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
          isFullscreen ? "h-full w-full" : "h-1/2 md:h-full md:w-1/2 p-2 md:p-4"
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
                    <div className="absolute top-6 left-6 z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[8px] font-bold uppercase tracking-widest text-white">
                      Transformed
                    </div>
                    <div className="absolute top-6 right-20 z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[8px] font-bold uppercase tracking-widest text-white">
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
                
                {/* Compare Toggle (Moved from header) */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "absolute top-6 right-6 z-40 bg-black/40 backdrop-blur-md rounded-full transition-all",
                    showCompare ? "text-AMARI-gold hover:text-AMARI-gold hover:bg-black/60" : "text-white hover:text-AMARI-gold hover:bg-black/60"
                  )}
                  onClick={() => setShowCompare(!showCompare)}
                  disabled={history.length <= 1}
                >
                  <Maximize2 className="w-5 h-5" />
                </Button>
                
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

            {/* Day/Night Toggle */}
            <div className="absolute bottom-6 left-6 z-40 bg-black/40 backdrop-blur-md rounded-full border border-white/10 p-1 flex items-center">
              <button 
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                  timeOfDay === 'day' ? "bg-AMARI-gold text-black" : "text-white hover:text-AMARI-gold"
                )}
                onClick={() => handleTimeToggle('day')}
              >
                <Sun className="w-3 h-3" /> Day
              </button>
              <button 
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                  timeOfDay === 'night' ? "bg-AMARI-gold text-black" : "text-white hover:text-AMARI-gold"
                )}
                onClick={() => handleTimeToggle('night')}
              >
                <Moon className="w-3 h-3" /> Night
              </button>
            </div>

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
          <div className="flex-1 flex flex-col bg-AMARI-panel/50 backdrop-blur-xl border-l border-AMARI-border overflow-hidden">
            <div className="p-4 flex flex-col h-full">
              {/* Selector Rows */}
              <div className="space-y-2 mb-3 flex-shrink-0">
                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={activeTab === 'rooms' ? 'default' : 'outline'}
                    className={cn(
                      "h-9 rounded-xl border-AMARI-border text-[10px] font-bold uppercase tracking-widest transition-all",
                      activeTab === 'rooms' 
                        ? "bg-AMARI-gold text-white dark:text-black" 
                        : "bg-black text-white dark:bg-white dark:text-black hover:bg-AMARI-gold hover:text-white dark:hover:bg-AMARI-gold dark:hover:text-black"
                    )}
                    onClick={() => setActiveTab('rooms')}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" /> Rooms Selector
                  </Button>
                  <Button 
                    variant={activeTab === 'custom' ? 'default' : 'outline'}
                    className={cn(
                      "h-9 rounded-xl border-AMARI-border text-[10px] font-bold uppercase tracking-widest transition-all",
                      activeTab === 'custom' 
                        ? "bg-AMARI-gold text-white dark:text-black" 
                        : "bg-black text-white dark:bg-white dark:text-black hover:bg-AMARI-gold hover:text-white dark:hover:bg-AMARI-gold dark:hover:text-black"
                    )}
                    onClick={() => setActiveTab('custom')}
                  >
                    <Wand2 className="w-4 h-4 mr-2" /> Text Input (A.I.)
                  </Button>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={activeTab === 'styles' ? 'default' : 'outline'}
                    className={cn(
                      "h-9 rounded-xl border-AMARI-border text-[9px] font-bold uppercase tracking-widest transition-colors",
                      activeTab === 'styles' ? "bg-AMARI-gold text-white dark:text-black hover:bg-AMARI-text hover:text-AMARI-panel" : "text-AMARI-text-muted hover:text-AMARI-text bg-AMARI-button-bg hover:bg-AMARI-button-hover"
                    )}
                    onClick={() => setActiveTab('styles')}
                  >
                    <Palette className="w-3 h-3 mr-2" /> Styles
                  </Button>
                  <Button 
                    variant={activeTab === 'items' ? 'default' : 'outline'}
                    className={cn(
                      "h-9 rounded-xl border-AMARI-border text-[9px] font-bold uppercase tracking-widest transition-colors",
                      activeTab === 'items' ? "bg-AMARI-gold text-white dark:text-black hover:bg-AMARI-text hover:text-AMARI-panel" : "text-AMARI-text-muted hover:text-AMARI-text bg-AMARI-button-bg hover:bg-AMARI-button-hover"
                    )}
                    onClick={() => setActiveTab('items')}
                  >
                    <Plus className="w-3 h-3 mr-2" /> Add
                  </Button>
                  <Button 
                    variant={activeTab === 'materials' ? 'default' : 'outline'}
                    className={cn(
                      "h-9 rounded-xl border-AMARI-border text-[9px] font-bold uppercase tracking-widest transition-colors",
                      activeTab === 'materials' ? "bg-AMARI-gold text-white dark:text-black hover:bg-AMARI-text hover:text-AMARI-panel" : "text-AMARI-text-muted hover:text-AMARI-text bg-AMARI-button-bg hover:bg-AMARI-button-hover"
                    )}
                    onClick={() => setActiveTab('materials')}
                  >
                    <Layers className="w-3 h-3 mr-2" /> Materials
                  </Button>
                </div>
              </div>
              
              <div className="h-px w-full bg-AMARI-border mb-3 flex-shrink-0" />

              {/* Content Area */}
              <div className="flex-1 overflow-y-scroll pr-2 custom-scrollbar">
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
                            "p-4 bg-AMARI-button-bg border-AMARI-border hover:border-AMARI-gold/50 transition-all cursor-pointer relative overflow-hidden group",
                            activeStyle === style.id && "border-AMARI-gold bg-AMARI-gold/10"
                          )}
                          onClick={() => handleStyleSelect(style.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">{style.icon}</div>
                            <div>
                              <h3 className="text-xs font-bold uppercase tracking-widest text-AMARI-text mb-1">{style.name}</h3>
                              <p className="text-[10px] text-AMARI-text-muted leading-tight">{style.description}</p>
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
                          className="h-16 bg-AMARI-button-bg border-AMARI-border hover:border-AMARI-gold hover:bg-AMARI-gold/10 justify-start px-6 rounded-xl"
                          onClick={() => handleAddItem(item.name)}
                        >
                          <span className="text-2xl mr-4">{item.icon}</span>
                          <div className="text-left">
                            <p className="text-xs font-bold uppercase tracking-widest text-AMARI-text">{item.name}</p>
                            <p className="text-[10px] text-AMARI-text-muted uppercase">{item.category}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}

                  {activeTab === 'materials' && (
                    <div className="space-y-2">
                      {MATERIAL_CATEGORIES.map((category) => (
                        <div key={category.id} className="border-b border-AMARI-border last:border-0 pb-2">
                          <button 
                            className="w-full flex items-center justify-between py-4 text-left group"
                            onClick={() => setExpandedMaterial(expandedMaterial === category.id ? null : category.id)}
                          >
                            <span className="text-[10px] font-bold uppercase tracking-widest text-AMARI-gold group-hover:text-AMARI-text transition-colors">
                              {category.name}
                            </span>
                            {expandedMaterial === category.id ? (
                              <ChevronUp className="w-4 h-4 text-AMARI-text-muted" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-AMARI-text-muted" />
                            )}
                          </button>
                          
                          <AnimatePresence>
                            {expandedMaterial === category.id && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="grid grid-cols-2 gap-3 pb-4 pt-2">
                                  {category.options.map((m) => (
                                    <Button 
                                      key={m}
                                      variant="outline" 
                                      className="h-12 bg-AMARI-button-bg border-AMARI-border text-AMARI-text text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-AMARI-button-hover hover:border-AMARI-gold transition-all"
                                      onClick={() => handleMaterialSelect(category.id, m)}
                                    >
                                      {m}
                                    </Button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'custom' && (
                    <div className="space-y-4 flex flex-col h-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-8 bg-AMARI-button-bg border-AMARI-border text-AMARI-text hover:bg-AMARI-button-hover text-[10px] font-bold uppercase tracking-widest rounded-lg">
                            <Upload className="w-3 h-3 mr-2" /> Upload Image
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 bg-AMARI-button-bg border-AMARI-border text-AMARI-text hover:bg-AMARI-button-hover rounded-lg">
                            <Paperclip className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          className="h-8 bg-AMARI-gold text-white dark:text-black hover:bg-AMARI-text hover:text-AMARI-panel text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors"
                          onClick={() => handleGenerate()}
                          disabled={isGenerating}
                        >
                          <Send className="w-3 h-3 mr-2" /> Apply
                        </Button>
                      </div>
                      <div className="relative flex-1 min-h-[120px]">
                        <textarea 
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="Describe your vision... (e.g., 'Add a modern fireplace and change walls to emerald green')"
                          className="w-full h-full min-h-[120px] bg-AMARI-button-bg border border-AMARI-border rounded-2xl p-4 text-sm text-AMARI-text placeholder-AMARI-text-muted focus:border-AMARI-gold outline-none resize-none transition-all"
                        />
                        <div className="absolute bottom-4 right-4">
                          <Wand2 className="w-5 h-5 text-AMARI-gold animate-pulse" />
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-AMARI-gold text-white dark:text-black hover:bg-AMARI-text hover:text-AMARI-panel h-14 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm shadow-lg transition-colors flex-shrink-0"
                        onClick={() => handleGenerate()}
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'Processing...' : 'Apply Transformation'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Control Panel Footer */}
            <div className="p-6 border-t border-AMARI-border bg-AMARI-panel flex gap-3">
              <Button 
                className="flex-1 bg-AMARI-text text-AMARI-panel hover:bg-AMARI-gold hover:text-white dark:hover:text-black h-14 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm transition-colors"
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowAuthModal(true);
                  } else {
                    const link = document.createElement('a');
                    link.href = currentPreview;
                    link.download = 'amari-design.jpg';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
              >
                Save Design
              </Button>
              <Button 
                variant="outline"
                className="w-14 h-14 rounded-2xl border-AMARI-border text-AMARI-text hover:bg-AMARI-gold hover:text-white dark:hover:text-black transition-colors flex items-center justify-center"
                onClick={() => setShowShareModal(true)}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar (Optional, for larger screens) */}
      <div className="hidden lg:block fixed right-8 top-24 w-80 z-40">
        <Card className="bg-AMARI-panel/80 backdrop-blur-2xl border-AMARI-border p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-AMARI-gold/10 flex items-center justify-center">
              <Camera className="w-5 h-5 text-AMARI-gold" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-AMARI-text">Live View</h3>
              <p className="text-[9px] text-AMARI-text-muted font-mono">AR_MODE: SIMULATED</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-AMARI-text-muted mb-3">
                <span>Lighting Intensity</span>
                <span className="text-AMARI-gold">85%</span>
              </div>
              <Slider defaultValue={[85]} max={100} step={1} />
            </div>
            
            <div>
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-AMARI-text-muted mb-3">
                <span>Material Quality</span>
                <span className="text-AMARI-gold">Ultra</span>
              </div>
              <Slider defaultValue={[100]} max={100} step={1} />
            </div>

            <div className="pt-4 border-t border-AMARI-border">
              <Button variant="outline" className="w-full border-AMARI-border text-AMARI-text hover:bg-AMARI-button-hover h-10 text-[10px] font-bold uppercase tracking-widest">
                <Download className="w-4 h-4 mr-2" /> Export 4K Render
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-AMARI-panel border border-AMARI-border rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-6 right-6 text-AMARI-text-muted hover:text-AMARI-text"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-AMARI-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-AMARI-gold" />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-widest text-AMARI-text mb-2">Save Your Design</h2>
                <p className="text-xs text-AMARI-text-muted">Create an account to download high-resolution renders and save your portfolio.</p>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <Button 
                  className="w-full h-12 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3"
                  onClick={() => { 
                    setIsAuthenticated(true); 
                    setShowAuthModal(false); 
                    const link = document.createElement('a');
                    link.href = currentPreview;
                    link.download = 'amari-design.jpg';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>

                <Button 
                  className="w-full h-12 bg-black text-white border border-white/20 hover:bg-white/10 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3"
                  onClick={() => { 
                    setIsAuthenticated(true); 
                    setShowAuthModal(false); 
                    const link = document.createElement('a');
                    link.href = currentPreview;
                    link.download = 'amari-design.jpg';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Apple className="w-5 h-5" />
                  Continue with Apple
                </Button>
                
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-AMARI-border"></div>
                  <span className="flex-shrink-0 mx-4 text-[10px] uppercase tracking-widest text-AMARI-text-muted">Or Phone</span>
                  <div className="flex-grow border-t border-AMARI-border"></div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-AMARI-text-muted" />
                    <input 
                      type="text" 
                      placeholder="FULL NAME" 
                      className="w-full h-12 bg-AMARI-button-bg border border-AMARI-border rounded-xl pl-10 pr-4 text-xs text-AMARI-text placeholder-AMARI-text-muted focus:border-AMARI-gold outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-AMARI-text-muted" />
                    <input 
                      type="tel" 
                      placeholder="PHONE NUMBER" 
                      className="w-full h-12 bg-AMARI-button-bg border border-AMARI-border rounded-xl pl-10 pr-4 text-xs text-AMARI-text placeholder-AMARI-text-muted focus:border-AMARI-gold outline-none"
                    />
                  </div>
                  <Button 
                    className="w-full h-12 bg-AMARI-gold text-white dark:text-black hover:bg-AMARI-text hover:text-AMARI-panel rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
                    onClick={() => { 
                      setIsAuthenticated(true); 
                      setShowAuthModal(false); 
                      const link = document.createElement('a');
                      link.href = currentPreview;
                      link.download = 'amari-design.jpg';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Continue with Phone
                  </Button>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-AMARI-border"></div>
                  <span className="flex-shrink-0 mx-4 text-[10px] uppercase tracking-widest text-AMARI-text-muted">Or Email</span>
                  <div className="flex-grow border-t border-AMARI-border"></div>
                </div>

                <div className="space-y-2">
                  <input 
                    type="email" 
                    placeholder="ENTER YOUR EMAIL" 
                    className="w-full h-12 bg-AMARI-button-bg border border-AMARI-border rounded-xl px-4 text-xs text-AMARI-text placeholder-AMARI-text-muted focus:border-AMARI-gold outline-none"
                  />
                  <Button 
                    className="w-full h-12 bg-AMARI-gold text-white dark:text-black hover:bg-AMARI-text hover:text-AMARI-panel rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
                    onClick={() => { 
                      setIsAuthenticated(true); 
                      setShowAuthModal(false); 
                      const link = document.createElement('a');
                      link.href = currentPreview;
                      link.download = 'amari-design.jpg';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Continue with Email
                  </Button>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-AMARI-border"></div>
                  <span className="flex-shrink-0 mx-4 text-[10px] uppercase tracking-widest text-AMARI-text-muted">More Options</span>
                  <div className="flex-grow border-t border-AMARI-border"></div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    className="h-10 border-AMARI-border text-AMARI-text hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors flex items-center justify-center gap-2 text-[10px]"
                    onClick={() => { setIsAuthenticated(true); setShowAuthModal(false); }}
                  >
                    <Linkedin className="w-3 h-3" /> LinkedIn
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-10 border-AMARI-border text-AMARI-text hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-colors flex items-center justify-center gap-2 text-[10px]"
                    onClick={() => { setIsAuthenticated(true); setShowAuthModal(false); }}
                  >
                    <Instagram className="w-3 h-3" /> Instagram
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-10 border-AMARI-border text-AMARI-text hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors flex items-center justify-center gap-2 text-[10px]"
                    onClick={() => { setIsAuthenticated(true); setShowAuthModal(false); }}
                  >
                    <Facebook className="w-3 h-3" /> Facebook
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-10 border-AMARI-border text-AMARI-text hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2 text-[10px]"
                    onClick={() => { setIsAuthenticated(true); setShowAuthModal(false); }}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    TikTok
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-AMARI-panel border border-AMARI-border rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowShareModal(false)}
                className="absolute top-6 right-6 text-AMARI-text-muted hover:text-AMARI-text"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-AMARI-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-AMARI-gold" />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-widest text-AMARI-text mb-2">Share Design</h2>
                <p className="text-xs text-AMARI-text-muted">Share your AI-generated interior design with the world.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  className="h-12 border-AMARI-border text-AMARI-text hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    window.open(`https://wa.me/?text=Check out my AI interior design from Amari Sekani! ${window.location.href}`, '_blank');
                    setShowShareModal(false);
                  }}
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </Button>
                <Button 
                  variant="outline"
                  className="h-12 border-AMARI-border text-AMARI-text hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=Check out my AI interior design from Amari Sekani!&url=${window.location.href}`, '_blank');
                    setShowShareModal(false);
                  }}
                >
                  <Twitter className="w-4 h-4" /> X (Twitter)
                </Button>
                <Button 
                  variant="outline"
                  className="h-12 border-AMARI-border text-AMARI-text hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank');
                    setShowShareModal(false);
                  }}
                >
                  <Facebook className="w-4 h-4" /> Facebook
                </Button>
                <Button 
                  variant="outline"
                  className="h-12 border-AMARI-border text-AMARI-text hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank');
                    setShowShareModal(false);
                  }}
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </Button>
              </div>

              <div className="mt-6">
                <div className="relative flex items-center py-2 mb-4">
                  <div className="flex-grow border-t border-AMARI-border"></div>
                  <span className="flex-shrink-0 mx-4 text-[10px] uppercase tracking-widest text-AMARI-text-muted">Or copy link</span>
                  <div className="flex-grow border-t border-AMARI-border"></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="text" 
                    readOnly
                    value={window.location.href}
                    className="flex-1 min-w-0 h-12 bg-AMARI-button-bg border border-AMARI-border rounded-xl px-4 text-xs text-AMARI-text outline-none"
                  />
                  <Button 
                    className="w-full sm:w-auto flex-shrink-0 h-12 px-6 bg-AMARI-gold text-white dark:text-black hover:bg-AMARI-text hover:text-AMARI-panel rounded-xl font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                  >
                    <Link className="w-4 h-4" /> Copy
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
