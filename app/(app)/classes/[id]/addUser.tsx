"use client";

import { ExclamationTriangle, Plus } from "react-bootstrap-icons";
import { createUser } from "./actions";
import { startTransition, useActionState, useEffect } from "react";

const initialState = {
  status: "",
  errors: [] as { path: string[]; message: string }[],
};

export default function AddUser({ classId }: { classId: string }) {
  const [state, formAction, pending] = useActionState(
    createUser,
    initialState
  );

  useEffect(() => {
    if (state?.status != "success") return;
    const modal = document.getElementById(
      "add_user_modal"
    ) as HTMLDialogElement | null;
    modal?.close();
    console.log("User created successfully:", state.user);
    const form = document.getElementById(
      "add_user_form"
    ) as HTMLFormElement | null;
    if (form) form.reset();
  }, [state]);

  return (
    <>
      <dialog id="add_user_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Rejestracja nowego ucznia</h3>
          <form
            id="add_user_form"
            className="flex flex-col gap-4 mt-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              const formData = new FormData(ev.currentTarget);
              formData.append("classId", classId);
              startTransition(() => formAction(formData));
            }}
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Imię i nazwisko</legend>
              <input
                name="name"
                type="text"
                className="input w-full"
                placeholder="Szymon Banach"
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
                  : "Imię i nazwisko ucznia, np. Jan Kowalski lub Jan Nowak-Nowicki"}
              </p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Numer szafki</legend>
              <input
                name="lockerCode"
                type="text"
                className="input w-full"
                placeholder="C100"
              />
              <p
                className={`label ${
                  state?.status == "error" &&
                  state.errors!.find((e) => e.path.includes("lockerCode"))
                    ? "text-error"
                    : ""
                }`}
              >
                {state?.status == "error" &&
                state.errors!.find((e) => e.path.includes("lockerCode"))
                  ? state.errors!.find((e) => e.path.includes("lockerCode"))!
                      .message
                  : "Numer szafki ucznia zarejestrowanej w systemie, np. C100"}
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
                      "add_user_modal"
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
              "add_user_modal"
            ) as HTMLDialogElement | null
          )?.showModal()
        }
      >
        <Plus className="size-8" />
        Nowy uczeń
      </button>
    </>
  );
}
