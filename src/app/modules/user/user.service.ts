import { IUSER } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUSER>) => {
  const { name, email } = payload;

  const user = await User.create({ name, email });

  return user;
};

const getAllUser = async () => {
  const users = await User.find({});

  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const userServices = {
  createUser,
  getAllUser,
};
