'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Copy,
  Check,
  Terminal,
  Home,
  User,
  Settings,
  Bell,
  Heart,
  Share2,
  Bookmark,
  Calendar,
  Camera,
  Compass,
  Download,
  Eye,
  FileText,
  Folder,
  Globe,
  Image,
  Info,
  Key,
  Layers,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Moon,
  Music,
  Phone,
  Play,
  Plus,
  RefreshCw,
  Send,
  Shield,
  ShoppingBag,
  Sliders,
  Sparkles,
  Star,
  Sun,
  Trash2,
  Unlock,
  Upload,
  Video,
  Volume2,
  Wifi,
  Zap,
} from 'lucide-react';

const ICON_COLLECTION = [
  { name: 'Home', icon: Home, category: 'Navigation' },
  { name: 'Search', icon: Search, category: 'Action' },
  { name: 'User', icon: User, category: 'General' },
  { name: 'Settings', icon: Settings, category: 'General' },
  { name: 'Bell', icon: Bell, category: 'Feedback' },
  { name: 'Heart', icon: Heart, category: 'Feedback' },
  { name: 'Share2', icon: Share2, category: 'Action' },
  { name: 'Bookmark', icon: Bookmark, category: 'Action' },
  { name: 'Calendar', icon: Calendar, category: 'General' },
  { name: 'Camera', icon: Camera, category: 'Media' },
  { name: 'Compass', icon: Compass, category: 'Navigation' },
  { name: 'Download', icon: Download, category: 'Action' },
  { name: 'Eye', icon: Eye, category: 'Action' },
  { name: 'FileText', icon: FileText, category: 'General' },
  { name: 'Folder', icon: Folder, category: 'General' },
  { name: 'Globe', icon: Globe, category: 'General' },
  { name: 'Image', icon: Image, category: 'Media' },
  { name: 'Info', icon: Info, category: 'Feedback' },
  { name: 'Key', icon: Key, category: 'Security' },
  { name: 'Layers', icon: Layers, category: 'General' },
  { name: 'Lock', icon: Lock, category: 'Security' },
  { name: 'Mail', icon: Mail, category: 'Communication' },
  { name: 'MapPin', icon: MapPin, category: 'Navigation' },
  { name: 'MessageCircle', icon: MessageCircle, category: 'Communication' },
  { name: 'Mic', icon: Mic, category: 'Media' },
  { name: 'Moon', icon: Moon, category: 'General' },
  { name: 'Music', icon: Music, category: 'Media' },
  { name: 'Phone', icon: Phone, category: 'Communication' },
  { name: 'Play', icon: Play, category: 'Media' },
  { name: 'Plus', icon: Plus, category: 'Action' },
  { name: 'RefreshCw', icon: RefreshCw, category: 'Action' },
  { name: 'Send', icon: Send, category: 'Action' },
  { name: 'Shield', icon: Shield, category: 'Security' },
  { name: 'ShoppingBag', icon: ShoppingBag, category: 'Commerce' },
  { name: 'Sliders', icon: Sliders, category: 'Action' },
  { name: 'Sparkles', icon: Sparkles, category: 'General' },
  { name: 'Star', icon: Star, category: 'Feedback' },
  { name: 'Sun', icon: Sun, category: 'General' },
  { name: 'Trash2', icon: Trash2, category: 'Action' },
  { name: 'Unlock', icon: Unlock, category: 'Security' },
  { name: 'Upload', icon: Upload, category: 'Action' },
  { name: 'Video', icon: Video, category: 'Media' },
  { name: 'Volume2', icon: Volume2, category: 'Media' },
  { name: 'Wifi', icon: Wifi, category: 'General' },
  { name: 'Zap', icon: Zap, category: 'General' },
];

const DEFAULT_ICON = ICON_COLLECTION[0] ?? { name: 'Home', icon: Home, category: 'Navigation' };

export function IconExplorer() {
  const [search, setSearch] = useState('');
  const [size, setSize] = useState(24);
  const [color, setColor] = useState('#3b82f6');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_ICON);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const filteredIcons = useMemo(() => {
    return ICON_COLLECTION.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  }, []);

  const SelectedIconComp = selectedIcon.icon;

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Left / Center: Searchable Grid */}
      <div className="flex-1 flex flex-col border-r border-zinc-800 bg-zinc-950 overflow-hidden">
        {/* Top Filter Bar */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between gap-4 bg-zinc-900/60">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons by name or category (e.g. Navigation, Media, Action)..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-zinc-700"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Size</span>
              <input
                type="range"
                min="16"
                max="48"
                step="4"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-20 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <span className="font-mono text-[11px] text-zinc-300 w-6">{size}px</span>
            </div>

            <div className="flex items-center gap-1.5">
              {['#ffffff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`h-5 w-5 rounded-full border border-white/20 transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-zinc-950' : 'hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {filteredIcons.map((item) => {
              const IconComp = item.icon;
              const isSelected = selectedIcon.name === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setSelectedIcon(item)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-sky-500/10 text-white shadow-sm ring-1 ring-sky-500'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <IconComp size={size} color={color} strokeWidth={strokeWidth} />
                  <span className="mt-2 text-[11px] font-medium truncate w-full text-center">
                    {item.name}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono truncate">
                    {item.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Icon Inspector & Code Snippets */}
      <aside className="w-80 shrink-0 flex flex-col border-l border-zinc-800 bg-zinc-900/90 p-5 space-y-6 overflow-y-auto">
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-zinc-800 bg-zinc-950">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800/80 shadow-inner">
            <SelectedIconComp size={56} color={color} strokeWidth={strokeWidth} />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">{selectedIcon.name}</h3>
          <span className="text-xs text-zinc-500 font-mono">{selectedIcon.category} Icon</span>
        </div>

        {/* Configuration */}
        <div className="space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block">
            Props
          </span>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Stroke Width</span>
              <div className="flex gap-1">
                {[1.5, 2, 2.5].map((w) => (
                  <button
                    key={w}
                    onClick={() => setStrokeWidth(w)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      strokeWidth === w ? 'bg-sky-500 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Code Generation Snippets */}
        <div className="space-y-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block">
            Usage Snippets
          </span>

          {/* JSX Code */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>JSX Element</span>
              <button
                onClick={() =>
                  copyToClipboard(
                    `<${selectedIcon.name} size={${size}} color="${color}" strokeWidth={${strokeWidth}} />`,
                    'jsx'
                  )
                }
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300"
              >
                {copiedType === 'jsx' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedType === 'jsx' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <code className="text-[11px] font-mono text-zinc-300 block truncate">
              {`<${selectedIcon.name} size={${size}} color="${color}" strokeWidth={${strokeWidth}} />`}
            </code>
          </div>

          {/* Import Code */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Import Statement</span>
              <button
                onClick={() =>
                  copyToClipboard(
                    `import { ${selectedIcon.name} } from "lucide-react-native";`,
                    'import'
                  )
                }
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300"
              >
                {copiedType === 'import' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedType === 'import' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <code className="text-[11px] font-mono text-zinc-300 block truncate">
              {`import { ${selectedIcon.name} } from "lucide-react-native";`}
            </code>
          </div>
        </div>

        {/* Installation Requirement */}
        <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
            <Terminal className="h-3.5 w-3.5 text-emerald-400" />
            <span>Install Package</span>
          </div>
          <code className="text-[10px] text-zinc-400 font-mono block bg-zinc-950 p-2 rounded border border-zinc-800/80">
            npx expo install lucide-react-native react-native-svg
          </code>
        </div>
      </aside>
    </div>
  );
}
