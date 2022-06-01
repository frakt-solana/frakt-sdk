import { ORACLE_URL_BASE } from '../../common/constants';

const getNftMarketLowerPriceByCreator = async (creatorAddress: string): Promise<number | null> => {
  try {
    const res = await fetch(`${ORACLE_URL_BASE}/creator/${creatorAddress}`);
    const data = await res.json();

    return data?.floor_price || null;
  } catch (error) {
    console.error(error);
  }

  return null;
};

export default getNftMarketLowerPriceByCreator;
