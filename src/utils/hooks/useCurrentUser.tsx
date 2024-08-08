import axiosInstance from "@/api/api-client";
import type { UserInterface } from "@/types/entities";
import type { statusType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export type UseCurrentUserReturnType = {
    user: UserInterface | undefined,
    status: statusType
}

export const useCurrentUser = (): UseCurrentUserReturnType => {
    const { data, status } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            return axiosInstance.get("/users/me")
        },
        staleTime: 5 * (60 * 1000),
        gcTime: 10 * (60 * 1000),
        refetchOnWindowFocus: true,
    })
    return { user: data?.data.data, status }
}