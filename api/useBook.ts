import { client } from "@/lib/rpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

export const useGetBook = (id: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api.book)[":id"]["$get"]
  >;

  const mutation = useQuery<ResponseType, Error>({
    queryKey: ["get-book", id],
    queryFn: async () => {
      const response = await client.api.book[":id"]["$get"]({
        param: { id },
      });
      return await response.json();
    },
  });

  return mutation;
};

export const useExportBook = () => {
  type ResponseType = InferResponseType<
    (typeof client.api.book)["export-book"]["$post"]
  >;

  type RequestType = InferRequestType<
    (typeof client.api.book)["export-book"]["$post"]
  >;

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ["generate-book"],
    mutationFn: async (data) => {
      const response = await client.api.book["export-book"]["$post"](data);
      return await response.blob();
    },
  });

  return mutation;
};

export const useGetBooks = (id: string) => {
  type ResponseType = InferResponseType<
    (typeof client.api.book)["all-books"][":userId"]["$get"]
  >;

  const mutation = useQuery<ResponseType, Error>({
    queryKey: ["get-books"],
    queryFn: async () => {
      const response = await client.api.book["all-books"][":userId"]["$get"]({
        param: { userId: id },
      });
      return await response.json();
    },
  });

  return mutation;
};

export const useGenerateBook = () => {
  type ResponseType = InferResponseType<
    (typeof client.api.book.generate)["$post"]
  >;

  type RequestType = InferRequestType<
    (typeof client.api.book.generate)["$post"]
  >;

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ["generate-book"],
    mutationFn: async (data) => {
      const response = await client.api.book.generate["$post"](data);
      return await response.json();
    },
  });

  return mutation;
};

export const useGenerateBookChapter = () => {
  type ResponseType = InferResponseType<
    (typeof client.api.book)["generate-book-chapter-content"][":bookId"]["$put"]
  >;

  type RequestType = InferRequestType<
    (typeof client.api.book)["generate-book-chapter-content"][":bookId"]["$put"]
  >;

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ["generate-book-chapter"],
    mutationFn: async (data) => {
      const response = await client.api.book["generate-book-chapter-content"][
        ":bookId"
      ]["$put"](data);
      return await response.json();
    },
  });

  return mutation;
};
