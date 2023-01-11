type PromptKeys = "key" | "message";
type PromptConfig = Record<PromptKeys, string>;

const ask = async (text: string) =>
  await Deno.stdout.write(new TextEncoder().encode(`${text}\n`));

const read = async () => {
  const buffer = new Uint8Array(1024);
  const input = await Deno.stdin.read(buffer);
  return input
    ? new TextDecoder().decode(buffer.subarray(0, input)).trim()
    : "";
};

const prompt = async <P extends PromptConfig, K extends P["key"]>(
  params: P[],
): Promise<Record<K, string>> => {
  const results = {} as Record<K, string>;

  for (const param of params) {
    await ask(param.message);
    const answer = await read();
    results[param.key as K] = answer;
  }

  return results;
};

const answers = await prompt([
  {
    key: "name",
    message: "What's your name?",
  },
  {
    key: "age",
    message: "What's your age again?",
  },
  {
    key: "pet",
    message: "What's your pet name?",
  },
]);

console.log(answers);
