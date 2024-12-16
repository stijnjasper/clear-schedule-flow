import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/data/projects";
import ProjectSelector from "./quick-menu/ProjectSelector";
import TimeBlockSelector from "./quick-menu/TimeBlockSelector";
import DescriptionInput from "./quick-menu/DescriptionInput";
import { resetQuickMenuState } from "@/utils/quickMenuUtils";

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: any, timeBlock: "whole-day" | "morning" | "afternoon", description?: string) => void;
  selectedDate: string;
  teamMember: string;
  editingTask: any | null;
}

const TaskAssignmentModal = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  teamMember,
  editingTask,
}: TaskAssignmentModalProps) => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [timeBlock, setTimeBlock] = useState<"whole-day" | "morning" | "afternoon">("whole-day");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const handleKeyboardShortcut = useCallback((e: KeyboardEvent) => {
    if (isOpen && (e.metaKey || e.ctrlKey) && (e.key === 'Enter' || e.key === 'Return')) {
      e.preventDefault();
      if (selectedProject) {
        handleSave();
      }
    }
  }, [isOpen, selectedProject]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, [handleKeyboardShortcut]);

  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        const project = PROJECTS.find(p => p.name === editingTask.title);
        if (project) {
          setSelectedProject(project);
          setTimeBlock(editingTask.timeBlock);
          setDescription(editingTask.description || "");
          setModalTitle(`Edit Task - ${project.name}`);
        } else {
          console.warn(`Project not found for title: ${editingTask.title}`);
          setModalTitle("Edit Task");
        }
      } else {
        resetQuickMenuState(setSelectedProject, setTimeBlock, setDescription, setSearchQuery);
        setModalTitle("New Task");
      }
    }
  }, [isOpen, editingTask]);

  const handleClose = () => {
    resetQuickMenuState(setSelectedProject, setTimeBlock, setDescription, setSearchQuery);
    onClose();
  };

  const handleSave = () => {
    if (selectedProject) {
      onSave(selectedProject, timeBlock, description);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-background dark:bg-[#1b1b1b] border-border dark:border-[#333333]">
        <DialogHeader>
          <DialogTitle className="text-foreground dark:text-[#f0f0f0]">{modalTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <ProjectSelector
            selectedProject={selectedProject}
            onProjectSelect={setSelectedProject}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />

          <TimeBlockSelector
            value={timeBlock}
            onChange={setTimeBlock}
          />

          <DescriptionInput
            description={description}
            onDescriptionChange={setDescription}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="dark:bg-modal-button-dark dark:border-modal-button-border-dark dark:text-modal-button-text-dark dark:hover:bg-gray-700/50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!selectedProject}
            className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAssignmentModal;