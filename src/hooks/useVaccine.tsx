/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { queryAllVaccines } from "../model/vaccine";
import { Vaccine } from "../model/types";

interface Initialize {
	data: Vaccine[] | null | Vaccine | [] | boolean;
	error: Error | null;
	loading: boolean;
}

const useVaccines = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadVaccines() {
		try {
			const result = queryAllVaccines();
			setData(prev => ({
				...prev,
				data: result,
				loading: false,
			}));
		} catch (error) {
			setData({
				data: null,
				error: error as Error,
				loading: false,
			});
		}
	}

	useEffect(() => {
		loadVaccines();
	}, []);

	const resetHandler = () => {
		setData({
			data: null,
			error: null,
			loading: false,
		});
	}

	return {
		...data,
		loadVaccines,
		resetHandler
	};
};



export { useVaccines };
