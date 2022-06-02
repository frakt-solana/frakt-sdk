import { ORACLE_URL_BASE } from '../../common/constants';

export const getNftMarketLowerPriceByCreator = async (creatorAddress: string): Promise<number | null> => {
  try {
    const res = await fetch(`${ORACLE_URL_BASE}/creator/${creatorAddress}`);
    const data = await res.json();

    return data?.floor_price || null;
  } catch (error) {
    console.error(error);
  }

  return null;
};
