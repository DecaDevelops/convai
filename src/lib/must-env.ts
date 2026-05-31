const mustEnv = (variable: string) => {
  const result = process.env[variable];

  if (!result)
    throw new Error(
      `${variable} was not found in the .env/.env.local file, make sure it exists`,
    );

  return result;
};

export default mustEnv;
