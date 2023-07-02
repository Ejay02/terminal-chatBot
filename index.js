import openai from "./config/open-ai.js";
import readlineSync from "readline-sync";
import colors from "colors";

async function main() {
  console.log(colors.bold.blue("Welcome to the chatbot program!"));
  console.log(colors.italic.magenta("You can start chatting with BOT"));

  const chatHistory = []; // store chat history

  while (true) {
    const userInput = readlineSync.question(colors.bold.yellow("You: "));

    try {
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      })); // reiterate over history and construct messages

      messages.push({ role: "user", content: userInput }); // add lastest user input

      // cAll API with user input
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userInput }],
      });

      // get comp text / content
      const completionText = completion.data.choices[0].message.content;

      if (userInput.toLocaleLowerCase() === "exit") {
        console.log(colors.green("Bot: " + completionText));
        return;
      }

      console.log(colors.green("Bot: " + completionText));

      //update history with user input and ass response
      chatHistory.push(["user", userInput]);
      chatHistory.push(["assistant", completionText]);
    } catch (error) {
      console.log("error:", error);
      // console.error(colors.bold.red(error));
    }
  }
}

main();
