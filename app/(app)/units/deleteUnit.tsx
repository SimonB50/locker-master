"use client";

import { ExclamationTriangle, Trash } from "react-bootstrap-icons";
import { deleteUnit } from "./actions";
import { startTransition, useActionState, useEffect } from "react";

const initialState = {
  status: "",
  errors: [] as { path: string[]; message: string }[],
};

export default function DeleteUnit({ unitId }: { unitId: string }) {
  const [state, formAction, pending] = useActionState(deleteUnit, initialState);

  useEffect(() => {
    if (state?.status === "success") {
      const modal = document.getElementById(
        `delete_unit_modal_${unitId}`
      ) as HTMLDialogElement | null;
      modal?.close();
      console.log("Unit deleted successfully");
    }
  }, [state, unitId]);

  return (
    <>
      <dialog id={`delete_unit_modal_${unitId}`} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Usuń jednostkę</h3>
          <p className="mt-2">
            Czy na pewno chcesz usunąć tą jednostkę? Ta operacja jest
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
            id={`delete_unit_form_${unitId}`}
            className="flex flex-col gap-4 mt-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              const formData = new FormData(ev.currentTarget);
              formData.append("id", unitId);
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
                      `delete_unit_modal_${unitId}`
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
        className="btn btn-error"
        onClick={() => {
          (
            document.getElementById(
              `delete_unit_modal_${unitId}`
            ) as HTMLDialogElement | null
          )?.showModal();
        }}
      >
        <Trash className="inline-block" />
      </button>
    </>
  );
}
