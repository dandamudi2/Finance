import { InferRequestType,InferResponseType } from "hono";

import { useMutation,useQuery,useQueryClient} from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAccount =(id?:string)=>{

    const queryClient = useQueryClient();

    const mutation =useMutation<
    ResponseType,
    Error,
    RequestType
    >({
        mutationFn: async (json )=>{
            const response = await client.api.accounts[":id"]["$delete"]({
                 param:{id},
                });
            return await response.json();
        },
        onSuccess :()=>{
            toast.success("Account deleted");
            queryClient.invalidateQueries({queryKey:["account",{id}]})
            queryClient.invalidateQueries({queryKey:["accounts"]})
        },
        onError:()=>{
            toast.error("Failed to delete account!");
        }


    })

    return mutation;
}
