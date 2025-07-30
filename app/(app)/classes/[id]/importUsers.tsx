"use client";

import { Download, ExclamationTriangle } from "react-bootstrap-icons";
import { importUsers } from "./actions";
import { startTransition, useActionState, useEffect } from "react";

const initialState = {
  status: "",
  errors: [] as { path: string[]; message: string }[],
};

export default function ImportUsers({ classId }: { classId: string }) {
  const [state, formAction, pending] = useActionState(importUsers, initialState);

  useEffect(() => {
    if (state?.status != "success") return;
    const modal = document.getElementById(
      "import_users_modal"
    ) as HTMLDialogElement | null;
    modal?.close();
    console.log("Users created successfully:", state.message);
    const form = document.getElementById(
      "import_users_form"
    ) as HTMLFormElement | null;
    if (form) form.reset();
  }, [state]);

  return (
    <>
      <dialog id="import_users_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Importowanie uczniów</h3>
          <form
            id="import_users_form"
            className="flex flex-col gap-4 mt-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              const formData = new FormData(ev.currentTarget);
              formData.append("classId", classId);
              startTransition(() => formAction(formData));
            }}
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Plik importu</legend>
              <input name="file" type="file" accept=".csv" className="file-input w-full" />
              <p
                className={`label ${
                  state?.status == "error" &&
                  state.errors!.find((e) => e.path.includes("file"))
                    ? "text-error"
                    : ""
                }`}
              >
                {state?.status == "error" &&
                state.errors!.find((e) => e.path.includes("file"))
                  ? state.errors!.find((e) => e.path.includes("file"))!.message
                  : "Plik importu w formacie CSV"}
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
                      "import_users_modal"
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
                Importuj
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <button
        className="btn btn-success text-lg gap-2 w-full md:w-auto"
        onClick={() =>
          (
            document.getElementById(
              "import_users_modal"
            ) as HTMLDialogElement | null
          )?.showModal()
        }
      >
        <Download className="size-6" />
        Importuj
      </button>
    </>
  );
}
