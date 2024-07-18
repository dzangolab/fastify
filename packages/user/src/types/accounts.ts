interface Account {
  id: string;
  organizationId: number;
  name: string;
  slug: string;
}

type AccountCreateInput = Partial<Omit<Account, "id">>;

type AccountUpdateInput = Partial<Omit<Account, "id" | "slug">>;

export type { Account, AccountCreateInput, AccountUpdateInput };
