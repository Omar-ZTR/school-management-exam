import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class GlobalConstants {
    // Meesage
    public static genericError: string = "Something went wrong. pleases try again later";

    //Regex
    public static nameRegex: string = "[a-zA-Z0-9 ]*";

    public static emailRegex: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

    public static productExistError: string = "Product already exists";
    
  

    public static contactNumberRegex: string = "^[e0-9]{10,10}$";

    // public static NumberRegex: number = {};
    public static unauthroized: string = "You are not authorized person to access this page.";
    //Variable
    public static error: string = "error";
    public static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        if (!control || !control.parent) {
          return null;
        }
    
        const password = control.parent.get('Password');
        const rePassword = control;
    console.log("rePassword re re ",rePassword)
        if (!password || !rePassword) {
          return null;
        }
        console.log("password re re ",password.value === rePassword.value)
        return password.value === rePassword.value ? null : { mismatch: true };
      }
      // Validator to check if the date is at least 18 years ago
      public static minimumAgeValidator(minAge: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
          const birthday = new Date(control.value);
          const today = new Date();
          let age = today.getFullYear() - birthday.getFullYear();
          const monthDifference = today.getMonth() - birthday.getMonth();
    
          if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthday.getDate())) {
            age--;
          }
    
          return age >= minAge ? null : { 'underage': true };
        };
      }
    
}

export function rangeNumber(a: number, b: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const noteValue = control.value;
        if (isNaN(noteValue) || noteValue < a || noteValue > b) {
            return { 'msg': `${a}-${b}` }; // Changed error keys to 'min' and 'max'
        }
        return null;
    };
}

