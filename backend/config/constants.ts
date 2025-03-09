import prisma from "./prisma";

export const ALLOWD_ORIGNS = [
  process.env.CLIENT_ORIGIN || "http://localhost:5173",
  "http://localhost:4173",
  "http://10.240.68.112:5173",
];

export const COMMENT_SELECT_FIELDS = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const FAKE_USER_ID = (
  await prisma.user.findFirst({ where: { name: "Kyle" } })
)?.id;
