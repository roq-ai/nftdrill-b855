import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { nftValidationSchema } from 'validationSchema/nfts';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.nft
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getNftById();
    case 'PUT':
      return updateNftById();
    case 'DELETE':
      return deleteNftById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getNftById() {
    const data = await prisma.nft.findFirst(convertQueryToPrismaUtil(req.query, 'nft'));
    return res.status(200).json(data);
  }

  async function updateNftById() {
    await nftValidationSchema.validate(req.body);
    const data = await prisma.nft.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteNftById() {
    const data = await prisma.nft.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
