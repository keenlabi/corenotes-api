export interface IUser {
    email: String,
    password: String,
    phoneNumber: String,
    firstname: String,
    lastname: String,
    role: String,
    createdAt: Date,
    byEmail: Function
}