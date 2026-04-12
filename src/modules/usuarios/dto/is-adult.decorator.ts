import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isAdult', async: false })
export class IsAdultConstraint implements ValidatorConstraintInterface {
    validate(fechaNacimiento: any) {
        if (!(fechaNacimiento instanceof Date) && isNaN(Date.parse(fechaNacimiento))) return false;

        const fecha = new Date(fechaNacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fecha.getFullYear();
        const mes = hoy.getMonth() - fecha.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
            edad--;
        }
        return edad >= 18; // Retorna true si es mayor o igual a 18
    }

    defaultMessage() {
        return 'El usuario debe ser mayor de edad (18 años).';
    }
}

export function IsAdult(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsAdultConstraint,
        });
    };
}
