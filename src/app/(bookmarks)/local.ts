import { JsonDataProvider, Remult } from "remult";
export const remultLocal = new Remult(new JsonDataProvider(localStorage));
