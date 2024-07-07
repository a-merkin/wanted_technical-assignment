import { WAMPClient } from "./index";

const wampService = new WAMPClient(import.meta.env['VITE_SOCKET_URL'])

export default wampService