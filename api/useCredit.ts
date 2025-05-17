import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export const useGetPurchaseHistory = (id: string, queryKey: string) => {
  type PurchaseHistoryResponseType = InferResponseType<
    (typeof client.api.credit)[":id"]["$get"]
  >;

  const mutation = useQuery<PurchaseHistoryResponseType, Error>({
    queryKey: ["get-purchase-history", queryKey],
    queryFn: async () => {
      const response = await client.api.credit[":id"]["$get"]({
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
