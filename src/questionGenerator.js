import enquirer from "enquirer";
import nextQuestion from "./nextQuestion.js";
import jockerAuswahl from "./jocker/jockerAuswahl.js";
import { createSpinner } from "nanospinner";
import chalk from "chalk";
import sounds from "./sounds.js";
import congrats from "./congrats.js";

const getQuestion = (frage, name, jockerListe) => {
  const scaleListe =
    jockerListe.fiftyFifty || jockerListe.gruppe || jockerListe.google
      ? [
          { name: "a", message: frage.antworten[0] },
          { name: "b", message: frage.antworten[1] },
          { name: "c", message: frage.antworten[2] },
          { name: "d", message: frage.antworten[3] },
          { name: "J", message: "Joker ziehen" },
        ]
      : [
          { name: "a", message: frage.antworten[0] },
          { name: "b", message: frage.antworten[1] },
          { name: "c", message: frage.antworten[2] },
          { name: "d", message: frage.antworten[3] },
        ];

  const data = enquirer.scale({
    name: "experience",
    message: `${name}, bitte beantworte die ${chalk
      .hex("00c2cb")
      .bold(frage.price + "€")} Frage!  `,
    scale: scaleListe,
    margin: [0, 0, 0, 0],
    choices: [
      {
        name: "answer",
        message: frage.frage,
        initial: 0,
      },
    ],
  });

  return data;
};

const questionGenerator = (spieler, jocker) => {
  const turquise = chalk.hex("00c2cb");
  const red = chalk.hex("ff7777");

  let { name, infoSpieler } = spieler;
  let { jockerListe, frage } = jocker;
  const zeit = parseInt(frage.price / 1000);
  const frameList = [];
  for (let i = 20 + zeit; i >= 0; i--) {
    frameList.push("" + i);
  }

  const spinner = createSpinner().start();
  spinner.update({
    text: "Sekunden Zeit für die Frage",
    color: "white",
    stream: process.stdout,
    frames: frameList,
    interval: 1000,
  });

  const time = setTimeout(() => {
    spinner.stop({ text: red("Zeit ist um"), mark: red("⟶") });
  }, zeit * 1000 + 20000);
  const stopMyTimeOut = () => clearTimeout(time);
  // sounds().play("./data/audio/suspense.mp3");
  getQuestion(frage, name, jockerListe).then((x) => {
    if (frage.checkAntwort(x.answer)) {
      spinner.stop({
        text: turquise("Sehr gut!"),
        mark: turquise("🙂"),
      });
      // sounds().play("./data/audio/correct.mp3");
      stopMyTimeOut();
      if (spieler.listQuestion.length === 0) {
        congrats(spieler);
      } else {
        nextQuestion(spieler, jocker);
      }
    } else if (x.answer === 4) {
      spinner.update({
        text: "Jetzt kommt die Hilfe!!!",
        color: "white",
        stream: process.stdout,
        frames: [".", "o", "0", "@", "*"],
        interval: 100,
      });
      stopMyTimeOut();
      jockerAuswahl(spieler, jocker);
      spinner.stop();
    } else {
      // sounds().play("./data/audio/wrong.mp3");
      spinner.stop({
        text: `Richtige Antwort wäre: ${chalk.underline(
          frage.richtigeAntwort
        )}`,
        mark: red("Leider Falsch... 😢"),
      });
      stopMyTimeOut();
      spieler.darfSpielen = false;
      console.log(
        chalk
          .hex("03989e")
          .bold(
            `Du hast ${
              frage.price >= 30000 ? 30000 : frage.price >= 1000 ? 1000 : 0
            }€ gewonnen!`
          )
      );
    }
  });
};

export default questionGenerator;
