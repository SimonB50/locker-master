"use client";

import { startTransition, useActionState, useEffect } from "react";
import { validateLogin } from "./actions";
import { ExclamationTriangle } from "react-bootstrap-icons";
import { redirect } from "next/navigation";

export default function AuthPage() {
  const [state, formAction, pending] = useActionState(validateLogin, 0);

  useEffect(() => {
    if (state != 2) return;
    const form = document.getElementById(
      "login_form"
    ) as HTMLFormElement | null;
    console.log("Logged in successfully!");
    if (form) form.reset();
    redirect("/");
  }, [state]);

  return (
    <form
      id="login_form"
      onSubmit={(ev) => {
        ev.preventDefault();
        startTransition(() => formAction(new FormData(ev.currentTarget)));
      }}
    >
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Logowanie</legend>

        <label className="label">Hasło</label>
        <input
          type="password"
          name="password"
          className="input"
          placeholder="Password"
        />
        <p className="label">
          Wpisz hasło do systemu podane przez administratora
        </p>

        {state == 1 && (
          <div role="alert" className="alert alert-error alert-soft">
            <ExclamationTriangle className="size-6" />
            <span>Nieprawidlowe hasło!</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-neutral mt-2"
          disabled={pending}
        >
          Zaloguj
        </button>
      </fieldset>
    </form>
  );
}
