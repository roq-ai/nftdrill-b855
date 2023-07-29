const mapping: Record<string, string> = {
  companies: 'company',
  invitations: 'invitation',
  nfts: 'nft',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
