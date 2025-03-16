
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CalendarIcon, Bell, Plus, AlarmClock, Mail, Edit, Trash, ArrowRight, CalendarDays, BellRing } from "lucide-react";
import { format, isBefore, addDays, formatDistance } from "date-fns";
import { Timestamp } from "@/lib/firebase";
import { Reminder, addReminder, getUserReminders, updateReminder, deleteReminder, sendReminderEmail } from "@/lib/reminderService";
import { cn } from "@/lib/utils";

const AnniversaryReminders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  
  // Form states
  const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    if (user) {
      loadReminders();
      // Set default email to user's email
      setEmail(user.email || "");
    }
  }, [user]);
  
  const loadReminders = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const userReminders = await getUserReminders(user.uid);
      setReminders(userReminders);
    } catch (error) {
      console.error("Error loading reminders:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load reminders"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.uid || !title || !date || !email) return;
    
    try {
      if (editMode && currentReminder?.id) {
        // Update existing reminder
        const updatedData: Partial<Reminder> = {
          title,
          description,
          date: Timestamp.fromDate(date),
          email,
        };
        
        await updateReminder(currentReminder.id, updatedData);
        
        toast({
          title: "Success",
          description: "Reminder updated successfully"
        });
        
        // Update local state
        setReminders(prev => 
          prev.map(reminder => 
            reminder.id === currentReminder.id 
              ? { ...reminder, ...updatedData } 
              : reminder
          )
        );
      } else {
        // Create new reminder
        const newReminder: Omit<Reminder, 'id' | 'createdAt' | 'reminderSent'> = {
          userId: user.uid,
          title,
          description,
          date: Timestamp.fromDate(date),
          email,
        };
        
        const createdReminder = await addReminder(newReminder);
        
        toast({
          title: "Success",
          description: "Reminder added successfully"
        });
        
        // Update local state
        setReminders(prev => [...prev, createdReminder]);
      }
      
      // Reset form and close dialog
      resetForm();
      setFormOpen(false);
    } catch (error) {
      console.error("Error saving reminder:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save reminder"
      });
    }
  };
  
  const handleEdit = (reminder: Reminder) => {
    setCurrentReminder(reminder);
    setTitle(reminder.title);
    setDescription(reminder.description || "");
    
    // Convert Timestamp to Date if needed
    if (reminder.date instanceof Timestamp) {
      setDate(reminder.date.toDate());
    } else {
      setDate(new Date(reminder.date));
    }
    
    setEmail(reminder.email);
    
    setEditMode(true);
    setFormOpen(true);
  };
  
  const handleDelete = (reminder: Reminder) => {
    setCurrentReminder(reminder);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!currentReminder?.id) return;
    
    try {
      await deleteReminder(currentReminder.id);
      
      toast({
        title: "Success",
        description: "Reminder deleted successfully"
      });
      
      // Update local state
      setReminders(prev => prev.filter(reminder => reminder.id !== currentReminder.id));
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete reminder"
      });
    }
  };
  
  const handleSendNow = (reminder: Reminder) => {
    setCurrentReminder(reminder);
    setSendDialogOpen(true);
  };
  
  const confirmSendNow = async () => {
    if (!currentReminder) return;
    
    try {
      await sendReminderEmail(currentReminder);
      
      toast({
        title: "Success",
        description: "Reminder email sent successfully"
      });
      
      // Update local state to mark as sent
      setReminders(prev => 
        prev.map(reminder => 
          reminder.id === currentReminder.id 
            ? { ...reminder, reminderSent: true } 
            : reminder
        )
      );
      
      setSendDialogOpen(false);
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send reminder email"
      });
    }
  };
  
  const resetForm = () => {
    setCurrentReminder(null);
    setTitle("");
    setDescription("");
    setDate(new Date());
    if (user?.email) {
      setEmail(user.email);
    } else {
      setEmail("");
    }
    setEditMode(false);
  };
  
  // Sort reminders by date (nearest first)
  const sortedReminders = [...reminders].sort((a, b) => {
    const dateA = a.date instanceof Timestamp ? a.date.toDate().getTime() : new Date(a.date).getTime();
    const dateB = b.date instanceof Timestamp ? b.date.toDate().getTime() : new Date(b.date).getTime();
    return dateA - dateB;
  });
  
  // Check if a reminder is upcoming
  const isUpcoming = (date: Date | Timestamp) => {
    const reminderDate = date instanceof Timestamp ? date.toDate() : new Date(date);
    return !isBefore(reminderDate, new Date());
  };
  
  // Format "time until" string
  const getTimeUntil = (date: Date | Timestamp) => {
    const reminderDate = date instanceof Timestamp ? date.toDate() : new Date(date);
    
    if (isBefore(reminderDate, new Date())) {
      return "Past";
    }
    
    return formatDistance(reminderDate, new Date(), { addSuffix: true });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 gradient-text">Anniversary Reminders</h1>
        <p className="text-muted-foreground">
          Never forget important dates in your relationship
        </p>
      </div>
      
      <div className="mb-8 flex justify-end">
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-love hover:opacity-90 transition-opacity button-glow"
              onClick={() => {
                resetForm();
                setFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Reminder
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editMode ? "Edit Reminder" : "Add New Reminder"}</DialogTitle>
              <DialogDescription>
                {editMode 
                  ? "Update details of your anniversary reminder" 
                  : "Set up a reminder for an important date"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleFormSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="First Date Anniversary" 
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details about this special date..." 
                    className="resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">Reminder Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => setDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email for Reminder</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com" 
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setFormOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editMode ? "Update Reminder" : "Save Reminder"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {sortedReminders.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No reminders set</h3>
          <p className="text-muted-foreground mb-4">
            Create reminders for important dates and anniversaries in your relationship.
          </p>
          <Button 
            onClick={() => setFormOpen(true)}
            className="bg-gradient-love hover:opacity-90 transition-opacity"
          >
            <Plus className="mr-2 h-4 w-4" />
            Set Your First Reminder
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedReminders.map((reminder) => {
            const reminderDate = reminder.date instanceof Timestamp ? 
              reminder.date.toDate() : new Date(reminder.date);
            const upcoming = isUpcoming(reminderDate);
            
            return (
              <Card 
                key={reminder.id} 
                className={cn(
                  "transition-all hover:shadow-md",
                  upcoming ? "" : "opacity-70",
                  reminder.reminderSent ? "border-green-200 dark:border-green-800/40" : ""
                )}
              >
                <CardHeader className={cn(
                  "pb-2",
                  upcoming ? "bg-love-50/50 dark:bg-love-950/20" : "bg-muted/30"
                )}>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                      {reminder.title}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(reminder)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(reminder)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {format(reminderDate, "MMMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="py-4">
                  {reminder.description && (
                    <p className="text-sm mb-3">{reminder.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BellRing className="h-4 w-4 mr-1" />
                      <span>To: {reminder.email}</span>
                    </div>
                    <div className={cn(
                      "flex items-center text-sm font-medium",
                      upcoming ? "text-love-600 dark:text-love-400" : "text-muted-foreground"
                    )}>
                      <AlarmClock className="h-4 w-4 mr-1" />
                      <span>{getTimeUntil(reminderDate)}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className={cn(
                      "w-full", 
                      reminder.reminderSent ? "bg-green-500 hover:bg-green-600" : "bg-love-500 hover:bg-love-600"
                    )}
                    onClick={() => handleSendNow(reminder)}
                    disabled={reminder.reminderSent}
                  >
                    {reminder.reminderSent ? (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Reminder Sent
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Reminder Now
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Delete Confirm Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this reminder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Send Now Confirm Dialog */}
      <AlertDialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Reminder Now?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately send an email reminder to {currentReminder?.email}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmSendNow}
              className="bg-love-500 hover:bg-love-600"
            >
              Send Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnniversaryReminders;
