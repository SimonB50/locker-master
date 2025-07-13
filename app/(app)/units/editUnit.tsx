"use client";

import { ExclamationTriangle, Pencil } from "react-bootstrap-icons";
import { editUnit } from "./actions";
import { startTransition, useActionState, useEffect } from "react";

const initialState = {
  status: "",
  errors: [] as { path: string[]; message: string }[],
};

export default function EditUnit({
  unitData,
}: {
  unitData: {
    id: string;
    name: string;
  };
}) {
  const [state, formAction, pending] = useActionState(editUnit, initialState);

  useEffect(() => {
    if (state?.status === "success") {
      const modal = document.getElementById(
        `edit_unit_modal_${unitData.id}`
      ) as HTMLDialogElement | null;
      modal?.close();
      console.log("User updated successfully:", state.unit);
    }
  }, [state, unitData.id]);

  return (
    <>
      <dialog id={`edit_unit_modal_${unitData.id}`} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Edycja jednostki</h3>
          <form
            id={`edit_unit_form_${unitData.id}`}
            className="flex flex-col gap-4 mt-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              const formData = new FormData(ev.currentTarget);
              formData.append("id", unitData.id);
              startTransition(() => formAction(formData));
            }}
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Nazwa jednostki</legend>
              <input
                name="name"
                type="text"
                className="input w-full"
                placeholder={unitData.name}
                defaultValue={unitData.name}
              />
              <p
                className={`label ${
                  state?.status == "error" &&
                  state.errors!.find((e) => e.path.includes("name"))
                    ? "text-error"
                    : ""
                }`}
              >
                {state?.status == "error" &&
                state.errors!.find((e) => e.path.includes("name"))
                  ? state.errors!.find((e) => e.path.includes("name"))!.message
                  : "Nazwa jednostki np. Szkoła Podstawowa, Liceum"}
              </p>
            </fieldset>
            {state?.status == "error" &&
              state.errors!.some((e) => !e.path.length) && (
                <div role="alert" className="alert alert-error alert-soft">
                  <ExclamationTriangle className="size-6" />
                  <span>
                    {state.errors!.find((e) => !e.path.length)?.message}
                  </span>
                </div>
              )}
            <div className="flex flex-row items-center justify-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  (
                    document.getElementById(
                      `edit_unit_modal_${unitData.id}`
                    ) as HTMLDialogElement | null
                  )?.close()
                }
                disabled={pending}
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={pending}
              >
                Edytuj
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <button
        className="btn btn-primary"
        onClick={() => {
          (
            document.getElementById(
              `edit_unit_modal_${unitData.id}`
            ) as HTMLDialogElement | null
          )?.showModal();
        }}
      >
        <Pencil className="inline-block" />
      </button>
    </>
  );
}
