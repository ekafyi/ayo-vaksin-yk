import transformAirtableFields from "$lib/transform-airtable-fields";

export const transformLocationData = (items: IPipedreamAirtableLocation[]): ILocationInList[] => {
	return items.map((item) => {
		return {
			id: item.id,
			...transformAirtableFields(item),
		};
	});
};
