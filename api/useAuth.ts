import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

export const useSignup = () => {
  type ResponseType = InferResponseType<(typeof client.api.signup)["$post"]>;

  type RequestType = InferRequestType<(typeof client.api.signup)["$post"]>;

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ["signup"],
    mutationFn: async (data) => {
      const response = await client.api.signup.$post(data);
      return await response.json();
    },
  });

  return mutation;
};
