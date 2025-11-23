import { CalendarEvent } from "@/components/event-calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateInstitutionalEvent(
    institutionId: string
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userEvent: CalendarEvent) => updateInstitutionalEvent(userEvent, institutionId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["institutional", institutionId, "events"]
            })
        },
    })
}


async function updateInstitutionalEvent(userEvent: CalendarEvent, institutionId: string) {
    const body = {
        title: userEvent.event.title,
        description: userEvent.event.description,
        event_start: userEvent.event.event_start,
        event_end: userEvent.event.event_end,
        event_type: userEvent.event.type
    }

    const response = await fetch(`/api/institutions/${institutionId}/events/${userEvent.generic_event_id}`, {
        method: "PUT",
        body: JSON.stringify(body)
    })

    return response.json();
}