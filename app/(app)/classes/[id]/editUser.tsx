"use client";

import { ExclamationTriangle, Pencil } from "react-bootstrap-icons";
import { editUser } from "./actions";
import { startTransition, useActionState, useEffect } from "react";

const initialState = {
  status: "",
  errors: [] as { path: string[]; message: string }[],
};

export default function EditUser({
  userData,
}: {
  userData: {
    id: string;
    name: string;
    lockerCode: string;
  };
}) {
  const [state, formAction, pending] = useActionState(editUser, initialState);

  useEffect(() => {
    if (state?.status === "success") {
      const modal = document.getElementById(
        `edit_user_modal_${userData.id}`
      ) as HTMLDialogElement | null;
      modal?.close();
      console.log("User updated successfully:", state.user);
    }
  }, [state, userData.id]);

  return (
    <>
      <dialog id={`edit_user_modal_${userData.id}`} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Edycja ucznia</h3>
          <form
            id={`edit_user_form_${userData.id}`}
            className="flex flex-col gap-4 mt-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              const formData = new FormData(ev.currentTarget);
              formData.append("id", userData.id);
              startTransition(() => formAction(formData));
            }}
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Imię i nazwisko</legend>
              <input
                name="name"
                type="text"
                className="input w-full"
                placeholder={userData.name}
                defaultValue={userData.name}
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
                  : "Imię i nazwisko ucznia, np. Jan Kowalski, Anna Nowak"}
              </p>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Numer szafki</legend>
              <input
                name="lockerCode"
                type="text"
                className="input w-full"
                placeholder={userData.lockerCode || "C100"}
                defaultValue={userData.lockerCode}
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
                      `edit_user_modal_${userData.id}`
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
        className="btn btn-sm btn-primary"
        onClick={() => {
          (
            document.getElementById(
              `edit_user_modal_${userData.id}`
            ) as HTMLDialogElement | null
          )?.showModal();
        }}
      >
        <Pencil className="inline-block" />
      </button>
    </>
  );
}
