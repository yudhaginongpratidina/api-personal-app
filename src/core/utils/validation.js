export default class Validation {
    static validate(schema, data) {
        return schema.parse(data);
    }
}