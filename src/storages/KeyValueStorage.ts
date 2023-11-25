import AsyncStorage from '@react-native-async-storage/async-storage';

export const KeyValueStorageKeys = {
  LATEST_DICE_COUNT: 'LATEST_DICE_COUNT',
};

export const setLatestDiceCount = async (count: number) => {
  try {
    await AsyncStorage.setItem(
      KeyValueStorageKeys.LATEST_DICE_COUNT,
      String(count),
    );
  } catch (e) {
    console.log('🐞e');
  }
};

export const getLatestDiceCount = async () => {
  try {
    const latestDiceCount = await AsyncStorage.getItem(
      KeyValueStorageKeys.LATEST_DICE_COUNT,
    );
    return Number(latestDiceCount);
  } catch (e) {
    console.log('🐞e');
  }
};
