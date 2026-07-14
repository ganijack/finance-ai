"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Plus, Target, Trophy, Calendar, MoreVertical, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("0");
  const [targetDate, setTargetDate] = useState("");
  const [description, setDescription] = useState("");

  // Action state
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [addAmount, setAddAmount] = useState("");

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/goals");
      const data = await res.json();
      setGoals(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          targetAmount, 
          currentAmount, 
          targetDate: targetDate || undefined, 
          description 
        })
      });

      if (!res.ok) throw new Error("Failed to save goal");
      
      toast.success("Goal created!");
      setTitle("");
      setTargetAmount("");
      setCurrentAmount("0");
      setTargetDate("");
      setDescription("");
      fetchGoals();
    } catch (error) {
      toast.error("Failed to create goal");
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !addAmount) return;

    try {
      const res = await fetch(`/api/goals/${selectedGoal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addAmount })
      });
      if (!res.ok) throw new Error("Failed to add funds");
      
      toast.success("Funds added successfully!");
      setIsAddFundsOpen(false);
      setAddAmount("");
      fetchGoals();
    } catch (error) {
      toast.error("Failed to add funds");
    }
  };

  const handleDeleteGoal = async () => {
    if (!selectedGoal) return;
    try {
      const res = await fetch(`/api/goals/${selectedGoal.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete goal");
      
      toast.success("Goal deleted!");
      setIsDeleteOpen(false);
      fetchGoals();
    } catch (error) {
      toast.error("Failed to delete goal");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
        <p className="text-muted-foreground mt-1">Track your progress towards your financial targets.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Create Goal Form */}
        <Card className="md:col-span-1 border-border/40 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-indigo-500" />
              New Goal
            </CardTitle>
            <CardDescription>What are you saving for?</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="e.g. Vacation, New Car" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Amount</label>
                  <Input type="number" min="0" step="0.01" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Saved</label>
                  <Input type="number" min="0" step="0.01" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Date (Optional)</label>
                <Input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600">Create Goal</Button>
            </form>
          </CardContent>
        </Card>

        {/* Goals List */}
        <div className="md:col-span-2 space-y-4">
          {goals.length === 0 ? (
            <Card className="border-border/40 shadow-sm bg-muted/20 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">No active goals</h3>
                <p className="text-muted-foreground text-sm max-w-sm mt-1">Start saving for your dreams by creating a financial goal.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {goals.map((goal) => {
                const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                const isCompleted = percent >= 100;
                
                return (
                  <Card key={goal.id} className={`border-border/40 shadow-sm overflow-hidden ${isCompleted ? 'bg-indigo-500/5 border-indigo-500/20' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          {goal.targetDate && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {isCompleted && <Trophy className="h-5 w-5 text-yellow-500 mr-2" />}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedGoal(goal); setIsAddFundsOpen(true); }}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Funds
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => { setSelectedGoal(goal); setIsDeleteOpen(true); }}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Goal
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">{formatCurrency(goal.currentAmount)}</span>
                        <span className="text-muted-foreground">of {formatCurrency(goal.targetAmount)}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-violet-500 to-indigo-500'}`} 
                          style={{ width: `${percent}%` }} 
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between">
                      <span>{percent.toFixed(1)}% complete</span>
                      {isCompleted ? <span className="font-medium text-green-500">Achieved!</span> : null}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Funds Dialog */}
      <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
            <DialogDescription>
              How much would you like to add to your '{selectedGoal?.title}' goal?
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddFunds} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount to add</label>
              <Input 
                type="number" 
                min="0.01" 
                step="0.01" 
                placeholder="e.g. 50000" 
                value={addAmount} 
                onChange={e => setAddAmount(e.target.value)} 
                required 
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddFundsOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Add Funds</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Goal Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your '{selectedGoal?.title}' goal? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={handleDeleteGoal}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
