import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { useEditTransaction } from "../api/use-edit-transaction";
import { insertTrasactionSchema } from "@/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useConfirm } from "@/hooks/use-confirm";
import { z } from "zod";

import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { Loader2 } from "lucide-react";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetTransaction } from "../api/use-get-transaction";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";
const formSchema = insertTrasactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();

  const [CormationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction."
  );

  const editTransactionMutation = useEditTransaction(id);

  const transactionQuery = useGetTransaction(id);

  const categoryQuery = useGetCategories();

  const categoryMutation = useCreateCategory();

  const deleteMutation = useDeleteTransaction(id);

  const onCrateCategory = (name: string) =>
    categoryMutation.mutate({
      name,
    });

  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountQuery = useGetAccounts();

  const accountMutation = useCreateAccount();

  const onCreateAccount = (name: string) =>
    accountMutation.mutate({
      name,
    });

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    editTransactionMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending ||
    deleteMutation.isPending;

  const isLoading =
    categoryQuery.isLoading ||
    accountQuery.isLoading ||
    transactionQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editTransactionMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(
        { param: { id: "" } },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  console.log(transactionQuery.data);
  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
      }
    : {
        date: new Date(),
        categoryId: "",
        notes: "",
        accountId: "",
        amount: "",
        payee: "",
      };

  return (
    <>
      <CormationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Tranaction</SheetTitle>
            <SheetDescription>Edit Transaction</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div>
              <Loader2
                className="size-4 
                         text-muted-foreground  
                         animate-spin"
              />
            </div>
          ) : (
            <TransactionForm
              key={id}
              id={id}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCrateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
