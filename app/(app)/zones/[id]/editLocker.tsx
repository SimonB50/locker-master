"use client";

import { Pencil } from "react-bootstrap-icons";

export default function EditLocker({
  lockerData,
}: {
  lockerData: {
    id: string;
    code: string;
  };
}) {
  return (
    <>
      <dialog id={`edit_locker_modal_${lockerData.id}`} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Edycja szafki</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aby przypisać szafkę do ucznia, przejdź do strony klasy. Edycja
            numeru szafki nie jest możliwa - w przypadku zmiany numeru szafki,
            należy usunąć obecną i dodać nową.
          </p>
          <div className="flex flex-row items-center justify-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                (
                  document.getElementById(
                    `edit_locker_modal_${lockerData.id}`
                  ) as HTMLDialogElement | null
                )?.close()
              }
            >
              Zamknij
            </button>
          </div>
        </div>
      </dialog>
      <button
        className="btn btn-sm btn-primary"
        onClick={() => {
          (
            document.getElementById(
              `edit_locker_modal_${lockerData.id}`
            ) as HTMLDialogElement | null
          )?.showModal();
        }}
      >
        <Pencil className="inline-block" />
      </button>
    </>
  );
}
