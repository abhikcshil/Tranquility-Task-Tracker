import type { CategoryOption } from '@/services/taskService';

type CategorySelectProps = {
  categories: CategoryOption[];
  defaultValue?: number | null;
  className: string;
};

export function CategorySelect({
  categories,
  defaultValue = null,
  className,
}: CategorySelectProps) {
  const hasCategories = categories.length > 0;

  return (
    <>
      <select
        name="categoryId"
        defaultValue={defaultValue ? String(defaultValue) : ''}
        disabled={!hasCategories}
        className={className}
      >
        <option value="">{hasCategories ? 'Uncategorized' : 'No categories available'}</option>
        {categories.map((category) => (
          <option key={category.id} value={String(category.id)}>
            {category.name}
          </option>
        ))}
      </select>
      {!hasCategories ? (
        <p className="text-xs text-amber-300">No categories found. Run the database seed.</p>
      ) : null}
    </>
  );
}
