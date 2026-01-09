import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import SectionForm from "./SectionForm";
import { Section } from "@/features/admin/courses/types";

interface Props {
  courseId: string;
  children: ReactNode;
  section?: Section;
}
export function SectionFormDialog({ courseId, section, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent aria-describedby="section-dialog">
        <DialogHeader>
          <DialogTitle>
            {section == null ? "New Section" : `Edit ${section.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <SectionForm
            section={section}
            courseId={courseId}
            onSuccess={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
