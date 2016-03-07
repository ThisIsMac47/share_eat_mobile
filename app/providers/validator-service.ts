import {Validators, ControlGroup} from 'angular2/common'

export class ValidationService {

    static phoneValidator(control) {
      // French or International phone number reegx
      if (control.value.match('(0|\\+33|0033)[1-9][0-9]{8}')) {
          return null;
      } else {
          return { 'invalidPhone': true };
      }
    }

    static creditCardValidator(control) {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
            return null;
        } else {
            return { 'invalidCreditCard': true };
        }
    }

    static emailValidator(control) {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static passwordValidator(control) {
        // {6,100}           - Assert password is between 8 and 100 characters
        if (control.value.match(/^[a-zA-Z0-9!@#$%^&*]{8,30}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }

    static matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
      return (group: ControlGroup): {[key: string]: any} => {
        let password = group.controls[passwordKey];
        let confirmPassword = group.controls[confirmPasswordKey];

        if (password.value !== confirmPassword.value) {
          return { mismatchedPasswords: true };
        }
      }
    }
}
