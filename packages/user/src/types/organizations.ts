interface Organization {
  id: string;
  billingAddress: string;
  name: string;
  schema: string;
  taxId: string;
  tenant: boolean;
  typeId: number;
}

type OrganizationCreateInput = Partial<Omit<Organization, "id">>;

type OrganizationUpdateInput = Partial<
  Omit<Organization, "id" | "name" | "schema" | "tenant">
>;

export type { Organization, OrganizationCreateInput, OrganizationUpdateInput };
