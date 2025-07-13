"use client";

import { ExclamationTriangle, Plus } from "react-bootstrap-icons";
import { createClass } from "./actions";
import { startTransition, useActionState, useEffect } from "react";

const initialState = {
  status: "",
  errors: [] as { path: string[]; message: string }[],
};

export default function AddZone({
  availableUnits,
}: {
  availableUnits: { id: string; name: string; }[];
}) {
  const [state, formAction, pending] = useActionState(
    createClass,
    initialState
  );

  useEffect(() => {
    if (state?.status != "success") return;
    const modal = document.getElementById(
      "add_zone_modal"
    ) as HTMLDialogElement | null;
    modal?.close();
    console.log("Class created successfully:", state.class);
    const form = document.getElementById(
      "add_zone_form"
    ) as HTMLFormElement | null;
    if (form) form.reset();
  }, [state]);

  return (
    <>
      <dialog id="add_zone_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Dodawanie nowej klasy</h3>
          <form
            id="add_zone_form"
            className="flex flex-col gap-4 mt-4"
            onSubmit={(ev) => {
              ev.preventDefault();
              startTransition(() => formAction(new FormData(ev.currentTarget)));
            }}
          >
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Nazwa strefy</legend>
              <input
                name="name"
                type="text"
                className="input w-full"
                placeholder="Łącznik B-C"
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
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Jednostka</legend>
              <select
                name="unitId"
                className="select w-full"
                defaultValue="default"
              >
                <option value="default" disabled>
                  Wybierz jednostkę
                </option>
                {availableUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} [{unit.id.split("-")[0]}]
                  </option>
                ))}
              </select>
              <span
                className={`label ${
                  state?.status == "error" &&
                  state.errors!.find((e) => e.path.includes("unitId"))
                    ? "text-error"
                    : ""
                }`}
              >
                {state?.status == "error" &&
                state.errors!.find((e) => e.path.includes("unitId"))
                  ? state.errors!.find((e) => e.path.includes("unitId"))!
                      .message
                  : "Jednostka, do której ma zostać przypisana utworzona strefa"}
              </span>
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
                      "add_zone_modal"
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
              "add_zone_modal"
            ) as HTMLDialogElement | null
          )?.showModal()
        }
      >
        <Plus className="size-8" />
        Określ strefę
      </button>
    </>
  );
}
