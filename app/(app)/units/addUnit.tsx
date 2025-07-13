"use client";

import { ExclamationTriangle, Plus } from "react-bootstrap-icons";
import { createUnit } from "./actions";
import { startTransition, useActionState, useEffect } from "react";

const initialState = {
  status: "",
  errors: [] as { path: string[]; message: string }[],
};

export default function AddUnit() {
  const [state, formAction, pending] = useActionState(createUnit, initialState);

  useEffect(() => {
    if (state?.status != "success") return;
    const modal = document.getElementById(
      "add_unit_modal"
    ) as HTMLDialogElement | null;
    modal?.close();
    console.log("Unit created successfully:", state.unit);
    const form = document.getElementById(
      "add_unit_form"
    ) as HTMLFormElement | null;
    if (form) form.reset();
  }, [state]);

  return (
    <>
      <dialog id="add_unit_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Tworzenie nowej jednostki</h3>
          <form
            id="add_unit_form"
            className="flex flex-col gap-4 mt-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              startTransition(() => formAction(new FormData(ev.currentTarget)));
            }}
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Nazwa jednostki</legend>
              <input
                name="name"
                type="text"
                className="input w-full"
                placeholder="Liceum"
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
                      "add_unit_modal"
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
                Utwórz
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <button
        className="btn btn-primary text-lg gap-2 w-full md:w-auto"
        onClick={() =>
          (
            document.getElementById(
              "add_unit_modal"
            ) as HTMLDialogElement | null
          )?.showModal()
        }
      >
        <Plus className="size-8" />
        Utwórz jednostkę
      </button>
    </>
  );
}
