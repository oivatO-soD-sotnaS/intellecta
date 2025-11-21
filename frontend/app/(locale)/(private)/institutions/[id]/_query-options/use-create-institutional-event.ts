import { CalendarEvent } from "@/components/event-calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateInstitutionalEvent(
    institutionId: string
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userEvent: CalendarEvent) => createInstitutionalEvent(userEvent, institutionId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["institutional", institutionId, "events"]
            })
        },
    })
}


async function createInstitutionalEvent(userEvent: CalendarEvent, institutionId: string) {
    const body = {
        title: userEvent.event.title,
        description: userEvent.event.description,
        event_start: userEvent.event.event_start,
        event_end: userEvent.event.event_end,
        event_type: userEvent.event.type
    }
    
    const response = await fetch(`/api/institutions/${institutionId}/events`, {
        method: "POST",
        body: JSON.stringify(body)
    })
    
    return response.json();
}