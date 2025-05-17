import { client } from "@/lib/rpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

export const useCheckApiConfiguration = (id: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api.account)["check-api-configuration"][":userId"]["$get"]
  >;

  const mutation = useQuery<ResponseType, Error>({
    queryKey: ["check-api-configuration"],
    queryFn: async () => {
      const response = await client.api.account["check-api-configuration"][
        ":userId"
      ]["$get"]({
        param: { userId: id },
      });
      return await response.json();
    },
  });

  return mutation;
};

export const useSetApiKey = () => {
  type ResponseType = InferResponseType<
    (typeof client.api.account)["api-key"]["$post"]
  >;

  type RequestType = InferRequestType<
    (typeof client.api.account)["api-key"]["$post"]
  >;

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ["set-api-key"],
    mutationFn: async (data) => {
      const response = await client.api.account["api-key"]["$post"](data);
      return await response.json();
    },
  });

  return mutation;
};
