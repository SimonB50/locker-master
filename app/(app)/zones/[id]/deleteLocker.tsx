"use client";

import { ExclamationTriangle, Trash } from "react-bootstrap-icons";
import { deleteLocker } from "./actions";
import { startTransition, useActionState, useEffect } from "react";

const initialState = {
  status: "",
  errors: [] as { path: string[]; message: string }[],
};

export default function DeleteUser({ lockerId }: { lockerId: string }) {
  const [state, formAction, pending] = useActionState(deleteLocker, initialState);

  useEffect(() => {
    if (state?.status === "success") {
      const modal = document.getElementById(
        `delete_lockers_modal_${lockerId}`
      ) as HTMLDialogElement | null;
      modal?.close();
      console.log("Locker deleted successfully");
    }
  }, [state, lockerId]);

  return (
    <>
      <dialog id={`delete_lockers_modal_${lockerId}`} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Usuń szafkę</h3>
          <p className="mt-2">
            Czy na pewno chcesz usunąć tą szafkę? Ta operacja jest
            nieodwracalna.
          </p>
          {state?.status == "error" &&
            state.errors!.some((e) => !e.path.length) && (
              <div role="alert" className="alert alert-error alert-soft mt-2">
                <ExclamationTriangle className="size-6" />
                <span>
                  {state.errors!.find((e) => !e.path.length)?.message}
                </span>
              </div>
            )}
          <form
            id={`delete_lockers_form_${lockerId}`}
            className="flex flex-col gap-4 mt-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              const formData = new FormData(ev.currentTarget);
              formData.append("id", lockerId);
              startTransition(() => formAction(formData));
            }}
          >
            <div className="flex flex-row items-center justify-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  (
                    document.getElementById(
                      `delete_lockers_modal_${lockerId}`
                    ) as HTMLDialogElement | null
                  )?.close()
                }
                disabled={pending}
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="btn btn-error"
                disabled={pending}
              >
                Usuń
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <button
        className="btn btn-sm btn-error"
        onClick={() => {
          (
            document.getElementById(
              `delete_lockers_modal_${lockerId}`
            ) as HTMLDialogElement | null
          )?.showModal();
        }}
      >
        <Trash className="inline-block" />
      </button>
    </>
  );
}
