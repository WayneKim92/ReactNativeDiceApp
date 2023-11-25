import AsyncStorage from '@react-native-async-storage/async-storage';

const setItem = AsyncStorage.setItem;
const getItem = AsyncStorage.getItem;

export const KeyValueStorageKeys = {
  LATEST_DICE_COUNT: 'LATEST_DICE_COUNT',
  DICE_COUNT_HISTORY: 'DICE_COUNT_HISTORY',
};

export const setLatestDiceCount = async (count: number) => {
  try {
    await setItem(KeyValueStorageKeys.LATEST_DICE_COUNT, String(count));
  } catch (e) {
    console.log('🐞e', e);
  }
};

export const getLatestDiceCount = async () => {
  try {
    const latestDiceCount = await getItem(
      KeyValueStorageKeys.LATEST_DICE_COUNT,
    );
    return Number(latestDiceCount);
  } catch (e) {
    console.log('🐞e', e);
  }
};

export const setDiceCountHistory = async (count: number) => {
  try {
    const historyStr =
      (await getItem(KeyValueStorageKeys.DICE_COUNT_HISTORY)) ?? '{}';

    const history = JSON.parse(historyStr);
    const str = JSON.stringify({
      ...history,
      [Date.now()]: count,
    });
    await setItem(KeyValueStorageKeys.DICE_COUNT_HISTORY, str);
  } catch (e) {
    console.log('🐞e', e);
  }
};

export const getDiceCountHistory = async () => {
  try {
    const historyStr =
      (await getItem(KeyValueStorageKeys.DICE_COUNT_HISTORY)) ?? '{}';

    return JSON.parse(historyStr);
  } catch (e) {
    console.log('🐞e', e);
  }
};
