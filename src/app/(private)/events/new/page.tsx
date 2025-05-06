import EventForm from "@/components/forms/EventForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewEventsPage() {
  return (
    <Card className='max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <EventForm />
      </CardContent>
    </Card>
  );
}
