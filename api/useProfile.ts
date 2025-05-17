import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type ProfileResponseType = InferResponseType<
  (typeof client.api.profile)[":id"]["$get"]
>;

export const useGetProfile = (id: string, queryKey: string) => {
  console.log("id from useGetProfile", id);
  const mutation = useQuery<ProfileResponseType, Error>({
    queryKey: ["get-profile", queryKey],
    queryFn: async () => {
      const response = await client.api.profile[":id"]["$get"]({
        param: { id },
      });
      return await response.json();
    },
  });

  return mutation;
};

// export const useUpdateProfile = () => {
//   type ResponseType = InferResponseType<
//     (typeof client.api.profile)[":id"]["$put"]
//   >;

//   type RequestType = InferRequestType<
//     (typeof client.api.profile)[":id"]["$put"]
//   >;

//   const mutation = useMutation<ResponseType, Error, RequestType>({
//     mutationKey: ["update-profile"],
//     mutationFn: async (data) => {
//       const response = await client.api.profile[":id"]["$put"](data);
//       return await response.json();
//     },
//   });

//   return mutation;
// };
