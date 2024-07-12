interface Organizations {
  id: string;
  billingAddress: string;
  name: string;
  schema: string;
  taxId: string;
  tenant: boolean;
  typeId: number;
}

type OrganizationsCreateInput = Partial<Omit<Organizations, "id">>;

type OrganizationsUpdateInput = Partial<
  Omit<Organizations, "id" | "name" | "schema" | "tenant">
>;

export type {
  Organizations,
  OrganizationsCreateInput,
  OrganizationsUpdateInput,
};
