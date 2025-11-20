import { CalendarEvent } from "@/components/event-calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUserEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userEvent: CalendarEvent) => updateUserEvent(userEvent),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user", "events"]
            })
        },
    })
}


async function updateUserEvent(userEvent: CalendarEvent) {
    const body = {
        title: userEvent.event.title,
        description: userEvent.event.description,
        event_start: userEvent.event.event_start,
        event_end: userEvent.event.event_end,
        event_type: userEvent.event.type
    }

    const response = await fetch(`/api/me/events/${userEvent.generic_event_id}`, {
        method: "PUT",
        body: JSON.stringify(body)
    })

    return response.json();
}