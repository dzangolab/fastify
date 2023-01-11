export type User = {
    given_name: string;
    id: string;
    middle_names?: string;
    surname?: string;
};
export type UserInput = Omit<User, "id">;
//# sourceMappingURL=types.d.ts.map