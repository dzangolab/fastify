interface Organizations {
  id: string;
  disabled: boolean;
  email: string;
  lastLoginAt: number;
  roles?: string[];
  signedUpAt: number;
}

type OrganizationsCreateInput = Partial<
  Omit<Organizations, "disabled" | "lastLoginAt" | "roles" | "signedUpAt">
> & {
  lastLoginAt?: string;
  signedUpAt?: string;
};

type OrganizationsUpdateInput = Partial<
  Omit<Organizations, "id" | "email" | "lastLoginAt" | "roles" | "signedUpAt">
> & {
  lastLoginAt?: string;
};

export type {
  Organizations,
  OrganizationsCreateInput,
  OrganizationsUpdateInput,
};
