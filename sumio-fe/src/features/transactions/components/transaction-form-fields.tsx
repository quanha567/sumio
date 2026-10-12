import type { CategoryDto } from "@sumio/contract";

import { SegmentedTabs, SelectField, Text, TextField } from "@/components/ui";

interface TransactionFormFieldsProps {
  selectedType: "income" | "expense";
  onTypeChange: (type: "income" | "expense") => void;
  currency: string;
  filteredCategories: CategoryDto[];
}

export function TransactionFormFields({
  selectedType,
  onTypeChange,
  currency,
  filteredCategories,
}: TransactionFormFieldsProps) {
  return (
    <>
      <div>
        <Text variant="caption" className="mb-1.5 block">
          Transaction Type
        </Text>
        <SegmentedTabs
          ariaLabel="Transaction Type"
          tabs={[
            { id: "expense", label: "Expense" },
            { id: "income", label: "Income" },
          ]}
          value={selectedType}
          onChange={onTypeChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          name="amount"
          type="number"
          step="any"
          min="0"
          placeholder="0.00"
          isRequired
          label={`Amount (${currency})`}
          rules={{
            required: "Valid amount is required",
            min: { value: 0.0001, message: "Valid amount is required" },
            valueAsNumber: true,
          }}
        />

        <TextField
          name="date"
          type="date"
          isRequired
          label="Date"
          rules={{ required: "Date is required" }}
        />
      </div>

      <SelectField
        name="categoryId"
        label="Category"
        isRequired
        placeholder={
          filteredCategories.length === 0 ? "No categories available" : "Select a category"
        }
        options={filteredCategories.map((c) => ({ id: c.id, label: c.name }))}
      />

      <TextField
        name="description"
        label="Description"
        placeholder="e.g. Grocery shopping, Lunch, Monthly salary"
      />
    </>
  );
}
