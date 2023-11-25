import bcrypt from 'bcryptjs';

const hashData = async (data: string): Promise<string> => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(data, saltRounds);
    return hash;
  } catch (error) {
    throw new Error('Erro ao criar hash');
  }
};

const compareHash = async (userInput: string, hashedData: string): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(userInput, hashedData);
    return match;
  } catch (error) {
    throw new Error('Erro ao comparar hashes');
  }
};

const validateUserCredentials = async (email: string, password: string, users: any[]): Promise<any | null> => {
  for (const user of users) {
    const isEmailMatch = await compareHash(email, user.email);
    const isPasswordMatch = await compareHash(password, user.password);

    if (isEmailMatch && isPasswordMatch) {
      return user;
    }
  }
  
  return null;
};

const countAdmins = (users: any[]): number => {
  const adminUsers = users.filter((user) => user.isAdmin);
  return adminUsers.length;
};

export { compareHash, countAdmins, hashData, validateUserCredentials };

