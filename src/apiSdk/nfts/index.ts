import axios from 'axios';
import queryString from 'query-string';
import { NftInterface, NftGetQueryInterface } from 'interfaces/nft';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getNfts = async (query?: NftGetQueryInterface): Promise<PaginatedInterface<NftInterface>> => {
  const response = await axios.get('/api/nfts', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createNft = async (nft: NftInterface) => {
  const response = await axios.post('/api/nfts', nft);
  return response.data;
};

export const updateNftById = async (id: string, nft: NftInterface) => {
  const response = await axios.put(`/api/nfts/${id}`, nft);
  return response.data;
};

export const getNftById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/nfts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteNftById = async (id: string) => {
  const response = await axios.delete(`/api/nfts/${id}`);
  return response.data;
};
