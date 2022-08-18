import { Buffer } from "buffer";

export default (url: string) =>
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => Buffer.from(buffer).toString("base64"));
