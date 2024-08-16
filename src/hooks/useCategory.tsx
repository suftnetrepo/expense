/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { queryAllCategories, queryCategoriesByStatus, queryCategoryById, deleteCategory, insertCategory, updateSingleCategory, updateCategory } from "../model/category";
import { Category } from "../model/types";

interface Initialize {
	data: Category[] | null | Category;
	error: Error | null;
	loading: boolean;
}

const useCategories = () => {	
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadHandler() {
		
		try {
			const result = await queryAllCategories();		
			setData(prev => {			
				return {
					...prev,
					data: result,
					loading: false,
				};
			});
			return true
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

	const deleteRefresh = (category_id: string) => {		
		setData(prev => {			
			if (Array.isArray(prev.data)) {
				return {
					...prev,
					data: prev.data.filter(category => category.category_id !== category_id),
				};
			}			
			return prev;
		});
	};

	const updateRefresh = (category_id: string, status: number) => {
		setData(prev => {
			if (Array.isArray(prev.data)) {
				return {
					...prev,
					data: prev.data.map(category =>
						category.category_id === category_id
							? { ...category, status: status }
							: category
					),
				};
			}
			return prev;
		});
	};

	return {
		...data,		
		loadHandler,
		resetHandler,
		deleteCategory,
		deleteRefresh, 
		updateRefresh		
	};
};

const useQueryCategoriesByStatus = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadCategoriesByStatus(status: number) {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const result = await queryCategoriesByStatus(status);
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
	}

	useEffect(() => {		
		loadCategoriesByStatus(1);
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
		resetHandler
	};
};
const useQueryCategoryById = async (category_id: string) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	useEffect(() => {
		async function load() {
			try {
				const results = await queryCategoryById(category_id);
				setData({
					data: results,
					error: null,
					loading: false,
				});
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

	const resetHandler = () => {
		setData({
			data: null,
			error: null,
			loading: false,
		});
	}

	return {
		...data,
		resetHandler
	};
};
const useInsertCategory = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const insertCategoryHandler = async (
		name: string,
		status: number = 0,
		color_code : string
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await insertCategory(name, status, color_code);
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
		insertCategory: insertCategoryHandler,
		resetHandler
	};
};
const useUpdateCategory = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const updateSingleCategoryHandler = async (
		category_id: number,
		status: number		
	) => {		
		setData((prev) => ({ ...prev, loading: true }));
		const result = await updateSingleCategory(category_id, status);
		return result
	}

	const updateCategoryHandler = async (
		category_id: number,
		name: string,
		status: number,
		color_code : string
	) => {
		setData((prev) => ({ ...prev, loading: true }));
		
		try {
			const result = await updateCategory(category_id, name, status, color_code);
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
		updateSingleCategoryHandler,
		updateCategory: updateCategoryHandler,		
		resetHandler
	};
};
const useDeleteCategory = () => {
	const [data, setData] = useState<{
		data: boolean;
		error: Error | null;
		loading: boolean;
	}>({
		data: false,
		error: null,
		loading: false,
	});

	const deleteCategoryHandler = async (category_id: number) => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const result = await deleteCategory(category_id);
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
		deleteCategory: deleteCategoryHandler,
		resetHandler
	};
};

export { useInsertCategory, useUpdateCategory, useQueryCategoriesByStatus, useQueryCategoryById, useDeleteCategory, updateCategory, useCategories };
