/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { queryAllCards, insertCard, updateCard, deleteCard, queryCardsByChildId, queryCardsByDate, queryCardsByStatus } from "../model/card";
import { Card } from "../model/types";

interface Initialize {
	data: Card[] | null | Card | [] | boolean | number | { cards: Card[]; count: number; };
	error: Error | null;
	loading: boolean;
}

const useCards = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadCards() {
		try {
			const result = await queryAllCards();
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
		loadCards();
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
		loadCards,
		resetHandler
	};
};

const useQueryCardsByDate = () => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadCards() {
		try {
			const result = await queryCardsByDate();
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
		loadCards();
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
		loadCards,
		resetHandler
	};
};

const useQueryCardByChild = (child_id: string) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadCards(child_id: string) {
		try {
			const result = await queryCardsByChildId(child_id);
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
		loadCards(child_id);
	}, [child_id]);

	const resetHandler = () => {
		setData({
			data: null,
			error: null,
			loading: false,
		});
	}

	return {
		...data,
		loadCards,
		resetHandler
	};
};

const useQueryCardByStatus = (status: number) => {
	const [data, setData] = useState<Initialize>({
		data: [],
		error: null,
		loading: true,
	});

	async function loadCards(status: number) {
		try {
			const result = await queryCardsByStatus(status);
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
		loadCards(status);
	}, [status]);

	const resetHandler = () => {
		setData({
			data: null,
			error: null,
			loading: false,
		});
	}

	return {
		...data,
		loadCards,
		resetHandler
	};
};

const useInsertCard = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const insertHandler = async (
		card: Card
	) => {
		setData((prev) => ({ ...prev, loading: true }));

		try {
			const result = await insertCard(card);
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

const useUpdateCard = () => {
	const [data, setData] = useState<Initialize>({
		data: null,
		error: null,
		loading: false,
	});

	const updateHandler = async (
		card: Card
	) => {
		setData((prev) => ({ ...prev, loading: true }));
		
		try {
			const user = await updateCard(card);
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

const useDeleteCard = () => {
	const [data, setData] = useState<{
		data: boolean;
		error: Error | null;
		loading: boolean;
	}>({
		data: false,
		error: null,
		loading: false,
	});

	const deleteHandler = async (card_id: string) => {
		setData((prev) => ({ ...prev, loading: true }));
		try {
			const result = await deleteCard(card_id);
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
		deleteCard: deleteHandler,
		resetHandler
	};
};

export { useDeleteCard, useInsertCard, useCards, useUpdateCard, useQueryCardByChild, useQueryCardsByDate, useQueryCardByStatus };
