"use client";

import { ExclamationTriangle, Plus } from "react-bootstrap-icons";
import { createLocker } from "./actions";
import { startTransition, useActionState, useEffect } from "react";

const initialState = {
  status: "",
  errors: [] as { path: string[]; message: string }[],
};

export default function AddLocker({ zoneId }: { zoneId: string }) {
  const [state, formAction, pending] = useActionState(
    createLocker,
    initialState
  );

  useEffect(() => {
    if (state?.status != "success") return;
    const modal = document.getElementById(
      "add_locker_modal"
    ) as HTMLDialogElement | null;
    modal?.close();
    console.log("Lockers created successfully:", state.lockers);
    const form = document.getElementById(
      "add_locker_form"
    ) as HTMLFormElement | null;
    if (form) form.reset();
  }, [state]);

  return (
    <>
      <dialog id="add_locker_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Tworzenie nowej szafki</h3>
          <form
            id="add_locker_form"
            className="flex flex-col gap-4 mt-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              const formData = new FormData(ev.currentTarget);
              formData.append("zoneId", zoneId);
              startTransition(() => formAction(formData));
            }}
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Numer szafki</legend>
              <input
                name="code"
                type="text"
                className="input w-full"
                placeholder="C100"
              />
              <p
                className={`label ${
                  state?.status == "error" &&
                  state.errors!.find((e) => e.path.includes("code"))
                    ? "text-error"
                    : ""
                }`}
              >
                {state?.status == "error" &&
                state.errors!.find((e) => e.path.includes("code"))
                  ? state.errors!.find((e) => e.path.includes("code"))!.message
                  : "Numer szafki do zarejestrowania. Może zawierać litery i cyfry."}
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
                      "add_locker_modal"
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
              "add_locker_modal"
            ) as HTMLDialogElement | null
          )?.showModal()
        }
      >
        <Plus className="size-8" />
        Nowa szafka
      </button>
    </>
  );
}
