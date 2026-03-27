import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Book, 
  ClipboardList, 
  FileQuestion, 
  FlaskConical, 
  ExternalLink,
  Heart,
  Share2,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';

export type ResourceType = 'notes' | 'books' | 'assignment' | 'paper' | 'lab' | 'other';

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    type: string;
    link?: string;
    url?: string;
    [key: string]: any;
  };
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onOpen?: (resource: any) => void;
  onShare?: (resource: any) => void;
  isCopied?: boolean;
}

const typeConfig = {
  notes: {
    icon: FileText,
    label: 'Notes',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50/50 dark:bg-emerald-900/10',
    accent: 'bg-emerald-600',
    gradient: 'from-emerald-50/50 via-white/80 to-white dark:from-emerald-950/30 dark:via-slate-900/80 dark:to-slate-900',
    borderColor: 'group-hover:border-emerald-500/30',
    glow: 'hover:shadow-emerald-500/10'
  },
  books: {
    icon: Book,
    label: 'Book',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50/50 dark:bg-blue-900/10',
    accent: 'bg-blue-600',
    gradient: 'from-blue-50/50 via-white/80 to-white dark:from-blue-950/30 dark:via-slate-900/80 dark:to-slate-900',
    borderColor: 'group-hover:border-blue-500/30',
    glow: 'hover:shadow-blue-500/10'
  },
  assignment: {
    icon: ClipboardList,
    label: 'Assignment',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50/50 dark:bg-amber-900/10',
    accent: 'bg-amber-600',
    gradient: 'from-amber-50/50 via-white/80 to-white dark:from-amber-950/30 dark:via-slate-900/80 dark:to-slate-900',
    borderColor: 'group-hover:border-amber-500/30',
    glow: 'hover:shadow-amber-500/10'
  },
  paper: {
    icon: FileQuestion,
    label: 'Paper',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50/50 dark:bg-violet-900/10',
    accent: 'bg-violet-600',
    gradient: 'from-violet-50/50 via-white/80 to-white dark:from-violet-950/30 dark:via-slate-900/80 dark:to-slate-900',
    borderColor: 'group-hover:border-violet-500/30',
    glow: 'hover:shadow-violet-500/10'
  },
  lab: {
    icon: FlaskConical,
    label: 'Lab',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50/50 dark:bg-rose-900/10',
    accent: 'bg-rose-600',
    gradient: 'from-rose-50/50 via-white/80 to-white dark:from-rose-950/30 dark:via-slate-900/80 dark:to-slate-900',
    borderColor: 'group-hover:border-rose-500/30',
    glow: 'hover:shadow-rose-500/10'
  },
  other: {
    icon: FileText,
    label: 'Other',
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-50/50 dark:bg-slate-800/10',
    accent: 'bg-slate-600',
    gradient: 'from-slate-50/50 via-white/80 to-white dark:from-slate-900/20 dark:via-slate-900/80 dark:to-slate-900',
    borderColor: 'group-hover:border-slate-500/30',
    glow: 'hover:shadow-slate-500/10'
  }
};

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isFavorite = false,
  onToggleFavorite,
  onOpen,
  onShare,
  isCopied = false
}) => {
  const config = typeConfig[resource.type as ResourceType] || typeConfig.other;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        "group relative flex flex-col h-full bg-gradient-to-br rounded-[2rem] border border-black/5 dark:border-white/5 overflow-hidden transition-all duration-500",
        "hover:shadow-2xl",
        config.gradient,
        config.borderColor,
        config.glow
      )}
    >
      {/* Interactive Hover Overlay */}
      <div className="absolute inset-0 bg-white/40 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative p-5 md:p-7 flex flex-col h-full space-y-5 md:space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className={cn(
            "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-md shadow-black/5 dark:shadow-white/5 bg-gradient-to-br",
            config.bg,
            config.color,
            "from-white/50 to-transparent dark:from-white/10 dark:to-transparent"
          )}>
            <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
          </div>
          <div className={cn(
            "px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] border border-transparent transition-all duration-300",
            config.bg,
            config.color,
            "group-hover:border-current/10"
          )}>
            {config.label}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1.5 md:space-y-2">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors line-clamp-2">
            {resource.title}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-1 font-medium">
            {config.label} Resource • {resource.subjectId ? 'Subject Material' : 'General'}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 md:gap-2">
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(resource.id);
                }}
                className={cn(
                  "p-2.5 md:p-3 rounded-xl transition-all duration-300 flex items-center justify-center group/btn",
                  isFavorite 
                    ? "bg-rose-50 text-rose-500 dark:bg-rose-900/20" 
                    : "bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 dark:bg-slate-800 dark:hover:bg-rose-900/20"
                )}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart 
                  className={cn("w-4 h-4 md:w-5 md:h-5 transition-transform duration-300", isFavorite && "scale-110")}
                  fill={isFavorite ? "currentColor" : "none"} 
                />
              </button>
            )}
            {onShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(resource);
                }}
                className={cn(
                  "p-2.5 md:p-3 rounded-xl transition-all duration-300 flex items-center justify-center group/btn",
                  isCopied 
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" 
                    : "bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-900/20"
                )}
                title="Share resource"
              >
                {isCopied ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <Share2 className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            )}
          </div>

          <button
            onClick={() => onOpen?.(resource)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 shadow-sm",
              "text-white hover:shadow-lg hover:scale-105 active:scale-95",
              config.accent
            )}
          >
            Open <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
