/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { queryAllExpenses,queryExpensesByDateRange, insertExpense,updateExpense,deleteExpense } from "../model/expense";
import { Expense } from "../model/types";

interface Initialize {
	data: Expense[] | null | Expense | [] | boolean;
	error: Error | null;
	loading: boolean;
}

const useExpenses = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadHandler() {
		try {
			const result = await queryAllExpenses();
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

	async function loadExpensesByDateRange(startDate: Date, endDate: Date) {
		try {
			const result = await queryExpensesByDateRange(startDate, endDate);
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
		loadHandler();
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
		loadHandler,
		resetHandler,
		loadExpensesByDateRange
	};
};

const useInsertExpense = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});
	
	const insertHandler = async (
		expense: Expense
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await insertExpense(expense);
			setData({
				data: result,
				error: null,
				loading: false,
			});
			return true
		} catch (error) {
			setData({
				data: null,
				error: error as Error,
				loading: false,
			});
		}
	};

	const resetHandler = () => {
		setData({
			data: null,
			error: null,
			loading: false,
		});
	}

	return {
		...data,
		insertHandler,
		resetHandler
	};
};

const useUpdateExpense = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const updateHandler = async (
		expense: Expense
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const user = await updateExpense(expense);
			setData({
				data: user,
				error: null,
				loading: false,
			});
			return true
		} catch (error) {
			setData({
				data: null,
				error: error as Error,
				loading: false,
			});
		}
	};

	const resetHandler = () => {
		setData({
			data: null,
			error: null,
			loading: false,
		});
	}

	return {
		...data,
		updateHandler,
		resetHandler
	};
};

const useDeleteExpense = () => {
	const [data, setData] = useState<{
		data: boolean;
		error: Error | null;
		loading: boolean;
	}>({
		data: false,
		error: null,
		loading: false,
	});

	const deleteHandler = async (expense_id: string) => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const result = await deleteExpense(expense_id);
			setData({
				data: result,
				error: null,
				loading: false,
			});
			return true
		} catch (error) {
			setData({
				data: false,
				error: error as Error,
				loading: false,
			});
		}
	};

	const resetHandler = () => {
		setData({
			data: false,
			error: null,
			loading: false,
		});
	}

	return {
		...data,
		deleteHandler,
		resetHandler
	};
};

export { useDeleteExpense, useInsertExpense, useExpenses, useUpdateExpense };
