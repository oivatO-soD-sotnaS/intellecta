import { CalendarEvent } from "@/components/event-calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateUserEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userEvent: CalendarEvent) => createUserEvent(userEvent),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user", "events"]
            })
        },
    })
}


async function createUserEvent(userEvent: CalendarEvent) {
    const body = {
        title: userEvent.event.title,
        description: userEvent.event.description,
        event_start: userEvent.event.event_start,
        event_end: userEvent.event.event_end,
        event_type: userEvent.event.type
    }

    const response = await fetch(`/api/me/events`, {
        method: "POST",
        body: JSON.stringify(body)
    })

    return response.json();
}