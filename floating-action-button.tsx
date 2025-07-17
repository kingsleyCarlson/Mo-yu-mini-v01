import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddGoalDialog from "@/components/dialogs/add-goal-dialog";
import AddHabitDialog from "@/components/dialogs/add-habit-dialog";
import AddJournalEntryDialog from "@/components/dialogs/add-journal-entry-dialog";
import AddTransactionDialog from "@/components/dialogs/add-transaction-dialog";

export default function FloatingActionButton() {
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [habitDialogOpen, setHabitDialogOpen] = useState(false);
  const [journalDialogOpen, setJournalDialogOpen] = useState(false);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 z-40">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="w-48 mb-4">
          <DropdownMenuItem onClick={() => setGoalDialogOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Add Goal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setHabitDialogOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Add Habit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setJournalDialogOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Journal Entry
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTransactionDialogOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Transaction
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddGoalDialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen} />
      <AddHabitDialog open={habitDialogOpen} onOpenChange={setHabitDialogOpen} />
      <AddJournalEntryDialog open={journalDialogOpen} onOpenChange={setJournalDialogOpen} />
      <AddTransactionDialog open={transactionDialogOpen} onOpenChange={setTransactionDialogOpen} />
    </>
  );
}
