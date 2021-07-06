/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MachineConfig, StateSchema, DoneInvokeEvent } from "xstate";
import { createMachine, assign } from "xstate";
import { createModel } from "xstate/lib/model.js";
import { INITIAL_LOC_FILTERS } from "$lib/constants";

interface IVaxContext {
	locations: ILocationInList[];
	allLocations: ILocationInList[];
	activeFilters: ILocFilter;
}

type ApplyFilterEvent = {
	type: "APPLY_FILTER";
	query: Partial<ILocFilter>;
};

type VaxEvent = ApplyFilterEvent | { type: "RESET" };

// interface IFilterableStateSchema extends StateNodeConfig {}
interface IFilterableStateSchema {
	type: "parallel";
	states: {
		data: {
			type: "compound";
			states: {
				all: Record<string, unknown>;
				filtered: Record<string, unknown>;
			};
			[propertyName: string]: any;
		};
	};
}

// = = = = = = = =
// = = = = = = = =

/** Only proceed filtering if the query is valid */
export const filterValid = (ctx: IVaxContext, evt: ApplyFilterEvent): boolean => {
	const { query } = evt;
	const isValid =
		typeof query == "object" &&
		Object.getOwnPropertyNames(query).length &&
		["AGE", "CITY", "KTP_ANY_LOCATION"].includes(Object.getOwnPropertyNames(query)[0]); // ! This can only handle 1 filter. Refactor if applying multiple-property filter.
	console.log("🚦 filtervalid?", isValid);
	return isValid;
};

export const updateActiveFilters = (ctx: IVaxContext, evt: ApplyFilterEvent): ILocFilter => {
	console.log("🚦 updateActiveFilters...");
	return {
		...ctx.activeFilters,
		...evt.query,
	};
};

// Sample function - replace with actual function from the component
const fetchLocations = async (): Promise<ILocationInList[]> => {
	const fakeData: ILocationInList[] = [];
	return new Promise((resolve) => setTimeout(() => resolve(fakeData), 1000));
};

const updateLocations = (ctx: IVaxContext): ILocationInList[] => {
	console.log("🚦 updateLocations", ctx.activeFilters);

	// Get updated active filters and filter locations data.
	const data = ctx.allLocations
		.filter((loc) => (ctx.activeFilters.AGE ? loc.ageGroups.includes(ctx.activeFilters.AGE) : loc))
		.filter((loc) => (ctx.activeFilters.CITY ? loc.city == ctx.activeFilters.CITY : loc))
		.filter((loc) => (ctx.activeFilters.KTP_ANY_LOCATION ? loc.ktpAnyLocation : loc));
	return data;
};

// = = = = = = = =
// = = = = = = = =

const filterableState: IFilterableStateSchema = {
	type: "parallel",
	states: {
		data: {
			type: "compound",
			initial: "all",
			on: {
				APPLY_FILTER: {
					target: "data.filtered",
					cond: "filterValid",
					// actions: "handleFilter",
					actions: ["foo", "bar"],
				},
			},
			states: {
				all: {},
				filtered: {
					on: {
						RESET: {
							target: "all",
							actions: "handleReset",
						},
					},
				},
			},
		},
		// ?? next iteration
		// multiFilters: { type: "compound", initial: "closed", on: {}, states: { closed: { on: { OPEN_MULTI_FILTER: "open" } }, open: { on: { APPLY: { target: ["closed", "#vax-machine.loaded.data.filtered"], }, CANCEL: "closed" } }, }, },
	},
};

export const vaxModel = createModel({
	locations: [] as ILocationInList[],
	allLocations: [] as ILocationInList[],
	activeFilters: INITIAL_LOC_FILTERS,
});

// :MachineConfig<IVaxContext, StateSchema<IVaxContext>, VaxEvent>
export const vaxMachineConfig = {
	id: "vax-machine",
	initial: "loading",
	context: vaxModel.initialContext,
	states: {
		loading: {
			invoke: {
				src: "fetchLocations",
				onDone: {
					target: "loaded",
					actions: assign({
						locations: (context, event: DoneInvokeEvent<ILocationInList[]>) => event.data,
						allLocations: (context, event: DoneInvokeEvent<ILocationInList[]>) => event.data,
					}),
				},
				onError: {
					target: "failure",
				},
			},
		},
		loaded: filterableState,
		failure: {
			// on: { RETRY: "loading" },
		},
	},
};

// export const vaxMachineOptions: Partial<MachineOptions<IVaxContext, VaxEvent>> = {}
export const vaxMachineOptions = {
	actions: {
		// model.assign() must be called from inside the options, not from a separate handleFilter() fn.
		// see: https://xstate.js.org/docs/guides/actions.html#actions
		handleFilter: vaxModel.assign({
			locations: updateLocations,
			activeFilters: updateActiveFilters,
		}),
		handleReset: vaxModel.assign({
			locations: (context) => context.allLocations,
			activeFilters: INITIAL_LOC_FILTERS,
		}),
		foo: vaxModel.assign({ activeFilters: updateActiveFilters }),
		bar: vaxModel.assign({ locations: updateLocations }),
	},
	guards: { filterValid },
	services: { fetchLocations },
};

// export const vaxMachine = createMachine<IVaxContext, VaxEvent, VaxState>
export const vaxMachine = createMachine<typeof vaxModel>(vaxMachineConfig, vaxMachineOptions);
