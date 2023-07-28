import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

/**
 *
 * @param {*} title Title of the notifcation
 * @param {*} body Body of the notification
 * @param {*} type Type of notificaiton (success=green, warning=yellow, danger=red). More on https://www.npmjs.com/package/react-notifications-component
 */
export default function notification(title, body, type) {
  Store.addNotification({
    title: `${title}`,
    message: `${body}`,
    type: type,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__heartBeat"],
    animationOut: ["animate__animated", "animate__heartBeat"],
    dismiss: {
      duration: 3500,
      onScreen: false,
    },
  });
}
