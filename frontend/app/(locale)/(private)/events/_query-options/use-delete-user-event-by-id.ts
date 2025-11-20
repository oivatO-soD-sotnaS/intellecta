import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteUserEventById() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userEventId: string) => deleteUserEvent(userEventId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user", "events"]
            })
        },
    })
}


async function deleteUserEvent(userEventId: string) {
    const response = await fetch(`/api/me/events/${userEventId}`, {
        method: "DELETE",
    })

    return response.json();
}