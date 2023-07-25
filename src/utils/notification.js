import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

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
