import { Component } from "solid-js";

export type ConfirmationDialogProps = {
  callback: () => void,
  modalId: string,
  action: string,
  message: string,
}

const ConfirmationDialog: Component<ConfirmationDialogProps> = (props) => {
  return (
    <dialog id={props.modalId} class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <p class="text-lg text-left">{props.message}</p>
        <div class="modal-action">
          <button class="btn btn-error" onClick={props.callback}>{props.action}</button>
          <form method="dialog">
            <button class="btn">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmationDialog;