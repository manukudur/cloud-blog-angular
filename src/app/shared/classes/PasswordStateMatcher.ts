import { ErrorStateMatcher } from "@angular/material/core";
import { FormControl, NgForm, FormGroupDirective } from "@angular/forms";

export class PasswordStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(
      control &&
      control.invalid &&
      control.parent.dirty &&
      control.touched
    );
    const invalidParent = !!(
      control &&
      control.parent &&
      control.parent.invalid &&
      control.parent.dirty &&
      control.touched
    );

    return invalidCtrl || invalidParent;
  }
}
