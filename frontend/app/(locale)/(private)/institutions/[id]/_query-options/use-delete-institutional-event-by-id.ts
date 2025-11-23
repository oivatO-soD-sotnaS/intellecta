import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteInstitutionalEventById(
    institutionId: string
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userEventId: string) => deleteInstitutionalEvent(userEventId, institutionId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["institutional", institutionId, "events"]
            })
        },
    })
}


async function deleteInstitutionalEvent(userEventId: string, institutionId: string) {
    const response = await fetch(`/api/institutions/${institutionId}/events/${userEventId}`, {
        method: "DELETE",
    })

    return response.json();
}