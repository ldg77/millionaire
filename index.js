import gradient from "gradient-string";
import figlet from "figlet";

import Spieler from "./classes/spieler.js";
import Jocker from "./classes/jocker.js";
import questionGenerator from "./src/questionGenerator.js";
import getUser from "./src/getUser.js";
import radar from "./src/radar.js";
import fragenDB from "./data/fragenDB.js";
import congrats from "./src/congrats.js";

const showTitel = (param1, param2) => {
  figlet.text(
    " W e r  w i r d  M i l l i o n ä r ?",
    {
      horizontalLayout: "default",
      verticalLayout: "fitted",
      width: 1000,
      whitespaceBreak: true,
    },
    function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      /* wird  " W e r  w i r d  M i l l i o n ä r ?" angezeigt */
      console.clear();
      console.log(gradient.cristal(data));
      if (param2 instanceof Jocker) {
        param2.frage = fragenDB.getRandomItem(
          !undefined ? param1.listQuestion.shift() : console.log(congrats())
        );
        questionGenerator(param1, param2);
      } else {
        param1().then((x) => {
          const spieler = new Spieler(x);
          const jocker = new Jocker(x);
          console.clear();
          showTitel(spieler, jocker);
        });
      }
    }
  );
};

// Aufrufen vom titel mit InfoAbfrage

radar("Loading Anna&Dima&Mohamad ...");
setTimeout(() => showTitel(getUser), 2000);

// showLosGehts....
export default showTitel;
