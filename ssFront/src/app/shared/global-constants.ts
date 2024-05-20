import { AbstractControl, ValidatorFn } from "@angular/forms";

export class GlobalConstants {
    // Meesage
    public static genericError: string = "Something went wrong. pleases try again later";

    //Regex
    public static nameRegex: string = "[a-zA-Z0-9 ]*";

    public static emailRegex: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

    public static productExistError: string = "Product already exists";
    
    public static productAdded: string = "Product added successfully";

    public static contactNumberRegex: string = "^[e0-9]{10,10}$";

    // public static NumberRegex: number = {};
    public static unauthroized: string = "You are not authorized person to access this page.";
    //Variable
    public static error: string = "error";

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
