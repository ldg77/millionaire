import { createSpinner } from "nanospinner";
import enquirer from "enquirer";
import nextQuestion from "../nextQuestion.js";
import sounds from "../sounds.js";
import congrats from "../congrats.js";
const klasseDci = (spieler, jocker) => {
  const arr = [];
  for (let i = 60; i > 0; i--) {
    arr.push("" + i);
  }
  const spinner = createSpinner().start();
  spinner.update({
    text: `<= Sekunden übrig, hier nochmal die Frage: ${jocker.frage.frage}`,
    color: "white",
    stream: process.stdout,
    frames: arr,
    interval: 1000,
  });

  const time = setTimeout(() => {
    spinner.stop({ text: "Zeit ist um", mark: ":(", color: "red" });
  }, 59000);
  const stopMyTimeOut = () => clearTimeout(time);

  const data = enquirer.scale({
    name: "experience",
    message: `${spieler.name}, bitte beantworte die ${jocker.frage.price}€ Frage!  `,
    scale: [
      { name: "a", message: jocker.frage.antworten[0] },
      { name: "b", message: jocker.frage.antworten[1] },
      { name: "c", message: jocker.frage.antworten[2] },
      { name: "d", message: jocker.frage.antworten[3] },
    ],
    margin: [0, 0, 0, 0],
    choices: [
      {
        name: "answer",
        message: jocker.frage.frage,
        initial: 0,
      },
    ],
  });
  // sounds().play("./data/audio/suspense.mp3");
  data.then((x) => {
    stopMyTimeOut();
    spinner.stop();
    if (jocker.frage.checkAntwort(x.answer)) {
      // sounds().play("./data/audio/correct.mp3");

      jocker.jockerListe.gruppe = false;
      if (spieler.listQuestion.length === 0) {
        congrats(spieler);
      } else {
        nextQuestion(spieler, jocker);
      }
    } else {
      // sounds().play("./data/audio/wrong.mp3");
      spieler.darfSpielen = false;
      spinner.stop({
        text: `Richtige Antwort wäre ${jocker.frage.richtigeAntwort}`,
        mark: "Leider Falsch...",
        color: "red",
      });
      console.log(
        `Du hast ${
          jocker.frage.price >= 30000
            ? 30000
            : jocker.frage.price >= 1000
            ? 1000
            : 0
        } € gewonnen!`
      );
    }
  });
};
export default klasseDci;
