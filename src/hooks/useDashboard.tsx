/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import {
	getDailyTransaction,
	getDailyTransactionPercentageChange,
	getMonthlySales,
	getWeeklyTransactions,
	getDailyTransactionTrend,
	WeeklyTransactionsData,
	getWeeklySales,
	TransactionsData,
	getTransactions
	
} from "../model/dashboard";

interface Initialize {
	data:
		| []
		| null
		| number
		| string
		| Record<string, unknown>
		| WeeklyTransactionsData[]
		| TransactionsData[]
	error: Error | null;
	loading: boolean;
}

const useDailyTransaction = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const result = await getDailyTransaction();
				setData((prev) => ({
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
		load();
	}, []);

	return {
		...data
	};
};

const useTransactionTrend = () => {
	const [data, setData] = useState<{
		dailyTransaction: number;
		trend: string;
		percentageChange: number;
		error: Error | null;
		loading: boolean
	}>({
		dailyTransaction: 0,
		trend: "",
		percentageChange: 0,
		error : null,
		loading : false
	});

	useEffect(() => {
		async function load() {
			try {
				const result = await getDailyTransactionTrend();
				setData((prev) => ({
					...prev,
					...result,
					loading: false,
				}));
			} catch (error) {
				setData({
					dailyTransaction: 0,
					trend: "",
					percentageChange: 0,
					error: error as Error,
					loading: false,
				});
			}
		}
		load();
	}, []);

	return {
		...data
	};
};

const useDailyTransactionPercentageChange = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const result = await getDailyTransactionPercentageChange();
				setData((prev) => ({
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
		load();
	}, []);

	return {
		...data
	};
};

const useMonthlySales = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const result = await getMonthlySales();
				setData((prev) => ({
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
		load();
	}, []);

	return {
		...data
	};
};


const useWeeklyTransactions = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const result = await getWeeklyTransactions();
				setData((prev) => ({
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
		load();
	}, []);

	return {
		...data
	};
};

const useWeeklySales = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const result = await getWeeklySales();
				setData((prev) => ({
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
		load();
	}, []);

	return {
		...data
	};
};

const useTransactions = (period :string) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function load(period: string) {
		try {
			const result = await getTransactions(period);
			setData((prev) => ({
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
		load(period);
	}, [period]);

	return {
		...data
	};
};

export {
	useWeeklyTransactions,
	useDailyTransaction,
	useTransactionTrend,
	useDailyTransactionPercentageChange,
	useMonthlySales,
	useWeeklySales,
	useTransactions
};
