import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from "lucide-react";

export default function SortableImageItem({ 
  url, 
  index, 
  onRemove, 
  isProcessing 
}: { 
  url: string; 
  index: number; 
  onRemove: () => void; 
  isProcessing: boolean; 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group aspect-square overflow-hidden",
        isDragging && "opacity-50 z-50"
      )}
    >
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat" 
        style={{ backgroundImage: `url(${url})` }} 
      />
      
      {/* Drag handle - увеличим область */}
      <div 
        className="absolute top-2 right-2 w-8 h-8 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded flex items-center justify-center"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-white" />
      </div>
      
      {/* Delete button - отдельная зона */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="h-8 w-8 pointer-events-auto"
          disabled={isProcessing}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {index === 0 && (
        <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded pointer-events-none">
          Main
        </div>
      )}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded pointer-events-none">
        {index + 1}
      </div>
    </Card>
  );
}