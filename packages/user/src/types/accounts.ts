interface Accounts {
  id: string;
  organizationId: number;
  name: string;
  slug: string;
}

type AccountsCreateInput = Partial<Omit<Accounts, "id">>;

type AccountsUpdateInput = Partial<Omit<Accounts, "id" | "slug">>;

export type { Accounts, AccountsCreateInput, AccountsUpdateInput };
