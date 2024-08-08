import axiosInstance from "@/api/api-client";
import { useMutation } from "@tanstack/react-query";

export const useAuth = () => {
	const {
		mutate: getAuthUrl,
		data,
		status,
		error,
	} = useMutation({
		mutationFn: async () => {
			return axiosInstance.get("/auth/github");
		},
	});

	return {
		getAuthUrl,
		data,
		status,
		error,
	};
};
