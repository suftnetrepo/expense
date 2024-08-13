/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */
/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { getRealmInstance } from './store';
import { Child, Vaccine } from '../model/types';
import { queryChildById } from '../model/child';
import { queryVaccineById } from '../model/vaccine';

export interface Card {
  card_id: string;
  child_id: string;
  vaccine_id: string;
  date: Date;
  time: Date;
  status: number;
  reminder?: number;
  provider: string;
  vaccine?: Vaccine | null;
  child?: Child | null;
}

const insertCard = async (card: Omit<Card, 'card_id'>): Promise<Card> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const newCard = {
          card_id: guid(),
          ...card,
        };
        realm.create('Card', newCard);
        resolve(newCard);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryAllCards = async (): Promise<Card[]> => {
  try {
    const realm = await getRealmInstance();
    const cards = realm
      .objects<Card>('Card')
      .sorted('date');

    const cardDetails = await Promise.all(
      cards.map(async card => {
        const child = (await queryChildById(card.child_id)) || null;
        const vaccine = (queryVaccineById(card.vaccine_id)) || null;

        return {
          card_id: card.card_id,
          child_id: card.child_id,
          vaccine_id: card.vaccine_id,
          date: card.date,
          provider: card.provider,
          time: card.time,
          status: card.status,
          reminder: card.reminder,
          child,
          vaccine,
        };
      })
    );

    return cardDetails;
  } catch (error) {
    throw error;
  }
};

const queryCardsByStatus = async (status: number): Promise<Card[]> => {
  try {
    const realm = await getRealmInstance();
    const cards = realm
      .objects<Card>('Card')
      .filtered('status == $0', status)
      .sorted('date');

    const cardDetails = await Promise.all(
      cards.map(async card => {
        const child = (await queryChildById(card.child_id)) || null;
        const vaccine = queryVaccineById(card.vaccine_id) || null;

        return {
          card_id: card.card_id,
          child_id: card.child_id,
          vaccine_id: card.vaccine_id,
          date: card.date,
          provider: card.provider,
          time: card.time,
          status: card.status,
          reminder: card.reminder,
          child,
          vaccine,
        };
      })
    );

    return cardDetails;
  } catch (error) {
    throw error;
  }
};

const queryCardsByChildId = async (child_id: string): Promise<Card[]> => {
  try {
    const realm = await getRealmInstance();
    const cards = realm
      .objects<Card>('Card')
      .filtered('child_id == $0', child_id)
      .sorted('date');

    const cardDetails = await Promise.all(
      cards.map(async card => {
        const child = (await queryChildById(card.child_id)) || null;
        const vaccine = queryVaccineById(card.vaccine_id) || null;

        return {
          card_id: card.card_id,
          child_id: card.child_id,
          vaccine_id: card.vaccine_id,
          date: card.date,
          provider: card.provider,
          time: card.time,
          status: card.status,
          reminder: card.reminder,
          child,
          vaccine,
        };
      })
    );

    return cardDetails;
  } catch (error) {
    throw error;
  }
};

const queryCardsByDate = async (): Promise<{ cards: Card[]; count: number }> => {
  try {
    const realm = await getRealmInstance();
    const now = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(now.getDate() - 14);

    const results = realm
      .objects<Card>('Card')
      .filtered(
        'date >= $0 AND date <= $1 AND status == $2',
        twoWeeksAgo,
        now,
        0
      );
     
      const cards = await Promise.all(
        results.map(async card => {
          const child = (await queryChildById(card.child_id)) || null;
          const vaccine = queryVaccineById(card.vaccine_id) || null;

          return {
            card_id: card.card_id,
            child_id: card.child_id,
            vaccine_id: card.vaccine_id,
            date: card.date,
            provider: card.provider,
            time: card.time,
            status: card.status,
            reminder: card.reminder,
            child,
            vaccine,
          };
        })
      );
   
    return {cards: cards, count: cards.length};
  } catch (error) {
    throw error;
  }
};

const updateCard = async (card: Card): Promise<Card> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const updateCard = realm.objectForPrimaryKey<Card>('Card', card.card_id);
        if (updateCard) {
          updateCard.child_id = card.child_id;
          updateCard.vaccine_id = card.vaccine_id;
          updateCard.date = card.date;
          updateCard.time = card.time;
          updateCard.status = card.status;
          updateCard.reminder = card.reminder;
          updateCard.provider = card.provider;
          resolve(updateCard);
        } else {
          reject(new Error('Card not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteCard = async (card_id: string): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const card = realm.objectForPrimaryKey<Card>('Card', card_id);
        if (card) {
          realm.delete(card);
          resolve(true);
        } else {
          reject(new Error('Card not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertCard,
  updateCard,
  queryAllCards,
  deleteCard,
  queryCardsByStatus,
  queryCardsByChildId,
  queryCardsByDate,
};