import { Command } from "commander";
import { createDatabase, getDatabase } from "./index";

const program = new Command();

program
  .command("restart")
  .description("Restarts databse")
  .action(async () => {
    try {
      const database = await createDatabase();
      console.log("Database created.");
    } catch (e) {
      console.log(e);
    }
  });

program.parse(process.argv);
