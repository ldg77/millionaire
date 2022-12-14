import enquirer from "enquirer";
import fiftyFifty from "./fiftyFifty.js";
import klasseDci from "./klasseDci.js";
import google from "./google.js";
import sounds from "../sounds.js";
const jockerAuswahl = (spieler, jocker) => {
  const data = enquirer.scale({
    name: "experience",
    message: `${
      spieler.name
    }, wähle ein verfühgbaren Joker: ${jocker.showJockerListe()}`,
    scale: jocker.generateJockerAuswahl(),
    margin: [0, 0, 0, 0],
    choices: [
      {
        name: "answer",
        message: "Wähle Joker",
        initial: 1,
      },
    ],
  });
  // sounds().play("./data/audio/suspense.mp3");
  data
    .then((x) => jocker.generateJockerAuswahl()[x.answer])
    .then(({ message }) => {
      jocker.jockerListe[message] = false;
      switch (message) {
        case "fiftyFifty":
          fiftyFifty(spieler, jocker);
          break;
        case "gruppe":
          klasseDci(spieler, jocker);
          break;
        case "google":
          google(spieler, jocker);
          break;
      }
    });
};

export default jockerAuswahl;
