/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { queryAllChildren, insertChild, updateChild, deleteChild } from "../model/child";
import { Child } from "../model/types";

interface Initialize {
	data: Child[] | null | Child | [] | boolean;
	error: Error | null;
	loading: boolean;
}

const useChildren = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadChildren() {
		try {
			const result = await queryAllChildren();
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
		loadChildren();
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
		loadChildren,
		resetHandler
	};
};


const useInsertChild = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const insertHandler = async (
		child: Child
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await insertChild(child);
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
		insert: insertHandler,
		resetHandler
	};
};

const useUpdateChild = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const updateHandler = async (
		child: Child
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const user = await updateChild(child);
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
		update: updateHandler,
		resetHandler
	};
};

const useDeleteChild = () => {
	const [data, setData] = useState<{
		data: boolean;
		error: Error | null;
		loading: boolean;
	}>({
		data: false,
		error: null,
		loading: false,
	});

	const deleteHandler = async (child_id: string) => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const result = await deleteChild(child_id);
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
		deleteChild: deleteHandler,
		resetHandler
	};
};

export { useDeleteChild, useInsertChild, useChildren, useUpdateChild };
