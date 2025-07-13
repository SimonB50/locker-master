"use client";

import { ExclamationTriangle, Pencil, Trash } from "react-bootstrap-icons";
import { editZone, deleteZone } from "./actions";
import { startTransition, useActionState, useEffect } from "react";

const initialState = {
  status: "",
  errors: [] as { path: string[]; message: string }[],
};

export default function EditZone({
  zoneData,
}: {
  zoneData: {
    id: string;
    name: string;
  };
}) {
  const [state, formAction, pending] = useActionState(editZone, initialState);
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteZone,
    initialState
  );

  useEffect(() => {
    if (state?.status != "success") return;
    const modal = document.getElementById(
      "edit_zone_modal"
    ) as HTMLDialogElement | null;
    modal?.close();
    console.log("Class created successfully:", state.class);
    const form = document.getElementById(
      "edit_zone_form"
    ) as HTMLFormElement | null;
    if (form) form.reset();
  }, [state]);

  return (
    <>
      <dialog id="edit_zone_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Edycja strefy</h3>
          <form
            id="edit_zone_form"
            className="flex flex-col gap-4 mt-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              const formData = new FormData(ev.currentTarget);
              formData.append("zoneId", zoneData.id);
              startTransition(() => formAction(formData));
            }}
          >
            <fieldset form="edit_zone" className="fieldset">
              <legend className="fieldset-legend">Nazwa strefy</legend>
              <input
                name="name"
                type="text"
                className="input w-full"
                placeholder={zoneData.name}
                defaultValue={zoneData.name}
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
                  : "Nazwa strefy opisująca jej lokalizację, np. Parter C"}
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
                      "edit_zone_modal"
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
                Zapisz
              </button>
            </div>
          </form>
          <div className="divider my-4"></div>
          <div className="collapse collapse-arrow">
            <input type="checkbox" />
            <div className="flex flex-row items-center justify-start gap-2 w-full collapse-title">
              <ExclamationTriangle className="size-6 text-error" />
              <span className="text-error">Niebezpieczna strefa</span>
            </div>
            <div className="collapse-content flex flex-col gap-4">
              <form
                className="flex flex-row justify-between items-center w-full gap-2"
                onSubmit={(ev) => {
                  ev.preventDefault();
                  const formData = new FormData(ev.currentTarget);
                  formData.append("zoneId", zoneData.id);
                  startTransition(() => deleteAction(formData));
                }}
              >
                <span className="label text-base">
                  Usuń strefę i wszystkie powiązane z nią dane
                </span>
                <button
                  type="submit"
                  className="btn btn-error text-base gap-2"
                  onClick={() =>
                    (
                      document.getElementById(
                        "delete_class_modal"
                      ) as HTMLDialogElement | null
                    )?.showModal()
                  }
                  disabled={deletePending}
                >
                  <Trash className="size-4" />
                  Usuń
                </button>
              </form>
              {deleteState?.status == "error" &&
                deleteState.errors!.some((e) => !e.path.length) && (
                  <div role="alert" className="alert alert-error alert-soft">
                    <ExclamationTriangle className="size-6" />
                    <span>
                      {deleteState.errors!.find((e) => !e.path.length)?.message}
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </dialog>
      <button
        className="btn btn-error text-lg gap-2 w-full md:w-auto"
        onClick={() =>
          (
            document.getElementById(
              "edit_zone_modal"
            ) as HTMLDialogElement | null
          )?.showModal()
        }
      >
        <Pencil className="size-6" />
        Edytuj
      </button>
    </>
  );
}
