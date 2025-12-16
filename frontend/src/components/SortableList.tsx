import { ReactNode , useOptimistic, useTransition} from "react";
import {DndContext, DragEndEvent} from '@dnd-kit/core';
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { cn } from "@/lib/utils";
import { GripVerticalIcon } from "lucide-react";

type Props<T> = {
    items: T[],
    onOrderChange: (newOrderIds: string[])=> void,
    children: (items:T[]) => ReactNode,
}
const SortableList = <T extends {id: string}>({items, children,onOrderChange}:Props<T>) => {

  const [optimisticItems, setOptimisticItems] = useOptimistic(items);

  const [, startTransition] = useTransition();

  function handleDragEnd(evt: DragEndEvent){
    const {active, over} = evt;
    if(over === null) return;
    const activeId = active.id.toString();
    const overId = over.id.toString();
    
    function generateNewArrayOnDrag(array: T[], activeId: string, overId: string){
     const oldIndex = array.findIndex(section => section.id ===activeId);
     const newIndex = array.findIndex(section => section.id ===overId);

     return arrayMove(array, oldIndex,newIndex);
    }

    startTransition(()=>{
      const newItems =  generateNewArrayOnDrag(items, activeId, overId);
      setOptimisticItems(newItems);
      onOrderChange(newItems.map(s=> s.id));
    })
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={optimisticItems} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col">
           {children(optimisticItems)}
        </div>
      </SortableContext>
    </DndContext>
  )
}
export default SortableList;


type SortableItemProps = {
    id: string,
    children: ReactNode,
    className?: string,
}
export const SortableItem = ({id, children, className}:SortableItemProps)=>{
   const {setNodeRef, transform, transition, activeIndex, index, attributes, listeners} = useSortable({id});

   const isActive = activeIndex === index;

   return <div ref={setNodeRef} style={{
    transform: CSS.Transform.toString(transform),
    transition
   }} className={cn("flex gap-1 items-center bg-background rounded-lg p-2", isActive && 'z-10 border shadow-md')}>
      <GripVerticalIcon className="text-muted-foreground size-6 p-1" {...attributes} {...listeners}/>
      <div className={cn("grow", className)}>{children}</div>
   </div>
}